import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const OrderDetail = ({ order }) => {
    if (!order) { return <p>No hay datos de la orden.</p>; }

    return (
        <Card className="mb-3 shadow">
            <Card.Body>
                <Card.Title>Orden #{order.id}</Card.Title>
                <Card.Text>
                    <strong>Estado:</strong> {order.status}
                </Card.Text>
                <Card.Text>
                    <strong>Fecha:</strong>{" "}
                    {new Date(order.date).toLocaleDateString()}
                </Card.Text>
                <Card.Text>
                    <strong>Dirección:</strong> {order.address}
                </Card.Text>
                <Card.Text>
                    <strong>Total:</strong>{" "}
                    ${parseFloat(order.total_price).toFixed(2)}
                </Card.Text>
                <h5>Productos:</h5>
                {order.order_items && order.order_items.length > 0 ? (
                    <ListGroup>{order.order_items.map((item) => (
                        <ListGroup.Item key={item.id}>
                            <Row>
                                <Col md={2}>
                                    <img
                                        src={item.product?.photo || "https://img.freepik.com/vector-premium/no-hay-foto-disponible-icono-vector.jpg"}
                                        alt={item.product?.name || "Producto"}
                                        className="img-fluid rounded-start"
                                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                </Col>
                                <Col md={10}>
                                    <h6>{item.product?.name}</h6>
                                    <p><strong>Categoría:</strong>{" "}{item.product?.category}</p>
                                    <p>{item.product?.description}</p>
                                    <p><strong>Precio Unit.:</strong>{" "} ${parseFloat(item.price).toFixed(2)}</p>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                ) : (<p>No hay productos en esta orden.</p>)}
            </Card.Body>
        </Card>
    );
};
