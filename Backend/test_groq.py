from services.groq_service import (
    generate_prediction_explanation
)


result = generate_prediction_explanation(

    predicted_class="pneumonia",

    confidence=97.18,

    probabilities={
        "covid19": 0.02,
        "normal": 2.57,
        "pneumonia": 97.18,
        "tuberculosis": 0.23
    }
)


print("\nAI-Generated Explanation")
print("------------------------")
print(result)