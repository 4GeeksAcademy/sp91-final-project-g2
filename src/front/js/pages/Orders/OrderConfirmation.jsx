import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { OrderDetail } from "../../component/OrderDetail.jsx";

function generateRandomOrderNumber() {
    // ejemplo: XXXXX-XXXX
    let randomPart1 = Math.floor(Math.random() * 90000) + 10000; // 5 dígitos
    let randomPart2 = Math.floor(Math.random() * 9000) + 1000;   // 4 dígitos
    return `${randomPart1}-${randomPart2}`;
}

export const OrderConfirmation = () => {
    const { store, actions } = useContext(Context);
    const [currentOrder, setCurrentOrder] = useState(null);
    const navigate = useNavigate();
    const [randomOrderNumber] = useState(generateRandomOrderNumber());

    useEffect(() => {
        actions.getOrders().then(() => {
            if (store.orders.length > 0) {
                const lastOrder = store.orders[store.orders.length - 1];
                setCurrentOrder(lastOrder);
            }
        });
    }, []);

    if (!currentOrder) {
        return (
            <div className="container mt-4">
                <h2>Cargando confirmación de tu orden...</h2>
            </div>
        );
    }

    const { first_name, last_name, address, phone } = store.user;

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center justify-content-between">
                <h2>Pedido realizado con éxito</h2>
                <h5 className="text-muted">Nº de Orden: {randomOrderNumber}</h5>
            </div>

            {/* Datos del usuario */}
            <div className="mt-3">
                <p><strong>Nombre:</strong> {first_name} {last_name}</p>
                <p><strong>Teléfono:</strong> {phone}</p>
                <p><strong>Dirección:</strong> {address}</p>
            </div>
            <OrderDetail order={currentOrder} />
            <div className="mt-3">
                <p><strong>Dirección de envío:</strong> {currentOrder.address}</p>
                <p><strong>Total a Pagar:</strong> ${parseFloat(currentOrder.total_price).toFixed(2)}</p>
            </div>
            <div className="mt-4">
                <h4>Mis Órdenes Anteriores</h4>
                {store.orders.length <= 1 ? (
                    <p>No tienes órdenes anteriores (además de esta).</p>
                ) : (store.orders.filter((o) => o.id !== currentOrder.id).map((o) => (
                    <div key={o.id} className="border p-2 mb-2">
                        <p>Orden #{o.id} - Fecha:{" "}{new Date(o.date).toLocaleDateString()} - Estado: {o.status} -{" "}Total: ${o.total_price}</p>
                        <Button variant="link" onClick={() => navigate("/orders")}>Ver Detalles</Button>
                    </div>
                ))
                )}
            </div>
            <div className="mt-3">
                <Button variant="primary" onClick={() => navigate("/")}>
                    Regresar a la tienda
                </Button>
            </div>
        </div>
    );
};
