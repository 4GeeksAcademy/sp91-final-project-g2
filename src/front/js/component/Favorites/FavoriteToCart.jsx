import React from "react";

export const FavoriteToCart = ({ favorites, selectedProducts, onAddToOrder, onRemoveFromOrder }) => {
    return (
        <div className="container mt-4">
            {favorites.length === 0 ? (
                <p>No tienes productos favoritos para añadir al carrito.</p>
            ) : (
                favorites.map((fav) => {
                    const isSelected = selectedProducts.some(p => p.id === fav.product.id);
                    return (
                        <div key={fav.favorite_id} className="col-md-4 mb-3">
                            <div className="card">
                                <img src={fav.product.photo} className="card-img-top" alt={fav.product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{fav.product.name}</h5>
                                    <div className="d-flex justify-content-start">
                                        <button className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`}
                                            onClick={() => onAddToOrder(fav.product)} disabled={isSelected}>{isSelected ? "Añadido" : "Añadir a la compra"}
                                        </button>
                                        {isSelected && (<button className="btn btn-danger ms-2" onClick={() => onRemoveFromOrder(fav.product)}>Eliminar del pedido</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
