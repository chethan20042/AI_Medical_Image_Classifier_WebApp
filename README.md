# AI Medical Image Classifier

An academic full-stack deep learning web application for chest X-ray image classification.

The application uses a trained **DenseNet121 transfer-learning model** to classify uploaded chest X-ray images into four categories:

- COVID-19
- Normal
- Pneumonia
- Tuberculosis

The project also provides model confidence, class probabilities, an AI-generated plain-language explanation, prediction history, a context-aware AI chatbot, model comparison information, and downloadable PDF reports.

> **Important:** This project is developed for academic and educational purposes only. It is not a clinical diagnostic system.

---

# Project Overview

The purpose of this project is to explore deep-learning-based medical image classification and compare a custom CNN trained from scratch with a DenseNet121 model using transfer learning.

Two models were developed and evaluated using the same dataset split:

1. Custom CNN
2. DenseNet121 Transfer Learning

DenseNet121 achieved stronger evaluation results and was therefore selected as the final deployment model.

---

# Supported Classes

The deployed model predicts one of the following four categories:

- COVID-19
- Normal
- Pneumonia
- Tuberculosis

The output represents an **AI model classification** and must not be interpreted as a medical diagnosis.

---

# Dataset Preparation

The original dataset contained approximately:

| Class | Original Images |
|---|---:|
| COVID-19 | 575 |
| Normal | 1,585 |
| Pneumonia | 4,273 |
| Tuberculosis | 700 |

Dataset quality checks were performed before training.

Results:

```text
Corrupted images: 0
Duplicate images removed: 42
```

The cleaned dataset was split approximately as:

```text
70% Training
15% Validation
15% Testing
```

Final dataset split:

| Class | Training | Validation | Testing |
|---|---:|---:|---:|
| COVID-19 | 401 | 86 | 87 |
| Normal | 1105 | 236 | 238 |
| Pneumonia | 2971 | 636 | 638 |
| Tuberculosis | 485 | 104 | 105 |

Total:

```text
Training   = 4962
Validation = 1062
Testing    = 1068
```

The same dataset split was used for both models to make the comparison fair.

---

# Image Preprocessing

The preprocessing pipeline included:

- Corrupted-image checking
- Exact duplicate checking
- Image resizing to `224 × 224`
- Conversion to 3-channel RGB input
- DenseNet121-compatible preprocessing
- Conservative data augmentation during training only

Training augmentation included:

- Rotation
- Translation
- Zoom
- Contrast adjustment

Validation and test images were not augmented.

---

# Class Imbalance Handling

The dataset was imbalanced, so class weights were used during model training.

```text
COVID-19       = 3.0935
Normal         = 1.1226
Pneumonia      = 0.4175
Tuberculosis   = 2.5577
```

Class weighting helped reduce the effect of the larger pneumonia class dominating the learning process.

---

# Model 1 — Custom CNN

A custom Convolutional Neural Network was trained from scratch as the baseline model.

Final results:

```text
Training Accuracy   = 86.96%
Validation Accuracy = 87.66%
Test Accuracy       = 87.73%
```

Test metrics:

```text
Macro Precision = 85.01%
Macro Recall    = 88.05%
Macro F1-score  = 85.95%

Weighted Precision = 89.70%
Weighted Recall    = 87.73%
Weighted F1-score  = 88.08%
```

Class-wise results:

| Class | Precision | Recall | F1-score |
|---|---:|---:|---:|
| COVID-19 | 79.79% | 86.21% | 82.87% |
| Normal | 71.92% | 95.80% | 82.16% |
| Pneumonia | 97.50% | 85.42% | 91.06% |
| Tuberculosis | 90.82% | 84.76% | 87.68% |

Confusion matrix:

```text
[[ 75   2   3   7]
 [  2 228   8   0]
 [  6  85 545   2]
 [ 11   2   3  89]]
```

---

# Model 2 — DenseNet121 Transfer Learning

DenseNet121 pretrained on ImageNet was used as the transfer-learning model.

Architecture:

```text
224 × 224 × 3 Input
        ↓
DenseNet121
        ↓
Global Average Pooling
        ↓
Dense Layer
        ↓
Dropout
        ↓
4-Class Softmax Output
```

Final results:

```text
Training Accuracy   = 92.60%
Validation Accuracy = 93.97%
Test Accuracy       = 94.48%
```

Test metrics:

```text
Macro Precision = 92.44%
Macro Recall    = 94.55%
Macro F1-score  = 93.33%

Weighted Precision = 94.78%
Weighted Recall    = 94.48%
Weighted F1-score  = 94.54%
```

Class-wise results:

| Class | Precision | Recall | F1-score |
|---|---:|---:|---:|
| COVID-19 | 85.86% | 97.70% | 91.40% |
| Normal | 87.89% | 94.54% | 91.09% |
| Pneumonia | 98.05% | 94.51% | 96.25% |
| Tuberculosis | 97.96% | 91.43% | 94.58% |

Confusion matrix:

```text
[[ 85   0   0   2]
 [  1 225  12   0]
 [  4  31 603   0]
 [  9   0   0  96]]
```

