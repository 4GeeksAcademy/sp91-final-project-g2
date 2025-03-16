import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export const ProductCards = ({ product }) => {
  const { actions } = useContext(Context);
  const [isHovered, setIsHovered] = useState(false);
  

  return (
    <div
      className="col mb-4 mt-2"
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

      <style>
        {`
          .product-card {
            background-color: #C4A484;
            border: none;
            border-radius: 12px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease-in-out;
            padding: 15px;
          }

          .product-card:hover {
            transform: scale(1.03);
          }

          .card-title {
            color: #5C4033;
            font-weight: bold;
          }

          .card-text {
            color: #6D4C41;
          }

          .price {
            color: #5C4033;
            font-size: 1.2rem;
            font-weight: bold;
          }

          .btn-add-cart {
            background-color: #5C4033;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 8px;
            font-weight: bold;
            width: 100%;
            transition: background-color 0.3s ease-in-out, transform 0.2s;
          }

          .btn-add-cart.hovered {
            background-color: #D2B48C;
            color: #5C4033;
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};
