import React, { useState, useContext } from "react";
/* import PropTypes from "prop-types"; */
import { Context } from "../../store/appContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export const ProductCard = ({ product }) => {
  const { actions } = useContext(Context);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="col-lg-3 col-md-4 col-sm-6 mb-4 mt-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card product-card text-center">
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>
          <h6 className="price">${product.price.toFixed(2)}</h6>
          <button
            className={`btn btn-add-cart ${isHovered ? "hovered" : ""}`}
            onClick={() => actions.addToCart(product)}
          >
            <i className="fa fa-cart-plus"></i> Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

// Validación de props
/* ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    photo: PropTypes.string,
  }).isRequired,
}; */

