from datetime import datetime, timezone

from bson import ObjectId
from flask import Blueprint, request, jsonify, g

from config.database import get_database
from services.groq_service import generate_chatbot_response
from utils.auth_utils import token_required


# ---------------------------------------------------------
# CHATBOT BLUEPRINT
# ---------------------------------------------------------

chatbot_bp = Blueprint(
    "chatbot",
    __name__
)


# ---------------------------------------------------------
# CHATBOT
# ---------------------------------------------------------

@chatbot_bp.route(
    "/chatbot",
    methods=["POST"]
)
@token_required
def chatbot():

    try:

        # ---------------------------------------------
        # REQUEST DATA
        # ---------------------------------------------

        data = request.get_json()

        if not data:

            return jsonify({
                "status": "error",
                "message": "Request body is required."
            }), 400


        prediction_id = str(
            data.get(
                "prediction_id",
                ""
            )
        ).strip()


        user_message = str(
            data.get(
                "message",
                ""
            )
        ).strip()


        # ---------------------------------------------
        # VALIDATION
        # ---------------------------------------------

        if not prediction_id:

            return jsonify({
                "status": "error",
                "message":
                    "Prediction ID is required."
            }), 400


        if not user_message:

            return jsonify({
                "status": "error",
                "message":
                    "Chat message is required."
            }), 400


        if len(user_message) > 1000:

            return jsonify({
                "status": "error",
                "message":
                    "Chat message is too long."
            }), 400


        if not ObjectId.is_valid(
            prediction_id
        ):

            return jsonify({
                "status": "error",
                "message":
                    "Invalid prediction ID."
            }), 400


        # ---------------------------------------------
        # DATABASE
        # ---------------------------------------------

        database = get_database()

        predictions_collection = database[
            "predictions"
        ]

        chats_collection = database[
            "chats"
        ]


        # ---------------------------------------------
        # FIND CURRENT USER'S PREDICTION
        # ---------------------------------------------

        prediction = (
            predictions_collection.find_one({
                "_id":
                    ObjectId(
                        prediction_id
                    ),

                "user_id":
                    g.current_user[
                        "user_id"
                    ]
            })
        )


        if not prediction:

            return jsonify({
                "status": "error",
                "message":
                    "Prediction was not found."
            }), 404


        # ---------------------------------------------
        # RECENT CONVERSATION HISTORY
        # ---------------------------------------------

        recent_chat_records = list(

            chats_collection.find({

                "user_id":
                    g.current_user[
                        "user_id"
                    ],

                "prediction_id":
                    prediction_id

            }).sort(

                "timestamp",
                -1

            ).limit(5)

        )


        # MongoDB returns newest records first.
        # Reverse them so the LLM receives
        # oldest → newest conversation order.

        recent_chat_records.reverse()


        # ---------------------------------------------
        # GENERATE CHATBOT RESPONSE
        # ---------------------------------------------

        assistant_response = (
            generate_chatbot_response(

                user_message=
                    user_message,

                predicted_class=
                    prediction[
                        "predicted_class"
                    ],

                confidence=
                    prediction[
                        "confidence"
                    ],

                probabilities=
                    prediction[
                        "probabilities"
                    ],

                chat_history=
                    recent_chat_records
            )
        )


        # ---------------------------------------------
        # SAVE CHAT
        # ---------------------------------------------

        chat_document = {

            "user_id":
                g.current_user[
                    "user_id"
                ],

            "prediction_id":
                prediction_id,

            "user_message":
                user_message,

            "assistant_response":
                assistant_response,

            "timestamp":
                datetime.now(
                    timezone.utc
                )
        }


        result = (
            chats_collection.insert_one(
                chat_document
            )
        )


        # ---------------------------------------------
        # RESPONSE
        # ---------------------------------------------

        return jsonify({

            "status":
                "success",

            "chat": {

                "id":
                    str(
                        result.inserted_id
                    ),

                "prediction_id":
                    prediction_id,

                "message":
                    user_message,

                "response":
                    assistant_response
            }

        }), 200


    except Exception as error:

        print(
            f"Chatbot error: {error}"
        )

        return jsonify({
            "status": "error",
            "message":
                "The AI chatbot is temporarily unavailable."
        }), 500