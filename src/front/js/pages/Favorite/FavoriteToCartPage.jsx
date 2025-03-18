import React, { useContext, useEffect, useState } from "react";
import { FavoriteToCart } from "../../component/Favorites/FavoriteToCart.jsx";
import { Context } from "../../store/appContext.js";
import { useNavigate } from "react-router-dom";

export const FavoriteToCartPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_customer") {
            alert("Acceso denegado");
            navigate("/login");
        }
    }, [store.isLogged, store.userRole]);

    const handleAddToOrder = (product) => {
        if (selectedProducts.some(item => item.id === product.id)) {
            alert("Este producto ya fue añadido");
            return;
        }
        setSelectedProducts(prev => [...prev, product]);
    };

    const handleRemoveFromOrder = (product) => {
        setSelectedProducts(prev => prev.filter(item => item.id !== product.id));
    };

    const handlePayment = async () => {
        if (selectedProducts.length === 0) {
            alert("No has seleccionado productos.");
            return;
        }

        const orderData = {
            status: "pendiente",  // Guardamos la orden en estado pendiente
            address: store.user.address,
            total_price: selectedProducts.reduce((acc, p) => acc + p.price, 0),
            items: selectedProducts.map(p => ({
                product_id: p.id,
                price: p.price
            }))
        };

        const success = await actions.createOrder(orderData);
        if (success) {
            alert("¡Tu orden se ha creado (pendiente) exitosamente!");
            setSelectedProducts([]);
            navigate("/complete-favorite-orders");
        } else {
            alert("Error al crear la orden. Intenta nuevamente.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Comprar productos favoritos</h2>
            <FavoriteToCart
                favorites={store.favorites}
                selectedProducts={selectedProducts}
                onAddToOrder={handleAddToOrder}
                onRemoveFromOrder={handleRemoveFromOrder}
            />
            <div className="d-flex justify-content-between align-items-center mt-4">
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                    Añadir más productos
                </button>
                <div>
                    <button className="btn btn-success me-3" onClick={handlePayment}>
                        Guardar Orden Pendiente (${selectedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)})
                    </button>

                </div>
            </div>
        </div>
    );
};
