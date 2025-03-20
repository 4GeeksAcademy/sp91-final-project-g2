import React from "react";

export const FavoriteItem = ({ product, onRemove, onAddToCart }) => {
    return (
        <li className="favorite-item">
            <img className="favorite-image" src={product.photo} alt={product.name} />
            <div className="favorite-info">
                <h2 className="favorite-name">{product.name}</h2>
                <div className="favorite-actions">
                    <button className="add-cart-button" onClick={onAddToCart}>
                        Añadir al carrito
                    </button>
                    <button className="remove-fav-button" onClick={onRemove}>
                        Eliminar
                    </button>
                </div>
            </div>
        </li>
    );
};