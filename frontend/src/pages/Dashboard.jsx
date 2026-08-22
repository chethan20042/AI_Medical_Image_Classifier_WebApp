import { useRef, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../services/api";
import ProfileCard from "../components/ProfileCard";
import {
  generatePredictionReport
} from "../services/pdfService";
import PredictionHistory from "../components/PredictionHistory";


function Dashboard() {
  const fileInputRef = useRef(null);

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;


  // ---------------------------------------------------------
  // STATES
  // ---------------------------------------------------------

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const [fileError, setFileError] = useState("");

  const [prediction, setPrediction] = useState(null);

  const [predictionError, setPredictionError] = useState("");

  const [predicting, setPredicting] = useState(false);

  const [chatMessage, setChatMessage] = useState("");

  const [chatMessages, setChatMessages] = useState([]);

  const [chatLoading, setChatLoading] = useState(false);

  const [chatError, setChatError] = useState("");

  const [historyRefreshKey, setHistoryRefreshKey] =
  useState(0);

  const [pdfLoading, setPdfLoading] =
  useState(false);

  const [pdfError, setPdfError] =
  useState("");


  // ---------------------------------------------------------
  // FILE CONFIGURATION
  // ---------------------------------------------------------

  const allowedTypes = [
    "image/jpeg",
    "image/png",
  ];


  // ---------------------------------------------------------
  // VALIDATE IMAGE
  // ---------------------------------------------------------

  const validateAndSetFile = (file) => {
    setFileError("");
    setPredictionError("");
    setPrediction(null);
    setChatMessages([]);
    setChatMessage("");
    setChatError("");

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setFileError(
        "Only JPG, JPEG and PNG images are allowed."
      );

      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileError(
        "Image size must be less than 10 MB."
      );

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(imageUrl);
  };


  // ---------------------------------------------------------
  // FILE SELECTION
  // ---------------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    validateAndSetFile(file);
  };


  // ---------------------------------------------------------
  // DRAG AND DROP
  // ---------------------------------------------------------

  const handleDragOver = (event) => {
    event.preventDefault();

    setDragActive(true);
  };


  const handleDragLeave = (event) => {
    event.preventDefault();

    setDragActive(false);
  };


  const handleDrop = (event) => {
    event.preventDefault();

    setDragActive(false);

    const file = event.dataTransfer.files[0];

    validateAndSetFile(file);
  };


  // ---------------------------------------------------------
  // OPEN FILE BROWSER
  // ---------------------------------------------------------

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };


  // ---------------------------------------------------------
  // REMOVE IMAGE
  // ---------------------------------------------------------

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setFileError("");
    setPredictionError("");
    setPrediction(null);
    setChatMessages([]);
    setChatMessage("");
    setChatError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  // ---------------------------------------------------------
  // RUN PREDICTION
  // ---------------------------------------------------------

  const handlePrediction = async () => {
    if (!selectedFile) {
      setPredictionError(
        "Please select an X-ray image first."
      );

      return;
    }

    try {
      setPredicting(true);
      setPredictionError("");
      setPrediction(null);

      const formData = new FormData();

      formData.append(
        "image",
        selectedFile
      );

      const response = await api.post(
        "/api/predict",
        formData
      );

      setPrediction(
        response.data.prediction
      );

      setHistoryRefreshKey(
        (previous) => previous + 1
      );

    } catch (error) {
      const backendMessage =
        error.response?.data?.message;

      setPredictionError(
        backendMessage ||
          "Prediction failed. Please try again."
      );

    } finally {
      setPredicting(false);
    }
  };


  // ---------------------------------------------------------
  // PROBABILITY DATA FOR RECHARTS
  // ---------------------------------------------------------

  const probabilityData = prediction?.probabilities
    ? [
        {
          name: "COVID-19",
          probability:
            prediction.probabilities.covid19 ?? 0,
        },
        {
          name: "Normal",
          probability:
            prediction.probabilities.normal ?? 0,
        },
        {
          name: "Pneumonia",
          probability:
            prediction.probabilities.pneumonia ?? 0,
        },
        {
          name: "Tuberculosis",
          probability:
            prediction.probabilities.tuberculosis ?? 0,
        },
      ]
    : [];

  const handleChatSubmit = async (event) => {
  event.preventDefault();

  const message = chatMessage.trim();

  if (!message) {
    return;
  }

  if (!prediction?.id) {
    setChatError(
      "Please complete an X-ray classification before using the chatbot."
    );

    return;
  }

  const userEntry = {
    role: "user",
    content: message,
  };

  setChatMessages((previous) => [
    ...previous,
    userEntry,
  ]);

  setChatMessage("");
  setChatError("");

  try {
    setChatLoading(true);

    const response = await api.post(
      "/api/chatbot",
      {
        prediction_id: prediction.id,
        message,
      }
    );

    const assistantEntry = {
      role: "assistant",
      content:
        response.data.chat.response,
    };

    setChatMessages((previous) => [
      ...previous,
      assistantEntry,
    ]);

  } catch (error) {
    const backendMessage =
      error.response?.data?.message;

    setChatError(
      backendMessage ||
        "The AI chatbot is temporarily unavailable."
    );

  } finally {
    setChatLoading(false);
  }
}; 
const quickQuestions = [
  "What does this confidence mean?",
  "Why did the model classify this result this way?",
  "What are the limitations of this classification?",
  "What does the predicted class mean?",
];
const handleQuickQuestion = (question) => {
  setChatMessage(question);
};   