---

# Final Model Comparison

| Metric | Custom CNN | DenseNet121 |
|---|---:|---:|
| Test Accuracy | 87.73% | 94.48% |
| Macro Precision | 85.01% | 92.44% |
| Macro Recall | 88.05% | 94.55% |
| Macro F1-score | 85.95% | 93.33% |
| Weighted F1-score | 88.08% | 94.54% |

DenseNet121 improved test accuracy by approximately:

```text
94.48% - 87.73% = 6.75 percentage points
```

Therefore:

**DenseNet121 was selected as the deployment model.**

---

# Important Evaluation Note

The reported DenseNet121 accuracy of **94.48%** was obtained on the held-out test dataset used in this academic project.

It does not establish:

- Clinical performance
- Real-world hospital performance
- Radiologist-level performance
- Generalization to every population or medical institution

External and clinical validation would be required before considering medical use.

---

# Technology Stack

## Frontend

- React.js
- React Router
- Axios
- Recharts
- jsPDF
- CSS

## Backend

- Python
- Flask
- Flask-CORS
- TensorFlow / Keras
- Pillow
- PyMongo
- bcrypt
- PyJWT

## Database

- MongoDB

## AI / LLM

- Groq Cloud API
- Configurable LLM through the Groq API

The language model is used only for:

1. Plain-language explanation of numerical model results
2. Context-aware chatbot responses

The LLM does not perform the chest X-ray classification.

---

# System Architecture

```text
React Frontend
      ↓
Axios REST Requests
      ↓
Flask Backend
      ↓
┌─────────────────────────────┐
│ JWT Authentication          │
│ DenseNet121 Classification  │
│ MongoDB                     │
│ Groq AI Explanation         │
│ Context-Aware Chatbot       │
└─────────────────────────────┘
```

---

# Main Application Flow

```text
Home
 ↓
Register / Login
 ↓
Authenticated Dashboard
 ↓
Upload Chest X-ray
 ↓
Flask Backend
 ↓
DenseNet121
 ↓
Prediction
 ↓
Predicted Class
Confidence
Class Probabilities
AI Explanation
Model Performance
CNN vs DenseNet Comparison
PDF Report
AI Chatbot
Prediction History
```

---

# Features

The application currently includes:

- Professional responsive white-theme user interface
- User registration
- Login
- bcrypt password hashing
- JWT authentication
- Protected React dashboard
- Protected Flask APIs
- Chest X-ray image upload
- Drag-and-drop upload
- Image preview
- JPG / JPEG / PNG validation
- Upload size validation
- DenseNet121 inference
- Predicted class display
- Model confidence
- Four-class probability visualization using Recharts
- AI-generated plain-language explanation
- Context-aware chatbot
- Conversational chatbot history
- MongoDB prediction history
- MongoDB chatbot history
- Custom CNN vs DenseNet121 comparison
- DenseNet121 test-set metrics
- PDF classification report using jsPDF
- User profile information
- About Project page
- Medical disclaimers throughout the application

---

# Backend Project Structure

```text
Backend/
│
├── app.py
├── requirements.txt
├── .env
│
├── config/
│   ├── __init__.py
│   └── database.py
│
├── models/
│   └── densenet121_best.keras
│
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py
│   ├── prediction_routes.py
│   └── chatbot_routes.py
│
├── services/
│   ├── __init__.py
│   ├── prediction_service.py
│   └── groq_service.py
│
├── utils/
│   ├── __init__.py
│   └── auth_utils.py
│
└── uploads/
```

---

# Frontend Project Structure

```text
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── PredictionHistory.jsx
│   │   ├── ProfileCard.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── pdfService.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
└── package.json
```

---

# Environment Variables

Sensitive configuration is stored inside:

```text
Backend/.env
```

Example structure:

```env
MONGO_URI=mongodb://localhost:27017/
MONGO_DB_NAME=ai_medical_classifier

JWT_SECRET_KEY=YOUR_SECRET_KEY

GROQ_API_KEY=YOUR_GROQ_API_KEY
GROQ_MODEL=YOUR_AVAILABLE_GROQ_MODEL
```

Do not commit the actual `.env` file to GitHub.

---

# Backend Installation

Open a terminal inside:

```text
Backend/
```

Create a virtual environment if required:

```powershell
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

The project currently uses a TensorFlow version compatible with the saved DenseNet121 model:

```text
TensorFlow 2.15.1
Keras 2.15.0
```

The model should be placed at:

```text
Backend/models/densenet121_best.keras
```

Start the Flask server:

```powershell
python app.py
```

Backend development server:

```text
http://127.0.0.1:5000
```

---

# Frontend Installation

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Run React:

```powershell
npm run dev
```

Frontend development server:

```text
http://localhost:5173
```

---

# MongoDB

MongoDB stores:

```text
ai_medical_classifier
│
├── users
├── predictions
└── chats
```

## Users

Stores:

```text
full_name
email
password_hash
```

## Predictions

Stores:

```text
user_id
image_filename
predicted_class
confidence
probabilities
ai_summary
timestamp
```

## Chats

Stores:

```text
user_id
prediction_id
user_message
assistant_response
timestamp
```

---

# Authentication Flow

```text
Register
   ↓
