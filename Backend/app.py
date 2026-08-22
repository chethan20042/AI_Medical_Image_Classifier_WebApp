from flask import Flask, jsonify
from flask_cors import CORS
from config.database import connect_database
from config.database import get_database
from routes.chatbot_routes import chatbot_bp

from config.database import (
    connect_database,
    get_database
)

from services.prediction_service import (
    load_prediction_model,
    get_model_info
)

from routes.auth_routes import auth_bp

from routes.prediction_routes import (
    prediction_bp
)


# ---------------------------------------------------------
# CREATE FLASK APP
# ---------------------------------------------------------

app = Flask(__name__)


# ---------------------------------------------------------
# BASIC SECURITY CONFIGURATION
# ---------------------------------------------------------

# Maximum uploaded request size = 10 MB
app.config["MAX_CONTENT_LENGTH"] = (
    10 * 1024 * 1024
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

CORS(
    app,
    origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
)


# ---------------------------------------------------------
# CONNECT TO DATABASE
# ---------------------------------------------------------

try:

    connect_database()

except Exception as error:

    print(
        f"MongoDB connection error: {error}"
    )

app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)
# ---------------------------------------------------------
# REGISTER BLUEPRINTS
# ---------------------------------------------------------

app.register_blueprint(
    prediction_bp,
    url_prefix="/api"
)

app.register_blueprint(
    chatbot_bp,
    url_prefix="/api"
)


# ---------------------------------------------------------
# LOAD AI MODEL
# ---------------------------------------------------------

try:

    load_prediction_model()

    print(
        "AI model initialization completed."
    )

except Exception as error:

    print(
        f"Error loading AI model: {error}"
    )


# ---------------------------------------------------------
# HOME ROUTE
# ---------------------------------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message":
            "AI Medical Image Classifier Backend is running",
        "status": "success"
    })


# ---------------------------------------------------------
# MODEL INFORMATION
# ---------------------------------------------------------

@app.route(
    "/api/model-info",
    methods=["GET"]
)
def model_info():

    try:

        information = get_model_info()

        return jsonify({
            "status": "success",
            "model": information
        }), 200

    except Exception as error:

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# ---------------------------------------------------------
# FILE TOO LARGE ERROR
# ---------------------------------------------------------

@app.errorhandler(413)
def file_too_large(error):

    return jsonify({
        "status": "error",
        "message":
            "Uploaded image is too large. Maximum size is 10 MB."
    }), 413

@app.route(
    "/api/database-status",
    methods=["GET"]
)
def database_status():

    try:

        database = get_database()

        database.command(
            "ping"
        )

        return jsonify({
            "status": "success",
            "message":
                "MongoDB connection is working",
            "database":
                database.name
        }), 200

    except Exception as error:

        return jsonify({
            "status": "error",
            "message":
                "MongoDB connection failed",
            "error":
                str(error)
        }), 500
# ---------------------------------------------------------
# START SERVER
# ---------------------------------------------------------

if __name__ == "__main__":

    app.run(
        debug=True
    )