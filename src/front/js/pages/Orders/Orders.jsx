import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import OrderItems from "./OrderItems.jsx";



const Orders = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Mis Órdenes</h2>
            {store.orders.length === 0 ? (
                <p>No tienes órdenes aún.</p>
            ) : (
                store.orders.map(order => (
                    <Card key={order.id} className="mb-3 shadow">
                        <Card.Body>
                            <Card.Title>Orden #{order.id}</Card.Title>
                            <Card.Text>
                                <strong>Estado:</strong> {order.status}
                            </Card.Text>
                            <Card.Text>
                                <strong>Fecha:</strong> {new Date(order.date).toLocaleDateString()}
                            </Card.Text>
                            <Card.Text>
                                <strong>Dirección:</strong> {order.address}
                            </Card.Text>
                            <Card.Text>
                                <strong>Total:</strong> ${order.total_price.toFixed(2)}
                            </Card.Text>
                            <h5>Productos:</h5>
                            <ListGroup>
                                {order.order_items.map(item => (
                                    <OrderItems key={item.id} item={item} />
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    );
};

export default Orders;
