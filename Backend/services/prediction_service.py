import os
import numpy as np
import tensorflow as tf

from PIL import Image
from tensorflow.keras.applications.densenet import preprocess_input


# ---------------------------------------------------------
# PATH CONFIGURATION
# ---------------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "densenet121_best.h5"
)


# ---------------------------------------------------------
# MODEL CONFIGURATION
# ---------------------------------------------------------

IMAGE_SIZE = (224, 224)

CLASS_NAMES = [
    "covid19",
    "normal",
    "pneumonia",
    "tuberculosis"
]


# ---------------------------------------------------------
# LOAD MODEL
# ---------------------------------------------------------

model = None


def load_prediction_model():
    """
    Load the existing trained DenseNet121 model.

    The model is loaded only once and reused for future
    predictions.
    """

    global model

    if model is not None:
        return model

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at: {MODEL_PATH}"
        )

    print("Loading DenseNet121 model...")

    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False
    )

    print("DenseNet121 model loaded successfully.")

    return model


# ---------------------------------------------------------
# IMAGE PREPROCESSING
# ---------------------------------------------------------

def preprocess_image(image_file):
    """
    Prepare an uploaded image for DenseNet121 prediction.

    Steps:
    1. Open the image
    2. Convert it to RGB
    3. Resize it to 224 x 224
    4. Convert it to NumPy array
    5. Add batch dimension
    6. Apply DenseNet121 preprocessing
    """

    try:

        image = Image.open(image_file)

        # Ensure the uploaded image is a valid image
        image.verify()

        # Reopen because verify() closes/invalidates the image stream
        image_file.seek(0)
        image = Image.open(image_file)

        # Convert grayscale or other image types to RGB
        image = image.convert("RGB")

        # Resize to DenseNet121 input size
        image = image.resize(IMAGE_SIZE)

        # Convert image to NumPy array
        image_array = np.array(
            image,
            dtype=np.float32
        )

        # Add batch dimension
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # Apply DenseNet121 preprocessing
        image_array = preprocess_input(
            image_array
        )

        return image_array

    except Exception as error:
        raise ValueError(
            f"Invalid image file: {str(error)}"
        )


# ---------------------------------------------------------
# MAKE PREDICTION
# ---------------------------------------------------------

def predict_image(image_file):
    """
    Predict the class of an uploaded chest X-ray image.
    """

    loaded_model = load_prediction_model()

    processed_image = preprocess_image(
        image_file
    )

    predictions = loaded_model.predict(
        processed_image,
        verbose=0
    )

    probabilities = predictions[0]

    predicted_index = int(
        np.argmax(probabilities)
    )

    predicted_class = CLASS_NAMES[
        predicted_index
    ]

    confidence = float(
        probabilities[predicted_index] * 100
    )

    probability_dict = {}

    for index, class_name in enumerate(CLASS_NAMES):
        probability_dict[class_name] = round(
            float(probabilities[index] * 100),
            2
        )

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2),
        "probabilities": probability_dict
    }


# ---------------------------------------------------------
# MODEL INFORMATION
# ---------------------------------------------------------

def get_model_info():
    """
    Return basic information about the deployed model.
    """

    loaded_model = load_prediction_model()

    return {
        "model_name": "DenseNet121",
        "input_shape": list(
            loaded_model.input_shape
        ),
        "output_shape": list(
            loaded_model.output_shape
        ),
        "number_of_classes": len(CLASS_NAMES),
        "classes": CLASS_NAMES
    }