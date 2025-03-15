import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import logo from "../../img/logo-cafetaleros.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useNavigate } from "react-router-dom";
import { FavoritesDropdown } from "./FavoritesDropdown.jsx";


export const NavbarCafetaleros = () => {
  const { store } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Agregado 

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

        {/*Creación de Favoritos*/}        
        <div className="ms-auto d-flex align-items-center gap-3" style={{ marginRight: "5px" }}>
          <FavoritesDropdown/>
        </div>
        

        
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
