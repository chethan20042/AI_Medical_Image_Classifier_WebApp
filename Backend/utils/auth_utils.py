import os
import jwt

from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, g
from dotenv import load_dotenv


# ---------------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ---------------------------------------------------------

load_dotenv()

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

JWT_ALGORITHM = "HS256"


# ---------------------------------------------------------
# GENERATE JWT
# ---------------------------------------------------------

def generate_token(user_id, email):
    """
    Generate a JWT for an authenticated user.
    """

    if not JWT_SECRET_KEY:
        raise ValueError(
            "JWT_SECRET_KEY is missing from .env"
        )

    now = datetime.now(timezone.utc)

    payload = {
        "user_id": str(user_id),
        "email": email,
        "iat": now,
        "exp": now + timedelta(hours=24)
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return token


# ---------------------------------------------------------
# VERIFY JWT
# ---------------------------------------------------------

def token_required(route_function):
    """
    Protect a Flask route using JWT authentication.
    """

    @wraps(route_function)
    def decorated(*args, **kwargs):

        authorization = request.headers.get(
            "Authorization",
            ""
        )

        if not authorization.startswith("Bearer "):

            return jsonify({
                "status": "error",
                "message":
                    "Authentication token is required."
            }), 401

        token = authorization.split(
            " ",
            1
        )[1].strip()

        if not token:

            return jsonify({
                "status": "error",
                "message":
                    "Authentication token is required."
            }), 401

        try:

            payload = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM]
            )

            # Store authenticated-user information
            # for the current Flask request.
            g.current_user = {
                "user_id": payload["user_id"],
                "email": payload["email"]
            }

        except jwt.ExpiredSignatureError:

            return jsonify({
                "status": "error",
                "message":
                    "Authentication token has expired. Please log in again."
            }), 401

        except jwt.InvalidTokenError:

            return jsonify({
                "status": "error",
                "message":
                    "Invalid authentication token."
            }), 401

        return route_function(
            *args,
            **kwargs
        )

    return decorated