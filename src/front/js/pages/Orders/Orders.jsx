import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { OrderDetail } from "../../component/OrderDetail.jsx";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Orders = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        actions.getOrders();
    }, []);

    const handleToggleDetail = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    const handleGoBackToStore = () => {
        navigate("/");
    };

    return (
        <div className="container mt-4 my-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Mis Órdenes</h2>
            </div>
            <div>
                {(!store.orders || store.orders.length === 0) ? (
                    <p>No tienes órdenes aún.</p>
                ) : (store.orders.map((order) => (
                    <div key={order.id} className="mb-3 border p-2 rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5>Orden #{order.id}</h5>
                            <Button variant="link" onClick={() => handleToggleDetail(order.id)}>
                                {expandedOrderId === order.id ? "Ocultar Detalle" : "Ver Detalle"}
                            </Button>
                        </div>
                        <p><strong>Estado:</strong> {order.status} |{" "}<strong>Fecha:</strong>
                            {" "} {new Date(order.date).toLocaleDateString()} |{" "}
                            <strong>Total:</strong>{" "} ${parseFloat(order.total_price).toFixed(2)}</p>
                        {expandedOrderId === order.id && (<OrderDetail order={order} />)}
                    </div>
                ))
                )}
            </div>
            <div>
                <Button variant="outline-primary" onClick={handleGoBackToStore}>Regresar a la tienda</Button>
            </div>
        </div>
    );
};

export default Orders;