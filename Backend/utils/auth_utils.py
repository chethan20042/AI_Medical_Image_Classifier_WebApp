from functools import wraps
from datetime import datetime, timedelta, timezone
import os

import jwt
from bson import ObjectId
from flask import request, jsonify, g

from config.database import get_database


# ---------------------------------------------------------
# JWT SECRET
# ---------------------------------------------------------

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)


if not JWT_SECRET_KEY:
    raise ValueError(
        "JWT_SECRET_KEY is missing from .env"
    )


# ---------------------------------------------------------
# GENERATE JWT
# ---------------------------------------------------------

def generate_token(
    user_id,
    email
):
    """
    Generate a JWT token for an authenticated user.
    """

    now = datetime.now(
        timezone.utc
    )


    payload = {

        "user_id":
            str(user_id),

        "email":
            email,

        "iat":
            now,

        "exp":
            now + timedelta(
                hours=24
            )
    }


    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm="HS256"
    )


    return token


# ---------------------------------------------------------
# TOKEN REQUIRED DECORATOR
# ---------------------------------------------------------

def token_required(route_function):
    """
    Protect Flask routes using JWT authentication.

    In addition to validating the JWT, this decorator
    verifies that the corresponding user still exists
    in MongoDB.
    """

    @wraps(route_function)
    def wrapper(*args, **kwargs):

        # ---------------------------------------------
        # AUTHORIZATION HEADER
        # ---------------------------------------------

        authorization_header = (
            request.headers.get(
                "Authorization"
            )
        )


        if not authorization_header:

            return jsonify({
                "status":
                    "error",

                "message":
                    "Authentication token is required."
            }), 401


        # ---------------------------------------------
        # EXPECT: Bearer <token>
        # ---------------------------------------------

        parts = authorization_header.split()


        if (
            len(parts) != 2
            or parts[0].lower() != "bearer"
        ):

            return jsonify({
                "status":
                    "error",

                "message":
                    "Invalid authorization header."
            }), 401


        token = parts[1]


        try:

            # -----------------------------------------
            # DECODE JWT
            # -----------------------------------------

            payload = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[
                    "HS256"
                ]
            )


            user_id = payload.get(
                "user_id"
            )


            if not user_id:

                return jsonify({
                    "status":
                        "error",

                    "message":
                        "Invalid authentication token."
                }), 401


            if not ObjectId.is_valid(
                user_id
            ):

                return jsonify({
                    "status":
                        "error",

                    "message":
                        "Invalid authentication token."
                }), 401


            # -----------------------------------------
            # VERIFY USER STILL EXISTS
            # -----------------------------------------

            database = get_database()

            users_collection = database[
                "users"
            ]


            user = users_collection.find_one({

                "_id":
                    ObjectId(
                        user_id
                    )

            })


            if not user:

                return jsonify({
                    "status":
                        "error",

                    "message":
                        "User account no longer exists."
                }), 401


            # -----------------------------------------
            # SAFE USER DATA
            # -----------------------------------------

            g.current_user = {

                "user_id":
                    str(
                        user["_id"]
                    ),

                "full_name":
                    user.get(
                        "full_name"
                    ),

                "email":
                    user.get(
                        "email"
                    )
            }


            # -----------------------------------------
            # CONTINUE TO PROTECTED ROUTE
            # -----------------------------------------

            return route_function(
                *args,
                **kwargs
            )


        except jwt.ExpiredSignatureError:

            return jsonify({
                "status":
                    "error",

                "message":
                    "Authentication token has expired."
            }), 401


        except jwt.InvalidTokenError:

            return jsonify({
                "status":
                    "error",

                "message":
                    "Invalid authentication token."
            }), 401


        except Exception as error:

            print(
                f"Authentication error: {error}"
            )

            return jsonify({
                "status":
                    "error",

                "message":
                    "Authentication failed."
            }), 401


    return wrapper