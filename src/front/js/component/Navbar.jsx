import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import logo from "../../img/logo-cafetaleros.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link, useNavigate } from "react-router-dom";
import { FavoritesDropdown } from "./Favorites/FavoritesDropdown.jsx";

export const NavbarCafetaleros = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate(); // Agregado 

  // Actualiza favoritos inmediatamente luego del login
  useEffect(() => {
    if (store.isLogged && store.userRole === "is_customer") {
      actions.getFavorites();
    }
  }, [])


  const handleScrollToFooter = (e) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    actions.logout()
    navigate("/")
  }

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

            {/* Botón de contacto que hace scroll al footer */}
            <li className="nav-item">
              <Link className="nav-link custom-link" to="#" onClick={handleScrollToFooter}>Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Botón de Carrito */}
        <button className="btn btn-outline-dark position-relative me-3" onClick={() => navigate("/orderitems")}>
          <i className="fa fa-shopping-cart"></i>
          {store.orderitems && store.orderitems.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {store.orderitems.length}
            </span>
          )}
        </button>

        {/* Iconos lado derecho */}
        <div className="ms-auto d-flex align-items-center gap-3 me-2">
          {/* Favoritos */}
          <FavoritesDropdown />
          {/* LLogin/Profile */}
          <button className="btn btn-outline-dark position-relative"
            onClick={() => navigate(store.isLogged ? "/profilepage" : "/login")}
            title={store.isLogged ? "Ir al perfil" : "Iniciar sesión"}>
            <i className="fa fa-user"></i> {store.isLogged ? "Profile" : "Login"}
          </button>
          {!store.isLogged ? (<Link to="/signup" className="btn custom-btn ms-2">
            <i className="fa fa-user-plus"></i> Sign Up </Link>
          ) : (
            <button className="btn btn-secondary ms-2" onClick={handleLogout}>Logout</button>
          )}
        </div>

      </div>
    </nav>
  );
};

export default NavbarCafetaleros;