bcrypt password hashing
   ↓
MongoDB

Login
   ↓
bcrypt password verification
   ↓
JWT generated

React
   ↓
Stores authentication token
   ↓
Axios Authorization header

Flask
   ↓
JWT verification
   ↓
Protected APIs
```

---

# Prediction Pipeline

The deployed inference process is:

```text
Uploaded Image
      ↓
Pillow
      ↓
Convert to RGB
      ↓
Resize to 224 × 224
      ↓
NumPy Array
      ↓
Batch Dimension
      ↓
DenseNet121 preprocess_input()
      ↓
densenet121_best.keras
      ↓
4-Class Softmax Output
```

Class order:

```text
covid19
normal
pneumonia
tuberculosis
```

---

# AI-Generated Explanation

After prediction, only the following information is sent to the LLM:

```text
Predicted class
Model confidence
Four class probabilities
```

The X-ray image itself is not sent to the chatbot/explanation LLM.

The explanation must not:

- Claim that a patient definitely has a disease
- Pretend to inspect the X-ray
- Describe unsupported visual regions
- Provide a definitive diagnosis
- Prescribe medication or treatment

---

# Context-Aware Chatbot

The chatbot uses:

```text
Current prediction context
+
Recent conversation history
```

Prediction context includes:

```text
Predicted class
Confidence
Four probabilities
```

Recent chat history is retrieved from MongoDB for the same:

```text
Authenticated user
+
Prediction ID
```

The chatbot is therefore:

```text
Prediction-aware
Conversation-aware
```

but it is not image-aware.

---

# Explainability Limitation

The current system does not implement Grad-CAM or another explainability method.

Therefore the chatbot must not claim things such as:

```text
"The lower right lung contains an opacity."
```

Specific image-region interpretation would require explainability functionality such as Grad-CAM.

---

# PDF Report

The application uses **jsPDF** to generate an academic classification report containing:

- Project title
- User name
- Date and time
- Uploaded X-ray
- Predicted class
- Confidence
- Four class probabilities
- DenseNet121 test-set metrics
- AI-generated explanation
- Medical disclaimer

The PDF is an academic classification report and not a medical diagnostic report.

---

# Training Graph Note

The original training scripts did not save:

```python
history.history
```

Therefore the web application does not fabricate training accuracy or loss curves.

The dashboard displays only the real model evaluation metrics that were saved from the completed model experiments.

If training curves are required in future research documentation, the models should be retrained separately while explicitly saving the training history.

---

# Security Measures

Basic security measures include:

- bcrypt password hashing
- JWT authentication
- Protected backend APIs
- Protected frontend routes
- Automatic JWT validation
- File-extension validation
- Image-content validation
- Maximum upload size
- Environment variables
- `.env` excluded from Git
- Groq API key stored only on backend
- JWT secret stored only on backend
- MongoDB configuration stored only on backend

---

# Current Limitations

The project currently has several limitations:

- Academic dataset only
- Four output classes
- No clinical validation
- No external hospital validation
- No radiologist verification
- No Grad-CAM
- No DICOM support
- No segmentation
- Dataset-specific evaluation
- No mobile application
- No cloud deployment yet
- No ensemble model
- No federated learning

---

# Future Improvements

Potential future work includes:

- Grad-CAM visualization
- Explainable AI
- Larger datasets
- Patient-level dataset splitting
- More disease classes
- Multi-hospital datasets
- External validation
- Radiologist verification
- DICOM support
- Batch image upload
- Better DenseNet121 fine-tuning
- Ensemble learning
- Mobile application
- Cloud deployment
- Federated learning
- Clinical validation

---

# Medical Disclaimer

This AI Medical Image Classifier was developed for **academic and educational purposes only**.

The application is **not a clinical diagnostic tool**.

Predictions, confidence scores, probabilities, AI-generated explanations, chatbot responses, and PDF reports must not be interpreted as confirmed medical diagnoses.

The DenseNet121 test accuracy of **94.48%** was obtained on the held-out test dataset used in this project and does not establish real-world or clinical performance.

This system should not replace evaluation by a qualified healthcare professional.

---

# Project Status

Current implementation includes:

```text
Machine Learning Phase       ✅
DenseNet121 Deployment       ✅
Flask Backend                ✅
MongoDB                      ✅
Authentication               ✅
Prediction API               ✅
React Frontend               ✅
Probability Visualization    ✅
AI Explanation               ✅
Context-Aware Chatbot        ✅
Prediction History           ✅
PDF Report                   ✅
Responsive UI                ✅
Medical Safety Messaging     ✅
```

---

# Academic Project

**Project Title:** AI Medical Image Classifier

**Project Type:** MCA Mini Project

**Domain:** Artificial Intelligence / Deep Learning / Medical Image Classification

---

## Final Note

The primary objective of this project is to demonstrate the integration of deep learning, full-stack web development, database management, authentication, and large-language-model-based explanation within an academic chest X-ray classification application.