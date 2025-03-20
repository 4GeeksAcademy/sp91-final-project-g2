import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext.js";
import { useNavigate } from "react-router-dom";
import { FavoriteItem } from "../../component/Favorites/FavoriteItem.jsx";
import "../../../styles/favorites.css"

export const FavoritesPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_customer") {
            alert("Acceso denegado");
            navigate("/login");
        } 
    }, []);

    const handleAddAllAndNavigate = () => {
        actions.addAllFavoritesToCart();
        navigate("/favorite-to-cart");
    };

    return (
        <div className="favorites-container">
            <h1 className="favorites-header">Mis Favoritos</h1>
            <p className="favorites-description">Guarda todos tus productos favoritos y agrúpalos en diferentes listas para tener todo organizado.</p>
            <div className="favorites-actions">
                <button className="add-all-button" onClick={handleAddAllAndNavigate}>Añadir todo al carrito</button>
                <button className="back-to-shop" onClick={() => navigate("/")}>Volver a la tienda</button>
            </div>

            {store.favorites.length === 0 ? (
                <p>No hay productos favoritos registrados</p>
            ) : (
                <ul className="favorites-list">
                    {store.favorites.map((fav) => (
                        <FavoriteItem key={fav.favorite_id || fav.id} product={fav.product}
                            onRemove={() => actions.deleteFavorite(fav.favorite_id)}
                            onAddToCart={() => actions.addFavoriteToCart(fav.product.id)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}