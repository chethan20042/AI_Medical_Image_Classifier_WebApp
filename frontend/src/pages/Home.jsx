import { Link } from "react-router-dom";


function Home() {
  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="home-hero">

        <div className="home-container hero-grid">

          <div className="hero-content">

            <span className="hero-badge">
              MCA Mini Project · Deep Learning
            </span>

            <h1>
              AI Medical Image Classifier
            </h1>

            <p className="hero-description">
              An academic chest X-ray classification
              system using a trained DenseNet121
              deep-learning model to classify images
              into COVID-19, Normal, Pneumonia and
              Tuberculosis categories.
            </p>


            <div className="hero-actions">

              <Link
                to="/register"
                className="hero-primary-button"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                className="hero-secondary-button"
              >
                Login
              </Link>

            </div>


            <div className="hero-note">

              <strong>
                Academic Use Only
              </strong>

              <span>
                This system is not a clinical
                diagnostic tool.
              </span>

            </div>

          </div>


          {/* HERO MODEL CARD */}

          <div className="hero-model-card">

            <div className="hero-model-header">

              <div>
                <span>
                  Deployment Model
                </span>

                <h2>
                  DenseNet121
                </h2>
              </div>

              <div className="hero-model-status">
                Active
              </div>

            </div>


            <div className="hero-model-metric">

              <span>
                Test Accuracy
              </span>

              <strong>
                94.48%
              </strong>

            </div>


            <div className="hero-model-details">

              <div>
                <span>
                  Input
                </span>

                <strong>
                  224 × 224 × 3
                </strong>
              </div>


              <div>
                <span>
                  Output Classes
                </span>

                <strong>
                  4
                </strong>
              </div>


              <div>
                <span>
                  Learning Method
                </span>

                <strong>
                  Transfer Learning
                </strong>
              </div>


              <div>
                <span>
                  Pretrained On
                </span>

                <strong>
                  ImageNet
                </strong>
              </div>

            </div>


            <p className="hero-model-note">
              94.48% represents performance on the
              held-out test dataset used in this
              academic project and does not establish
              clinical performance.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUPPORTED CLASSES
      ====================================================== */}

      <section className="home-section">

        <div className="home-container">

          <div className="home-section-heading">

            <span className="section-label">
              Supported Categories
            </span>

            <h2>
              Four-Class Chest X-Ray Classification
            </h2>

            <p>
              The deployed DenseNet121 model produces
              probabilities across four trained
              categories.
            </p>

          </div>


          <div className="disease-grid">

            <div className="disease-card">

              <div className="disease-icon">
                01
              </div>

              <h3>
                COVID-19
              </h3>

              <p>
                One of the four image categories used
                during model training and evaluation.
              </p>

            </div>


            <div className="disease-card">

              <div className="disease-icon">
                02
              </div>

              <h3>
                Normal
              </h3>

              <p>
                Represents chest X-ray images assigned
                to the normal category in the dataset.
              </p>

            </div>


            <div className="disease-card">

              <div className="disease-icon">
                03
              </div>

              <h3>
                Pneumonia
              </h3>

              <p>
                A trained classification category
                included in the project's dataset.
              </p>

            </div>


            <div className="disease-card">

              <div className="disease-icon">
                04
              </div>

              <h3>
                Tuberculosis
              </h3>

              <p>
                One of the four target classes
                predicted by the DenseNet121 model.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="home-section home-section-soft">

        <div className="home-container">

          <div className="home-section-heading">

            <span className="section-label">
              System Workflow
            </span>

            <h2>
              How the Application Works
            </h2>

            <p>
              The system combines React, Flask,
              DenseNet121, MongoDB and an LLM API in
              one full-stack academic application.
            </p>

          </div>


          <div className="workflow-grid">

            <div className="workflow-card">

              <span className="workflow-number">
                1
              </span>

              <h3>
                Register or Login
              </h3>

              <p>
                Users authenticate securely using
                hashed passwords and JWT-based
                authentication.
              </p>

            </div>


            <div className="workflow-card">

              <span className="workflow-number">
                2
              </span>

              <h3>
                Upload X-Ray
              </h3>

              <p>
                A JPG, JPEG or PNG chest X-ray is
                selected from the authenticated
                dashboard.
              </p>

            </div>


            <div className="workflow-card">

              <span className="workflow-number">
                3
              </span>

              <h3>
                DenseNet121 Classification
              </h3>

              <p>
                Flask preprocesses the image and runs
                inference using the existing trained
                DenseNet121 model.
              </p>

            </div>


            <div className="workflow-card">

              <span className="workflow-number">
                4
              </span>

              <h3>
                View Results
              </h3>

              <p>
                The dashboard displays the predicted
                class, confidence, probabilities and
                AI-generated explanation.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MODEL COMPARISON
      ====================================================== */}

      <section className="home-section">

        <div className="home-container">

          <div className="home-section-heading">

            <span className="section-label">
              Experimental Comparison
            </span>

            <h2>
              Why DenseNet121 Was Selected
            </h2>

            <p>
              Two models were evaluated using the
              same train, validation and test split.
            </p>

          </div>


          <div className="home-comparison-card">

            <div className="home-comparison-column">

              <span className="comparison-model-label">
                Baseline Model
              </span>

              <h3>
                Custom CNN
              </h3>

              <strong>
                87.73%
              </strong>

              <p>
                Test Accuracy
              </p>

            </div>


            <div className="comparison-arrow">
              →
            </div>


            <div className="home-comparison-column selected-model">

              <span className="comparison-model-label">
                Selected Model
              </span>

              <h3>
                DenseNet121
              </h3>

              <strong>
                94.48%
              </strong>

              <p>
                Test Accuracy
              </p>

            </div>

          </div>


          <div className="home-comparison-note">

            DenseNet121 improved test accuracy by
            approximately <strong>6.75 percentage
            points</strong> compared with the custom
            CNN in this experiment.

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="home-section home-section-soft">

        <div className="home-container">

          <div className="home-section-heading">

            <span className="section-label">
              Application Features
            </span>

            <h2>
              Full-Stack AI Classification Platform
            </h2>

          </div>


          <div className="feature-grid">

            <div className="feature-card">
              <h3>
                Secure Authentication
              </h3>

              <p>
                User registration, bcrypt password
                hashing and JWT-protected routes.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                AI Classification
              </h3>

              <p>
                Real-time inference using the deployed
                DenseNet121 model.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                Probability Chart
              </h3>

              <p>
                Recharts visualization of all four
                model output probabilities.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                AI Explanation
              </h3>

              <p>
                Plain-language interpretation of the
                numerical model result.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                Context-Aware Chatbot
              </h3>

              <p>
                Ask questions based on the current
                prediction context.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                Prediction History
              </h3>

              <p>
                Previous authenticated predictions are
                stored securely in MongoDB.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                PDF Report
              </h3>

              <p>
                Download an academic classification
                report using jsPDF.
              </p>
            </div>


            <div className="feature-card">
              <h3>
                Research Comparison
              </h3>

              <p>
                Displays the actual Custom CNN and
                DenseNet121 evaluation metrics.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="home-cta">

        <div className="home-container home-cta-content">

          <div>

            <span className="section-label">
              Get Started
            </span>

            <h2>
              Explore the AI Classification Dashboard
            </h2>

            <p>
              Create an account or login to upload a
              chest X-ray and view the model output.
            </p>

          </div>


          <div className="home-cta-actions">

            <Link
              to="/register"
              className="hero-primary-button"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="hero-secondary-button"
            >
              Login
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          DISCLAIMER
      ====================================================== */}

      <section className="home-final-disclaimer">

        <div className="home-container">

          <strong>
            Medical Disclaimer
          </strong>

          <p>
            This AI Medical Image Classifier was
            developed for academic and educational
            purposes only. The model classification
            is not a medical diagnosis and should not
            replace evaluation by a qualified
            healthcare professional. The reported
            94.48% test accuracy was obtained on the
            held-out dataset used in this project and
            does not establish clinical performance.
          </p>

        </div>

      </section>

    </main>
  );
}


export default Home;