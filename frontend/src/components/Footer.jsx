import { Link } from "react-router-dom";


function Footer() {
  const currentYear =
    new Date().getFullYear();


  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* PROJECT */}

        <div className="footer-project">

          <div className="footer-brand">

            <div className="footer-brand-icon">
              AI
            </div>


            <div>
              <strong>
                AI Medical Image Classifier
              </strong>

              <span>
                Academic Deep Learning Project
              </span>
            </div>

          </div>


          <p>
            A chest X-ray classification web
            application developed for academic and
            educational purposes using DenseNet121,
            Flask, React and MongoDB.
          </p>

        </div>


        {/* NAVIGATION */}

        <div className="footer-column">

          <h3>
            Navigation
          </h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/about">
            About Project
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Create Account
          </Link>

        </div>


        {/* MODEL */}

        <div className="footer-column">

          <h3>
            Model
          </h3>

          <span>
            DenseNet121
          </span>

          <span>
            224 × 224 × 3 Input
          </span>

          <span>
            4 Output Classes
          </span>

          <span>
            Transfer Learning
          </span>

        </div>


        {/* SUPPORTED CLASSES */}

        <div className="footer-column">

          <h3>
            Classes
          </h3>

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


      {/* MEDICAL DISCLAIMER */}

      <div className="footer-disclaimer">

        <div className="footer-disclaimer-content">

          <strong>
            Academic / Educational Use Only
          </strong>

          <p>
            This AI Medical Image Classifier is not a
            clinical diagnostic system. Model
            classifications and AI-generated
            explanations should not replace evaluation
            by a qualified healthcare professional.
            The reported model performance was obtained
            on the held-out dataset used in this
            project and does not establish clinical
            performance.
          </p>

        </div>

      </div>


      {/* COPYRIGHT */}

      <div className="footer-bottom">

        <div className="footer-bottom-content">

          <span>
            © {currentYear} AI Medical Image Classifier
          </span>

          <span>
            MCA Mini Project
          </span>

        </div>

      </div>

    </footer>
  );
}


export default Footer;