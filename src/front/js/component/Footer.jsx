import React from "react";

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="text-white py-4 mt-auto w-100"
      style={{
        backgroundColor: "#C4A484",
        width: "100vw",
        position: "relative",
        bottom: 0,
      }}
    >
      <div className="container-fluid d-flex flex-column">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center w-100 px-4 mt-2">
          <div className="d-flex flex-column align-items-start text-center text-md-start">
            <h5 className="mb-2" style={{ color: "#5C4033" }}>Contacto</h5>
            <div>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none me-3">
                <i className="fab fa-instagram fa-2x" style={{ color: "#5C4033" }}></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none me-3">
                <i className="fab fa-twitter fa-2x" style={{ color: "#5C4033" }}></i>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                <i className="fab fa-facebook fa-2x" style={{ color: "#5C4033" }}></i>
              </a>
            </div>
          </div>

          <h6 className="text-center my-3 my-md-0" style={{ color: "#5C4033", fontFamily: "serif" }}>
            Since 2025
          </h6>

          <div className="text-end">
            <h6 className="m-0 text-center text-md-end" style={{ color: "#5C4033", fontFamily: "serif" }}>
              Autores: Luis Borjas, Karoll Guzman, Cristian Chacon
            </h6>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
