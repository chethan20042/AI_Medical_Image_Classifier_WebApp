from services.prediction_service import predict_image


image_path = input(
    "Enter the full path of a chest X-ray image: "
)


with open(image_path, "rb") as image_file:

    result = predict_image(image_file)

    print("\nPrediction Result")
    print("-----------------")

    print(
        "Predicted Class:",
        result["predicted_class"]
    )

    print(
        "Confidence:",
        result["confidence"],
        "%"
    )

    print("\nClass Probabilities:")

    for class_name, probability in result["probabilities"].items():

        print(
            f"{class_name}: {probability}%"
        )