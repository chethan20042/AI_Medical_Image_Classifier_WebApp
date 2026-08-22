import re
import bcrypt

from bson import ObjectId
from flask import Blueprint, request, jsonify, g

from config.database import get_database


from utils.auth_utils import (
    generate_token,
    token_required
)

# ---------------------------------------------------------
# AUTH BLUEPRINT
# ---------------------------------------------------------

auth_bp = Blueprint(
    "auth",
    __name__
)


# ---------------------------------------------------------
# EMAIL VALIDATION
# ---------------------------------------------------------

def is_valid_email(email):

    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    return re.match(
        email_pattern,
        email
    ) is not None


# ---------------------------------------------------------
# REGISTER
# ---------------------------------------------------------

@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "status": "error",
                "message": "Request body is required."
            }), 400


        full_name = str(
            data.get("full_name", "")
        ).strip()

        email = str(
            data.get("email", "")
        ).strip().lower()

        password = str(
            data.get("password", "")
        )

        confirm_password = str(
            data.get("confirm_password", "")
        )


        # ---------------------------------------------
        # REQUIRED FIELD VALIDATION
        # ---------------------------------------------

        if (
            not full_name
            or not email
            or not password
            or not confirm_password
        ):

            return jsonify({
                "status": "error",
                "message": "All fields are required."
            }), 400


        # ---------------------------------------------
        # NAME VALIDATION
        # ---------------------------------------------

        if len(full_name) < 2:

            return jsonify({
                "status": "error",
                "message":
                    "Full name must contain at least 2 characters."
            }), 400


        # ---------------------------------------------
        # EMAIL VALIDATION
        # ---------------------------------------------

        if not is_valid_email(email):

            return jsonify({
                "status": "error",
                "message":
                    "Please enter a valid email address."
            }), 400


        # ---------------------------------------------
        # PASSWORD VALIDATION
        # ---------------------------------------------

        if len(password) < 8:

            return jsonify({
                "status": "error",
                "message":
                    "Password must contain at least 8 characters."
            }), 400


        if not re.search(r"[A-Z]", password):

            return jsonify({
                "status": "error",
                "message":
                    "Password must contain at least one uppercase letter."
            }), 400


        if not re.search(r"[a-z]", password):

            return jsonify({
                "status": "error",
                "message":
                    "Password must contain at least one lowercase letter."
            }), 400


        if not re.search(r"\d", password):

            return jsonify({
                "status": "error",
                "message":
                    "Password must contain at least one number."
            }), 400


        # ---------------------------------------------
        # CONFIRM PASSWORD
        # ---------------------------------------------

        if password != confirm_password:

            return jsonify({
                "status": "error",
                "message":
                    "Passwords do not match."
            }), 400


        # ---------------------------------------------
        # DATABASE
        # ---------------------------------------------

        database = get_database()

        users_collection = database["users"]


        # ---------------------------------------------
        # DUPLICATE EMAIL
        # ---------------------------------------------

        existing_user = users_collection.find_one({
            "email": email
        })

        if existing_user:

            return jsonify({
                "status": "error",
                "message":
                    "An account with this email already exists."
            }), 409


        # ---------------------------------------------
        # HASH PASSWORD
        # ---------------------------------------------

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")


        # ---------------------------------------------
        # CREATE USER
        # ---------------------------------------------

        user = {
            "full_name": full_name,
            "email": email,
            "password_hash": password_hash
        }


        result = users_collection.insert_one(
            user
        )


        # ---------------------------------------------
        # RESPONSE
        # ---------------------------------------------

        return jsonify({
            "status": "success",
            "message":
                "Registration successful. You can now log in.",
            "user": {
                "id": str(result.inserted_id),
                "full_name": full_name,
                "email": email
            }
        }), 201


    except Exception as error:

        print(
            f"Registration error: {error}"
        )

        return jsonify({
            "status": "error",
            "message":
                "An error occurred during registration."
        }), 500

        # ---------------------------------------------------------
# LOGIN
# ---------------------------------------------------------

