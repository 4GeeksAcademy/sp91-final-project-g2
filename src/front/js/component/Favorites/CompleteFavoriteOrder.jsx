import React from "react";

export const CompleteFavoriteOrder = ({ orders, orderItems, products }) => {
    if (!orders || orders.length === 0) {
        return <p>No hay órdenes para mostrar.</p>;
    }

    return (
        <div>
            <h2>Mis Órdenes</h2>
            {orders.map(order => {
                const items = orderItems.filter(item => item.order_id === order.id);

                return (
                    <div key={order.id} className="card mb-3">
                        <div className="card-header">
                            <h5>Orden #{order.id} - Estado: {order.status}</h5>
                            <p>Dirección: {order.address}</p>
                            <p>Total: {order.total_price}</p>
                        </div>
                        <div className="card-body">
                            {items.length === 0 ? (
                                <p>No hay productos en esta orden.</p>
                            ) : (
                                items.map(item => {
                                    const product = products.find(p => p.id === item.product_id);
                                    return (
                                        <div key={item.id}>
                                            <h6>{product?.name}</h6>
                                            <p>Precio: {item.price}</p>
                                            <hr />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
