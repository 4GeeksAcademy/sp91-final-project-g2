import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { CompleteFavoriteOrder } from "../../component/Favorites/CompleteFavoriteOrder.jsx";


export const CompleteFavoriteOrderPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_customer") {
            alert("Acceso denegado");
            navigate("/login");
        } else {
            actions.getOrders();
            actions.getOrderItems();
            actions.getProducts();  // Por si no los tienes ya
        }
    }, []);

    return (
        <div className="container mt-4">
            <h1>Mis Órdenes</h1>
            <CompleteFavoriteOrder orders={store.orders} orderItems={store.orderitems} products={store.products}/>
        </div>
    );
};