@auth_bp.route(
    "/login",
    methods=["POST"]
)
def login():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "status": "error",
                "message":
                    "Request body is required."
            }), 400


        email = str(
            data.get("email", "")
        ).strip().lower()

        password = str(
            data.get("password", "")
        )


        # ---------------------------------------------
        # REQUIRED FIELDS
        # ---------------------------------------------

        if not email or not password:

            return jsonify({
                "status": "error",
                "message":
                    "Email and password are required."
            }), 400


        # ---------------------------------------------
        # DATABASE
        # ---------------------------------------------

        database = get_database()

        users_collection = database[
            "users"
        ]


        # ---------------------------------------------
        # FIND USER
        # ---------------------------------------------

        user = users_collection.find_one({
            "email": email
        })


        # Use the same message for an unknown email
        # and an incorrect password.
        if not user:

            return jsonify({
                "status": "error",
                "message":
                    "Invalid email or password."
            }), 401


        # ---------------------------------------------
        # VERIFY PASSWORD
        # ---------------------------------------------

        password_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password_hash"].encode("utf-8")
        )

        if not password_valid:

            return jsonify({
                "status": "error",
                "message":
                    "Invalid email or password."
            }), 401


        # ---------------------------------------------
        # GENERATE JWT
        # ---------------------------------------------

        token = generate_token(
            user["_id"],
            user["email"]
        )


        # ---------------------------------------------
        # SUCCESS RESPONSE
        # ---------------------------------------------

        return jsonify({
            "status": "success",
            "message":
                "Login successful.",
            "token": token,
            "user": {
                "id": str(user["_id"]),
                "full_name":
                    user["full_name"],
                "email":
                    user["email"]
            }
        }), 200


    except Exception as error:

        print(
            f"Login error: {error}"
        )

        return jsonify({
            "status": "error",
            "message":
                "An error occurred during login."
        }), 500


# ---------------------------------------------------------
# PROTECTED AUTH TEST
# ---------------------------------------------------------

@auth_bp.route(
    "/me",
    methods=["GET"]
)
@token_required
def current_user():

    try:

        database = get_database()

        users_collection = database[
            "users"
        ]

        from bson import ObjectId

        user = users_collection.find_one({
            "_id": ObjectId(
                g.current_user["user_id"]
            )
        })

        if not user:

            return jsonify({
                "status": "error",
                "message":
                    "User account was not found."
            }), 404

        return jsonify({
            "status": "success",
            "user": {
                "id": str(user["_id"]),
                "full_name":
                    user["full_name"],
                "email":
                    user["email"]
            }
        }), 200

    except Exception as error:

        print(
            f"Current user error: {error}"
        )

        return jsonify({
            "status": "error",
            "message":
                "Unable to retrieve user information."
        }), 500

# ---------------------------------------------------------
# DELETE ACCOUNT
# ---------------------------------------------------------

@auth_bp.route(
    "/delete-account",
    methods=["DELETE"]
)
@token_required
def delete_account():

    try:

        database = get_database()

        users_collection = database[
            "users"
        ]

        predictions_collection = database[
            "predictions"
        ]

        chats_collection = database[
            "chats"
        ]


        user_id = g.current_user[
            "user_id"
        ]


        # ---------------------------------------------
        # DELETE USER'S CHATS
        # ---------------------------------------------

        chats_collection.delete_many({
            "user_id":
                user_id
        })


        # ---------------------------------------------
        # DELETE USER'S PREDICTIONS
        # ---------------------------------------------

        predictions_collection.delete_many({
            "user_id":
                user_id
        })


        # ---------------------------------------------
        # DELETE USER ACCOUNT
        # ---------------------------------------------

        users_collection.delete_one({
            "_id":
                ObjectId(
                    user_id
                )
        })


        return jsonify({
            "status":
                "success",

            "message":
                "Account and related data deleted successfully."
        }), 200


    except Exception as error:

        print(
            f"Delete account error: {error}"
        )

        return jsonify({
            "status":
                "error",

            "message":
                "Unable to delete account."
        }), 500