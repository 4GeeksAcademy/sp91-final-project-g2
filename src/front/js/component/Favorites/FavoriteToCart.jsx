import React from "react";

export const FavoriteToCart = ({ favorites, selectedProducts, onAddToOrder, onRemoveFromOrder }) => {
    return (
        <div className="container mt-4">
            {favorites.length === 0 ? (
                <p>No tienes productos favoritos para añadir al carrito.</p>
            ) : (
                <div className="row">
                    {favorites.map((fav) => {
                        const isSelected = selectedProducts.some(p => p.id === fav.product.id);
                        return (
                            <div key={fav.favorite_id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                <div className="card h-100">
                                    <img src={fav.product.photo} className="card-img-top" alt={fav.product.name} style={{ objectFit: "cover", height: "180px" }} />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{fav.product.name}</h5>
                                        <h4 className="text-muted" style={{ fontSize: "1rem" }}>{fav.product.category}</h4>
                                        <p className="card-text" style={{ flex: "1 1 auto" }}>{fav.product.description}</p>
                                        <p><strong>Precio:</strong> ${fav.product.price?.toFixed(2)}</p>
                                        <div className="mt-auto">
                                            <button className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'}`} onClick={() => onAddToOrder(fav.product)} disabled={isSelected}>
                                                {isSelected ? "Añadido" : "Añadir a la compra"}</button>
                                            {isSelected && (
                                                <button className="btn btn-danger ms-2" onClick={() => onRemoveFromOrder(fav.product)}>Eliminar del pedido</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
