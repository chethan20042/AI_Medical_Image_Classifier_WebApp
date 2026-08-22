import os

from pymongo import MongoClient
from dotenv import load_dotenv


# ---------------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ---------------------------------------------------------

load_dotenv()


# ---------------------------------------------------------
# DATABASE CONFIGURATION
# ---------------------------------------------------------

MONGO_URI = os.getenv(
    "MONGO_URI"
)

MONGO_DB_NAME = os.getenv(
    "MONGO_DB_NAME"
)


# ---------------------------------------------------------
# DATABASE VARIABLES
# ---------------------------------------------------------

client = None
db = None


# ---------------------------------------------------------
# CONNECT TO MONGODB
# ---------------------------------------------------------

def connect_database():
    """
    Connect Flask backend to MongoDB.
    """

    global client
    global db

    if not MONGO_URI:
        raise ValueError(
            "MONGO_URI is missing from .env"
        )

    if not MONGO_DB_NAME:
        raise ValueError(
            "MONGO_DB_NAME is missing from .env"
        )

    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    # Test MongoDB connection
    client.admin.command(
        "ping"
    )

    db = client[
        MONGO_DB_NAME
    ]

    print(
        f"MongoDB connected successfully: "
        f"{MONGO_DB_NAME}"
    )

    return db


# ---------------------------------------------------------
# GET DATABASE
# ---------------------------------------------------------

def get_database():
    """
    Return the active MongoDB database connection.
    """

    global db

    if db is None:
        connect_database()

    return db