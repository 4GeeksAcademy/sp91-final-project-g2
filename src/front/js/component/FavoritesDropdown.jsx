import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import "../../styles/favorites.css"

export const FavoritesDropdown = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (store.isLogged && store.userRole === "is_customer") {
          actions.getFavorites();
        }
      }, [store.isLogged, store.userRole]);

    const handleDelete = async (favoriteId) => {
        const success = await actions.deleteFavorite(favoriteId);
        if (!success) {
            alert("No se pudo eliminar el producto de la lista de favoritos");
        }
    };

    const handleAddAllToCart = async () => {
        navigate("/")
        alert("¿Desea comprar los productos?");
    };

    const handleViewAll = async () => {
        setIsOpen(false);
        navigate("/favorite-page");
    };

    return (
        <div className="dropdown position-relative">
            <button className="btn dropdown-toggle custom-dropdown-btn"
                type="button" id="favoritesDropdown" aria-expanded={isOpen} onClick={() => {
                    if (!store.isLogged || store.userRole !== "is_customer") {
                        navigate("/login");
                        return;
                    }
                    setIsOpen(!isOpen);
                }}>
                <span style={{ marginRight: "8px" }}>{store.favorites.length}</span>
                <FaHeart className={isOpen ? "text-danger" : "text-secondary"} />
            </button>

            <ul className={`dropdown-menu custom-dropdown-menu dropdown-menu-end ${isOpen ? "show" : ""}`}
                style={{ position: "absolute", top: "100%", right: 0 }} aria-labelledby="favoritesDropdown">

                {store.favorites.length === 0 ? (
                    <li className="dropdown-item">No hay favoritos</li>
                ) : (
                    store.favorites.map((fav, index) => (
                        <li key={fav.favorite_id || fav.product.id || index} className="dropdown-item d-flex justify-content-between align-items-center">
                            <span>{fav.product.name}</span>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(fav.favorite_id)}>
                                <FaTrash />
                            </button>
                        </li>
                    ))
                )}
                <li><hr className="dropdown-divider" /> </li>
                <li className="dropdown-item d-flex justify-content-between">
                    <button className="btn btn-success add-all-cart-btn" onClick={handleAddAllToCart}>
                        <FaShoppingCart style={{ marginRight: "5px" }} />Añadir todo al carrito
                    </button>
                </li>
                <li className="dropdown-item">
                    <button className="btn btn-link view-all-btn" onClick={handleViewAll}> Ver lista completa </button>
                </li>
            </ul>
        </div>
    );
}