import React from "react";
import "../../styles/footer.css";

export const Footer = () => {
  return (
    <footer id="footer" className="text-white py-4 mt-auto w-100">
      <div className="container-fluid d-flex flex-column">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 px-4 mt-2">
          <div className="d-flex flex-column align-items-start text-center text-md-start">
            <h5 className="mb-2 contact-title">Contacto</h5>
            <div>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none me-3"
              >
                <i className="fab fa-instagram fa-2x social-icon"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none me-3"
              >
                <i className="fab fa-twitter fa-2x social-icon"></i>
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <i className="fab fa-facebook fa-2x social-icon"></i>
              </a>
            </div>
          </div>

          <h6 className="since-text">Since 2025</h6>

          <div className="text-end">
            <h6 className="m-0 text-center text-md-end authors-text">
              Autores: Luis Borjas, Karoll Guzmán, Cristian Chacón
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;