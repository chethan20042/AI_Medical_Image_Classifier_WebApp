from datetime import datetime, timezone

from flask import Blueprint, request, jsonify, g

from config.database import get_database
from services.prediction_service import predict_image
from utils.auth_utils import token_required
from services.groq_service import generate_prediction_explanation


# ---------------------------------------------------------
# PREDICTION BLUEPRINT
# ---------------------------------------------------------

prediction_bp = Blueprint(
    "prediction",
    __name__
)


# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------

ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png"
}


# ---------------------------------------------------------
# FILE VALIDATION
# ---------------------------------------------------------

def allowed_file(filename):
    """
    Check whether the uploaded file has an allowed extension.
    """

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


# ---------------------------------------------------------
# PREDICTION
# ---------------------------------------------------------

@prediction_bp.route(
    "/predict",
    methods=["POST"]
)
@token_required
def predict():

    try:

        # ---------------------------------------------
        # CHECK IMAGE
        # ---------------------------------------------

        if "image" not in request.files:

            return jsonify({
                "status": "error",
                "message": "No image file was provided."
            }), 400


        image_file = request.files["image"]


        if image_file.filename == "":

            return jsonify({
                "status": "error",
                "message": "No image was selected."
            }), 400


        if not allowed_file(image_file.filename):

            return jsonify({
                "status": "error",
                "message":
                    "Invalid file type. "
                    "Only JPG, JPEG and PNG images are allowed."
            }), 400


        # ---------------------------------------------
        # AI PREDICTION
        # ---------------------------------------------

        result = predict_image(
            image_file
        )


        # ---------------------------------------------
        # AI-GENERATED EXPLANATION
        # ---------------------------------------------

        try:

            ai_summary = generate_prediction_explanation(
                predicted_class=result["predicted_class"],
                confidence=result["confidence"],
                probabilities=result["probabilities"]
            )

        except Exception as error:

            print(
                f"Groq explanation error: {error}"
            )

            ai_summary = (
                "AI-generated explanation is temporarily unavailable."
            )


        # ---------------------------------------------
        # DATABASE
        # ---------------------------------------------

        database = get_database()

        predictions_collection = database[
            "predictions"
        ]


        # ---------------------------------------------
        # CREATE HISTORY DOCUMENT
        # ---------------------------------------------

        prediction_document = {

            "user_id":
                g.current_user["user_id"],

            "image_filename":
                image_file.filename,

            "predicted_class":
                result["predicted_class"],

            "confidence":
                result["confidence"],

            "probabilities":
                result["probabilities"],

            "ai_summary":
                ai_summary,

            "timestamp":
                datetime.now(
                    timezone.utc
                )
        }


        # ---------------------------------------------
        # SAVE PREDICTION
        # ---------------------------------------------

        inserted_prediction = (
            predictions_collection.insert_one(
                prediction_document
            )
        )


        # ---------------------------------------------
        # RESPONSE
        # ---------------------------------------------

        return jsonify({

            "status": "success",

            "prediction": {

                "id":
                    str(
                        inserted_prediction.inserted_id
                    ),

                "predicted_class":
                    result["predicted_class"],

                "confidence":
                    result["confidence"],

                "probabilities":
                    result["probabilities"],

                "ai_summary":
                    ai_summary,

                "image_filename":
                    image_file.filename
            }

        }), 200


    except ValueError as error:

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400


    except Exception as error:

        print(
            f"Prediction error: {error}"
        )

        return jsonify({
            "status": "error",
            "message":
                "An error occurred while processing the image."
        }), 500


# ---------------------------------------------------------
# PREDICTION HISTORY
# ---------------------------------------------------------

@prediction_bp.route(
    "/history",
    methods=["GET"]
)
@token_required
def prediction_history():

    try:

        database = get_database()

        predictions_collection = database[
            "predictions"
        ]


        # ---------------------------------------------
        # FIND CURRENT USER'S PREDICTIONS
        # ---------------------------------------------

        records = predictions_collection.find({

            "user_id":
                g.current_user["user_id"]

        }).sort(

            "timestamp",
            -1

        )


        # ---------------------------------------------
        # FORMAT RESPONSE
        # ---------------------------------------------

        history = []

        for record in records:

            timestamp = record.get(
                "timestamp"
            )

            if timestamp:

                timestamp = timestamp.isoformat()


            history.append({

                "id":
                    str(record["_id"]),

                "image_filename":
                    record.get(
                        "image_filename"
                    ),

                "predicted_class":
                    record.get(
                        "predicted_class"
                    ),

                "confidence":
                    record.get(
                        "confidence"
                    ),

                "probabilities":
                    record.get(
                        "probabilities"
                    ),

                "ai_summary":
                    record.get(
                        "ai_summary"
                    ),

                "timestamp":
                    timestamp
            })


        return jsonify({

            "status": "success",

            "count":
                len(history),

            "history":
                history

        }), 200


    except Exception as error:

        print(
            f"History error: {error}"
        )

        return jsonify({
            "status": "error",
            "message":
                "Unable to retrieve prediction history."
        }), 500