const handleDownloadPdf = async () => {
  if (!prediction) {
    setPdfError(
      "Please complete a classification before generating a report."
    );

    return;
  }

  try {
    setPdfLoading(true);
    setPdfError("");

    await generatePredictionReport({
      prediction,
      selectedFile,
      user,
    });

  } catch (error) {
    console.error(
      "PDF generation error:",
      error
    );

    setPdfError(
      "Unable to generate the PDF report. Please try again."
    );

  } finally {
    setPdfLoading(false);
  }
};
  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <section className="dashboard-header">

          <div>
            <span className="section-label">
              AI Classification Dashboard
            </span>

            <h1>
              Welcome
              {user?.full_name
                ? `, ${user.full_name}`
                : ""}
            </h1>

            <p>
              Upload a chest X-ray image to perform
              AI-based classification using the
              selected DenseNet121 model.
            </p>
          </div>


          <div className="model-status">

            <span className="status-dot" />

            <div>
              <strong>
                DenseNet121
              </strong>

              <span>
                Deployment Model
              </span>
            </div>

          </div>

        </section>


        {/* =====================================================
            DISCLAIMER
        ====================================================== */}

        <section className="dashboard-warning">

          <div className="warning-icon">
            !
          </div>

          <div>

            <strong>
              Academic Classification System
            </strong>

            <p>
              This application is intended for
              academic and educational purposes only.
              Model classifications are not medical
              diagnoses and should not replace
              evaluation by a qualified healthcare
              professional.
            </p>

          </div>

        </section>


        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <section className="dashboard-main-grid">

          {/* ---------------------------------------------------
              UPLOAD CARD
          ---------------------------------------------------- */}

          <div className="dashboard-card upload-card">

            <div className="card-header">

              <div>

                <span className="card-step">
                  Step 1
                </span>

                <h2>
                  Upload Chest X-Ray
                </h2>

                <p>
                  Select a JPG, JPEG or PNG chest
                  X-ray image for classification.
                </p>

              </div>

            </div>


            {!previewUrl ? (

              <div
                className={
                  dragActive
                    ? "upload-zone drag-active"
                    : "upload-zone"
                }
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >

                <div className="upload-icon">

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </div>


                <h3>
                  Drag and drop your X-ray here
                </h3>

                <p>
                  or click to browse from your computer
                </p>


                <button
                  type="button"
                  className="secondary-button"
                >
                  Select X-Ray Image
                </button>


                <span className="upload-note">
                  JPG, JPEG or PNG · Maximum 10 MB
                </span>

              </div>

            ) : (

              <div className="image-preview-container">

                <div className="image-preview-box">

                  <img
                    src={previewUrl}
                    alt="Selected chest X-ray preview"
                  />

                </div>


                <div className="selected-file-info">

                  <div>

                    <span>
                      Selected Image
                    </span>

                    <strong>
                      {selectedFile?.name}
                    </strong>

                  </div>


                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}


            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleFileChange}
              hidden
            />


            {fileError && (
              <div className="upload-error">
                {fileError}
              </div>
            )}


            <button
              type="button"
              className="classify-button"
              disabled={
                !selectedFile ||
                predicting
              }
              onClick={handlePrediction}
            >
              {predicting
                ? "Classifying..."
                : "Classify X-Ray"}
            </button>


            {predictionError && (
              <div className="prediction-error">
                {predictionError}
              </div>
            )}


            <p className="classification-note">
              The image will be processed by the
              trained DenseNet121 model. This result
              will be shown as an AI model
              classification, not a medical diagnosis.
            </p>

          </div>


          {/* ---------------------------------------------------
              MODEL INFORMATION
          ---------------------------------------------------- */}

          <div className="dashboard-card model-card">

            <div className="card-header">

              <div>

                <span className="card-step">
                  Model
                </span>

                <h2>
                  DenseNet121
                </h2>

                <p>
                  Final model selected after comparison
                  with the custom CNN baseline.
                </p>

              </div>

            </div>


            <div className="model-details">

              <div className="model-detail-row">

                <span>
                  Input Size
                </span>

                <strong>
                  224 × 224 × 3
                </strong>

              </div>


              <div className="model-detail-row">

                <span>
                  Output Classes
                </span>

                <strong>
                  4
                </strong>

              </div>


              <div className="model-detail-row">

                <span>
                  Architecture
                </span>

                <strong>
                  Transfer Learning
                </strong>

              </div>


              <div className="model-detail-row">

                <span>
                  Pretraining
                </span>

                <strong>
                  ImageNet
                </strong>

              </div>

            </div>


            <div className="supported-classes">

              <h3>
                Supported Classes
              </h3>


              <div className="class-tags">

                <span>
                  COVID-19
                </span>

                <span>
                  Normal
                </span>

                <span>
                  Pneumonia
                </span>

                <span>
                  Tuberculosis
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PREDICTION RESULT
        ====================================================== */}

        {prediction && prediction.probabilities && (

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  Prediction Result
                </span>

                <h2>
                  AI Model Classification
                </h2>

                <p>
                  Classification generated by the
                  deployed DenseNet121 model.
                </p>

              </div>

            </div>


            {/* SUMMARY */}

            <div className="prediction-summary-grid">

              <div className="prediction-summary-card">

                <span>
                  Predicted Class
                </span>

                <strong>
                  {prediction.predicted_class}
                </strong>

              </div>


              <div className="prediction-summary-card">

                <span>
                  Model Confidence
                </span>

                <strong>
                  {prediction.confidence}%
                </strong>

              </div>

            </div>


            {/* =================================================
                PROBABILITY CHART
            ================================================== */}

            <div className="probability-chart-section">

              <div className="probability-chart-header">

                <div>

                  <h3>
                    Class Probabilities
                  </h3>

                  <p>
                    Relative model output across the
                    four trained classes.
                  </p>

                </div>

              </div>


              <div className="probability-chart-container">

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart
                    data={probabilityData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />


                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                      }}
                    />


                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) =>
                        `${value}%`
                      }
                      tick={{
                        fontSize: 12,
                      }}
                    />


                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toFixed(2)}%`,
                        "Probability",
                      ]}
                    />


                    <Bar
                      dataKey="probability"
                      fill="#2563eb"
                      radius={[6, 6, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              {/* VALUES */}

              <div className="probability-values">

                {probabilityData.map((item) => (

                  <div
                    className="probability-value-card"
                    key={item.name}
                  >

                    <span>
                      {item.name}
                    </span>

                    <strong>
                      {Number(
                        item.probability
                      ).toFixed(2)}
                      %
                    </strong>

                  </div>

                ))}

              </div>

            </div>


            {/* =================================================
                AI EXPLANATION
            ================================================== */}

            <div className="ai-summary-box">

              <span className="section-label">
                AI-Generated Explanation
              </span>

              <p>
                {prediction.ai_summary ||
                  "AI-generated explanation is currently unavailable."}
              </p>

            </div>

            <div className="report-download-section">

  <div className="report-download-content">

    <div>

      <span className="section-label">
        Classification Report
      </span>

      <h3>
        Download PDF Report
      </h3>

      <p>
        Generate a structured academic report
        containing the uploaded X-ray, model
        classification, confidence, class
        probabilities, DenseNet121 evaluation
        metrics and AI-generated explanation.
      </p>

    </div>


    <button
      type="button"
      className="download-report-button"
      onClick={handleDownloadPdf}
      disabled={pdfLoading}
    >

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {pdfLoading
        ? "Generating PDF..."
        : "Download PDF Report"}

    </button>

  </div>


  {pdfError && (
    <div className="pdf-error">
      {pdfError}
    </div>
  )}

</div>


            {/* =================================================
    CONTEXT-AWARE AI CHATBOT
================================================== */}

<div className="chatbot-section">

  <div className="chatbot-header">

    <div>
      <span className="section-label">
        Context-Aware Assistant
      </span>

      <h3>
        Ask About This Classification
      </h3>

      <p>
        The assistant uses only the current
        prediction class, confidence and class
        probabilities as context.
      </p>
    </div>

    <div className="chatbot-status">
      <span className="chatbot-status-dot" />

      AI Assistant
    </div>

  </div>


  {/* QUICK QUESTIONS */}

  <div className="quick-question-list">

    {quickQuestions.map((question) => (
      <button
        key={question}
        type="button"
        className="quick-question-button"
        onClick={() =>
          handleQuickQuestion(question)
        }
      >
        {question}
      </button>
    ))}

  </div>


  {/* CHAT AREA */}

  <div className="chat-window">

    {chatMessages.length === 0 ? (

      <div className="chat-empty-state">

        <div className="chat-empty-icon">
          AI
        </div>

        <h4>
          Ask a question about your model result
        </h4>

        <p>
          For example, you can ask what the
          confidence means or about the limitations
          of the classification.
        </p>

      </div>

    ) : (

      <div className="chat-message-list">

        {chatMessages.map(
          (message, index) => (

            <div
              key={`${message.role}-${index}`}
              className={
                message.role === "user"
                  ? "chat-message user-message"
                  : "chat-message assistant-message"
              }
            >

              <span className="chat-message-label">
                {message.role === "user"
                  ? "You"
                  : "AI Assistant"}
              </span>

              <p>
                {message.content}
              </p>

            </div>

          )
        )}


        {chatLoading && (
          <div className="chat-message assistant-message">

            <span className="chat-message-label">
              AI Assistant
            </span>

            <p className="chat-thinking">
              Generating response...
            </p>

          </div>
        )}

      </div>

    )}

  </div>


  {/* ERROR */}

  {chatError && (
    <div className="chat-error">
      {chatError}
    </div>
  )}


  {/* INPUT */}

  <form
    className="chat-input-container"
    onSubmit={handleChatSubmit}
  >

    <input
      type="text"
      value={chatMessage}
      onChange={(event) =>
        setChatMessage(
          event.target.value
        )
      }
      placeholder="Ask about this AI classification..."
      maxLength={1000}
      disabled={chatLoading}
    />

    <button
      type="submit"
      disabled={
        chatLoading ||
        !chatMessage.trim()
      }
    >
      {chatLoading
        ? "Sending..."
        : "Send"}
    </button>

  </form>


  <div className="chatbot-disclaimer">

    <strong>
      Important:
    </strong>

    <span>
      This assistant provides academic and
      informational explanations only. It does not
      inspect the X-ray image, provide a medical
      diagnosis, or prescribe treatment.
    </span>

  </div>

</div>

          </section>

        )}


        {/* =====================================================
            MODEL PERFORMANCE
        ====================================================== */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                Model Evaluation
              </span>

              <h2>
                DenseNet121 Performance
              </h2>

              <p>
                These are precomputed metrics from the
                held-out test dataset used in this
                academic project.
              </p>

            </div>

          </div>


          <div className="metric-grid">

            <div className="metric-card">

              <span>
                Test Accuracy
              </span>

              <strong>
                94.48%
              </strong>

              <small>
                Held-out test set
              </small>

            </div>


            <div className="metric-card">

              <span>
                Macro Precision
              </span>

              <strong>
                92.44%
              </strong>

              <small>
                Across four classes
              </small>

            </div>


            <div className="metric-card">

              <span>
                Macro Recall
              </span>

              <strong>
                94.55%
              </strong>

              <small>
                Across four classes
              </small>

            </div>


            <div className="metric-card">

              <span>
                Macro F1-Score
              </span>

              <strong>
                93.33%
              </strong>

              <small>
                Balanced class metric
              </small>

            </div>

          </div>


          <p className="metrics-disclaimer">
            These metrics represent performance on the
            project's held-out test dataset. They do not
            establish clinical performance and are not
            the confidence score of the currently
            uploaded image.
          </p>

        </section>


        {/* =====================================================
            MODEL COMPARISON
        ====================================================== */}

        <section className="dashboard-section comparison-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                Research Comparison
              </span>

              <h2>
                Custom CNN vs DenseNet121
              </h2>

              <p>
                DenseNet121 achieved stronger results
                than the baseline CNN and was therefore
                selected for deployment.
              </p>

            </div>

          </div>


          <div className="comparison-table-wrapper">

            <table className="comparison-table">

              <thead>

                <tr>

                  <th>
                    Metric
                  </th>

                  <th>
                    Custom CNN
                  </th>

                  <th>
                    DenseNet121
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td>
                    Test Accuracy
                  </td>

                  <td>
                    87.73%
                  </td>

                  <td className="best-result">
                    94.48%
                  </td>

                </tr>


                <tr>

                  <td>
                    Macro Precision
                  </td>

                  <td>
                    85.01%
                  </td>

                  <td className="best-result">
                    92.44%
                  </td>

                </tr>


                <tr>

                  <td>
                    Macro Recall
                  </td>

                  <td>
                    88.05%
                  </td>

                  <td className="best-result">
                    94.55%
                  </td>

                </tr>


                <tr>

                  <td>
                    Macro F1
                  </td>

                  <td>
                    85.95%
                  </td>

                  <td className="best-result">
                    93.33%
                  </td>

                </tr>

              </tbody>

            </table>

          </div>


          <div className="comparison-summary">

            <strong>
              Why DenseNet121?
            </strong>

            <p>
              DenseNet121 improved test accuracy by
              approximately 6.75 percentage points over
              the custom CNN in this experiment.
              Transfer learning allowed the model to
              benefit from features learned from the
              ImageNet dataset before adapting to the
              chest X-ray classification task.
            </p>

          </div>

        </section>

        <PredictionHistory
          refreshKey={historyRefreshKey}
        />

        <ProfileCard user={user} />

      </div>

    </main>
  );
}


export default Dashboard;