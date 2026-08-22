import { useCallback, useEffect, useState } from "react";

import api from "../services/api";


function PredictionHistory({ refreshKey = 0 }) {
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [expandedId, setExpandedId] = useState(null);


  // ---------------------------------------------------------
  // FETCH HISTORY
  // ---------------------------------------------------------

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/history"
      );

      setHistory(
        response.data.history || []
      );

    } catch (error) {
      const backendMessage =
        error.response?.data?.message;

      setError(
        backendMessage ||
          "Unable to load prediction history."
      );

    } finally {
      setLoading(false);
    }
  }, []);


  // ---------------------------------------------------------
  // LOAD HISTORY
  // ---------------------------------------------------------

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, refreshKey]);


  // ---------------------------------------------------------
  // FORMAT DATE
  // ---------------------------------------------------------

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Date unavailable";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString();
  };


  // ---------------------------------------------------------
  // FORMAT CLASS NAME
  // ---------------------------------------------------------

  const formatClassName = (className) => {
    if (!className) {
      return "Unknown";
    }

    if (
      className.toLowerCase() === "covid19"
    ) {
      return "COVID-19";
    }

    return (
      className.charAt(0).toUpperCase() +
      className.slice(1)
    );
  };


  // ---------------------------------------------------------
  // TOGGLE DETAILS
  // ---------------------------------------------------------

  const toggleDetails = (predictionId) => {
    setExpandedId((current) =>
      current === predictionId
        ? null
        : predictionId
    );
  };


  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (loading) {
    return (
      <section className="dashboard-section">
        <div className="history-loading">
          Loading prediction history...
        </div>
      </section>
    );
  }


  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error) {
    return (
      <section className="dashboard-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              Previous Results
            </span>

            <h2>
              Prediction History
            </h2>
          </div>
        </div>

        <div className="history-error">
          {error}
        </div>

      </section>
    );
  }


  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <section className="dashboard-section">

      <div className="history-header">

        <div className="section-heading history-heading">
          <div>

            <span className="section-label">
              Previous Results
            </span>

            <h2>
              Prediction History
            </h2>

            <p>
              Review your previous AI model
              classifications saved in your account.
            </p>

          </div>
        </div>


        <div className="history-count">
          {history.length}{" "}
          {history.length === 1
            ? "Prediction"
            : "Predictions"}
        </div>

      </div>


      {history.length === 0 ? (

        <div className="history-empty">

          <div className="history-empty-icon">
            H
          </div>

          <h3>
            No predictions yet
          </h3>

          <p>
            Your completed X-ray classifications
            will appear here.
          </p>

        </div>

      ) : (

        <div className="history-list">

          {history.map((item) => {

            const isExpanded =
              expandedId === item.id;

            return (
              <article
                className="history-item"
                key={item.id}
              >

                <div className="history-item-main">

                  <div className="history-class">

                    <span className="history-class-label">
                      AI Classification
                    </span>

                    <strong>
                      {formatClassName(
                        item.predicted_class
                      )}
                    </strong>

                  </div>


                  <div className="history-meta">

                    <div>
                      <span>
                        Confidence
                      </span>

                      <strong>
                        {Number(
                          item.confidence || 0
                        ).toFixed(2)}
                        %
                      </strong>
                    </div>


                    <div>
                      <span>
                        Image
                      </span>

                      <strong
                        className="history-filename"
                        title={
                          item.image_filename
                        }
                      >
                        {item.image_filename ||
                          "Unavailable"}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Date & Time
                      </span>

                      <strong>
                        {formatDate(
                          item.timestamp
                        )}
                      </strong>
                    </div>

                  </div>


                  <button
                    type="button"
                    className="history-details-button"
                    onClick={() =>
                      toggleDetails(item.id)
                    }
                  >
                    {isExpanded
                      ? "Hide Details"
                      : "View Details"}
                  </button>

                </div>


                {isExpanded && (

                  <div className="history-details">

                    <div className="history-probabilities">

                      <h4>
                        Class Probabilities
                      </h4>


                      <div className="history-probability-grid">

                        <div>
                          <span>
                            COVID-19
                          </span>

                          <strong>
                            {Number(
                              item.probabilities
                                ?.covid19 || 0
                            ).toFixed(2)}
                            %
                          </strong>
                        </div>


                        <div>
                          <span>
                            Normal
                          </span>

                          <strong>
                            {Number(
                              item.probabilities
                                ?.normal || 0
                            ).toFixed(2)}
                            %
                          </strong>
                        </div>


                        <div>
                          <span>
                            Pneumonia
                          </span>

                          <strong>
                            {Number(
                              item.probabilities
                                ?.pneumonia || 0
                            ).toFixed(2)}
                            %
                          </strong>
                        </div>


                        <div>
                          <span>
                            Tuberculosis
                          </span>

                          <strong>
                            {Number(
                              item.probabilities
                                ?.tuberculosis || 0
                            ).toFixed(2)}
                            %
                          </strong>
                        </div>

                      </div>

                    </div>


                    {item.ai_summary ? (

                      <div className="history-ai-summary">

                        <span className="section-label">
                          AI-Generated Explanation
                        </span>

                        <p>
                          {item.ai_summary}
                        </p>

                      </div>

                    ) : (

                      <div className="history-no-summary">
                        AI explanation was not stored
                        for this older prediction.
                      </div>

                    )}

                  </div>

                )}

              </article>
            );
          })}

        </div>

      )}


      <div className="history-disclaimer">

        <strong>
          Academic Use Only:
        </strong>

        <span>
          Saved classifications are AI model
          outputs and must not be interpreted as
          medical diagnoses.
        </span>

      </div>

    </section>
  );
}


export default PredictionHistory;