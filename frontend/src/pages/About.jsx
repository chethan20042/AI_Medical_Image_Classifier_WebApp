function About() {
  return (
    <main className="about-page">

      <div className="home-container">

        {/* HEADER */}

        <section className="about-header">

          <span className="section-label">
            Academic Project
          </span>

          <h1>
            About the AI Medical Image Classifier
          </h1>

          <p>
            This project was developed as an MCA mini project
            to study deep-learning-based chest X-ray image
            classification and compare a custom CNN with a
            DenseNet121 transfer-learning model.
          </p>

        </section>


        {/* PURPOSE */}

        <section className="about-card">

          <span className="section-label">
            Project Purpose
          </span>

          <h2>
            Academic Chest X-Ray Classification
          </h2>

          <p>
            The application classifies chest X-ray images into
            four trained categories:
          </p>

          <div className="about-class-grid">

            <div>COVID-19</div>
            <div>Normal</div>
            <div>Pneumonia</div>
            <div>Tuberculosis</div>

          </div>

          <p className="about-note">
            The application is designed for academic and
            educational purposes only and is not a clinical
            diagnostic system.
          </p>

        </section>


        {/* DATASET */}

        <section className="about-card">

          <span className="section-label">
            Dataset
          </span>

          <h2>
            Dataset Preparation
          </h2>

          <div className="about-stat-grid">

            <div>
              <span>
                Training
              </span>

              <strong>
                4,962
              </strong>
            </div>


            <div>
              <span>
                Validation
              </span>

              <strong>
                1,062
              </strong>
            </div>


            <div>
              <span>
                Testing
              </span>

              <strong>
                1,068
              </strong>
            </div>


            <div>
              <span>
                Duplicates Removed
              </span>

              <strong>
                42
              </strong>
            </div>

          </div>


          <div className="about-list">

            <p>
              <strong>Split:</strong>{" "}
              approximately 70% training, 15% validation
              and 15% testing.
            </p>

            <p>
              <strong>Corrupted Images:</strong>{" "}
              0 detected.
            </p>

            <p>
              <strong>Duplicate Images:</strong>{" "}
              42 exact duplicates removed.
            </p>

            <p>
              <strong>Fair Comparison:</strong>{" "}
              the same dataset split was used for both
              the custom CNN and DenseNet121.
            </p>

          </div>

        </section>


        {/* PREPROCESSING */}

        <section className="about-card">

          <span className="section-label">
            Preprocessing
          </span>

          <h2>
            Image Preparation
          </h2>

          <div className="about-feature-grid">

            <div>
              <strong>
                224 × 224
              </strong>

              <span>
                Image size
              </span>
            </div>


            <div>
              <strong>
                RGB
              </strong>

              <span>
                Three channels
              </span>
            </div>


            <div>
              <strong>
                Augmentation
              </strong>

              <span>
                Training only
              </span>
            </div>


            <div>
              <strong>
                Class Weights
              </strong>

              <span>
                Imbalance handling
              </span>
            </div>

          </div>


          <p>
            Conservative augmentation was applied only to the
            training set, including rotation, translation,
            zoom and contrast adjustment. Validation and test
            images were not augmented.
          </p>

        </section>


        {/* MODEL COMPARISON */}

        <section className="about-card">

          <span className="section-label">
            Model Comparison
          </span>

          <h2>
            Custom CNN vs DenseNet121
          </h2>

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
                    Macro F1-score
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


          <div className="about-highlight">

            <strong>
              Final Selected Model: DenseNet121
            </strong>

            <p>
              DenseNet121 improved test accuracy by
              approximately 6.75 percentage points compared
              with the custom CNN in this experiment.
            </p>

          </div>

        </section>


        {/* WHY DENSENET */}

        <section className="about-card">

          <span className="section-label">
            Transfer Learning
          </span>

          <h2>
            Why DenseNet121 Performed Better
          </h2>

          <p>
            DenseNet121 used ImageNet-pretrained weights,
            allowing the network to start with useful
            general visual features rather than learning
            everything from scratch.
          </p>

          <p>
            Dense connections also encourage feature reuse
            and improve information flow across layers.
            In this experiment, this produced stronger
            evaluation results than the custom CNN.
          </p>

        </section>


        {/* LIMITATIONS */}

        <section className="about-card">

          <span className="section-label">
            Limitations
          </span>

          <h2>
            Current Project Limitations
          </h2>

          <div className="limitations-grid">

            <div>
              No clinical validation
            </div>

            <div>
              Limited to four classes
            </div>

            <div>
              No DICOM support
            </div>

            <div>
              No Grad-CAM yet
            </div>

            <div>
              No radiologist verification
            </div>

            <div>
              Dataset-specific performance
            </div>

          </div>

        </section>


        {/* FUTURE WORK */}

        <section className="about-card">

          <span className="section-label">
            Future Improvements
          </span>

          <h2>
            Possible Future Enhancements
          </h2>

          <div className="about-list">

            <p>
              Grad-CAM and explainable AI visualization.
            </p>

            <p>
              Larger and multi-hospital datasets.
            </p>

            <p>
              External validation and radiologist verification.
            </p>

            <p>
              DICOM support and batch image upload.
            </p>

            <p>
              Better fine-tuning and ensemble models.
            </p>

            <p>
              Mobile application and cloud deployment.
            </p>

            <p>
              Federated learning and clinical validation.
            </p>

          </div>

        </section>


        {/* DISCLAIMER */}

        <section className="about-disclaimer">

          <strong>
            Medical Disclaimer
          </strong>

          <p>
            This project was developed for academic and
            educational purposes only. The reported
            performance values were obtained on the held-out
            test dataset used in this project and do not
            establish clinical performance. The system must
            not be used as a substitute for professional
            medical evaluation.
          </p>

        </section>

      </div>

    </main>
  );
}


export default About;