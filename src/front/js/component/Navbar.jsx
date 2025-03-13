import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import logo from "../../img/logo-cafetaleros.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link } from "react-router-dom";

export const NavbarCafetaleros = () => {
  const { store } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Función para hacer scroll al footer
  const handleScrollToFooter = (e) => {
    e.preventDefault(); // Evita la navegación predeterminada
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg py-3" style={{ backgroundColor: "#C4A484" }}>
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-3">
            <li className="nav-item">
              <Link className="nav-link custom-link" to="/product-list">Cafés Especiales</Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link className="navbar-brand mx-3" to="/">
                <img src={logo} alt="Cafetaleros Logo" height="50" />
              </Link>
            </li>
            {/* Botón de contacto que hace scroll al footer */}
            <li className="nav-item">
              <Link className="nav-link custom-link" to="#" onClick={handleScrollToFooter}>Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Dropdown de favoritos (solo si está logueado) */}
        {store.isLogged && (
          <div className="ms-auto d-flex align-items-center gap-3" style={{ marginRight: "5px" }}>
            <div className="dropdown">
              <button
                className={`btn dropdown-toggle custom-dropdown-btn ${isDropdownOpen ? "active" : ""}`}
                type="button"
                id="cartDropdown"
                data-bs-toggle="dropdown"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <i className={`fa-${isDropdownOpen ? "solid" : "regular"} fa-heart heart-icon`}></i>
              </button>
              <ul className="dropdown-menu custom-dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown">
                <li><Link className="dropdown-item custom-dropdown-item" to="#">Ver carrito</Link></li>
              </ul>
            </div>
          </div>
        )}

        {/* Botones de Login y Sign Up */}
        <div className="d-flex gap-2">
          <Link to="/login" className="btn custom-btn"><i className="fa fa-user"></i> Login</Link>
          <Link to="/signup" className="btn custom-btn"><i className="fa fa-user-plus"></i> Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarCafetaleros;
