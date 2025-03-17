import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import logo from "../../img/logo-cafetaleros.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useNavigate } from "react-router-dom";

export const NavbarCafetaleros = () => {
  const { store } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleScrollToFooter = (e) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg py-3 w-100" style={{ backgroundColor: "#C4A484", width: "100vw" }}>
      <div className="container-fluid">
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
            <li className="nav-item">
              <Link className="nav-link custom-link" to="#" onClick={handleScrollToFooter}>Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Botón de Carrito */}
        <button
          className="btn btn-outline-dark position-relative me-3"
          onClick={() => navigate("/orderitems")}
        >
          <i className="fa fa-shopping-cart"></i>
          {store.orderitems && store.orderitems.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {store.orderitems.length}
            </span>
          )}
        </button>

        {store.isLogged ? (
          <div className="ms-auto d-flex align-items-center gap-3" style={{ marginRight: "5px" }}>
            {/* Dropdown de Favoritos */}
            <div className="dropdown">
              <button
                className={`btn dropdown-toggle custom-dropdown-btn ${isDropdownOpen ? "active" : ""}`}
                type="button"
                id="cartDropdown"
                data-bs-toggle="dropdown"
                aria-expanded={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <i className={`fa-${isDropdownOpen ? "solid" : "regular"} fa-heart heart-icon`}></i>
              </button>
              <ul className="dropdown-menu custom-dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown">
                <li><Link className="dropdown-item custom-dropdown-item" to="#">Ver favoritos</Link></li>
              </ul>
            </div>

            {/* Botón para publicar producto si es vendedor */}
            {store.userRole === "vendedor" && (
              <button 
                className="btn btn-success" 
                onClick={() => navigate("/product-form")}
              >
                Publicar un producto
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex gap-2">
            <Link to="/login" className="btn custom-btn"><i className="fa fa-user"></i> Login</Link>
            <Link to="/signup" className="btn custom-btn"><i className="fa fa-user-plus"></i> Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarCafetaleros;
