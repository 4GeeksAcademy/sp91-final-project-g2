import React, { useState } from "react";
import logo from "../../img/logo-cafetaleros.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export const NavbarCafetaleros = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg py-3" style={{ backgroundColor: "#C4A484" }}>
      <div className="container">
        {/* Botón para menú móvil */}
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
            <li className="nav-item"><a className="nav-link custom-link" href="#">Cafés Clásicos</a></li>
            <li className="nav-item"><a className="nav-link custom-link" href="#">Cafés Especiales</a></li>
            <li className="nav-item"><a className="nav-link custom-link" href="#">Cafés Descafeinados</a></li>
            <li className="nav-item d-none d-lg-block">
              <a className="navbar-brand mx-3" href="#">
                <img src={logo} alt="Cafetaleros Logo" height="50" />
              </a>
            </li>
            <li className="nav-item"><a className="nav-link custom-link" href="#">Tés e Infusiones</a></li>
            <li className="nav-item"><a className="nav-link custom-link" href="#">Accesorios</a></li>
            <li className="nav-item"><a className="nav-link custom-link" href="#">Contacto</a></li>
          </ul>
        </div>

        {/* Sección de la derecha */}
        <div className="ms-auto d-flex align-items-center gap-3" style={{ marginRight: "5px" }}>
          {/* Dropdown de favoritos */}
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
              <li><a className="dropdown-item custom-dropdown-item" href="#">Ver carrito</a></li>
            </ul>
          </div>

          {/* Botones de Login y Registro */}
          <div className="d-flex gap-2">
            <a href="#" className="btn custom-btn"><i className="fa fa-user"></i> Login</a>
            <a href="#" className="btn custom-btn"><i className="fa fa-user-plus"></i> Sign Up</a>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style>
        {`
          .custom-link {
            color: #5C4033 !important;
            transition: color 0.3s ease-in-out;
          }
          .custom-link:hover {
            color: #D2B48C !important;
          }
          .custom-dropdown-btn {
            background-color: #D2B48C !important;
            color: #5C4033 !important;
            border: none;
            transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
          }
          .custom-dropdown-btn.active {
            background-color: #8B4513 !important;
            color: white !important;
          }
          .heart-icon {
            color: #5C4033 !important;
            font-size: 1.2rem;
            transition: color 0.3s ease-in-out;
          }
          .custom-dropdown-menu {
            background-color: #D2B48C !important;
            border: none;
          }
          .custom-dropdown-item {
            color: #5C4033 !important;
          }
          .custom-dropdown-item:hover {
            background-color: #8B4513 !important;
            color: white !important;
          }
          .custom-btn {
            background-color: #8B4513 !important;
            color: white !important;
            transition: background-color 0.3s ease-in-out;
          }
          .custom-btn:hover {
            background-color: #5C4033 !important;
          }
          @media (max-width: 992px) {
            .navbar-nav {
              text-align: center;
            }
            .d-flex {
              flex-direction: column;
              align-items: center;
            }
            .custom-btn {
              width: 100%;
              text-align: center;
              margin-top: 5px;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default NavbarCafetaleros;
