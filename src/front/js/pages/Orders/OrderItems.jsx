import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/appContext";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCreditCard } from "@fortawesome/free-solid-svg-icons";

const OrderItems = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getOrderItems(); // Obtener los items de la orden
    }, []);

    const handleDelete = (id) => {
        actions.removeOrderItem(id); // Acción para eliminar un producto
    };

    const handleCheckout = async () => {
        const success = await actions.createOrder(store.orderitems); // Enviar productos al crear la orden
    
        if (success) {
            actions.clearOrderItems(); // Vaciar el carrito una vez se pague
            navigate("/orders"); // Redirigir a órdenes
        } else {
            alert("Hubo un error al procesar la orden. Intenta de nuevo.");
        }
    };

    return (
        <Container>
            <h2 className="my-4">Detalles de la Orden</h2>
            {(!store.orderitems || store.orderitems.length === 0) ? (
                <p>No hay productos en tu orden.</p>
            ) : (
                <ListGroup>
                    {store.orderitems.map((product, index) => (
                        <ListGroup.Item key={index} className="d-flex align-items-center">
                            <Row className="w-100">
                                <Col md={2} className="d-flex align-items-center">
                                    <Card.Img 
                                        src={product.image || "https://via.placeholder.com/100"} 
                                        alt={product.name} 
                                        className="img-fluid rounded-start"
                                    />
                                </Col>
                                <Col md={5} className="d-flex align-items-center">
                                    <h5>{product.name}</h5>
                                </Col>
                                <Col md={3} className="d-flex align-items-center">
                                    <p>Precio: ${product.price.toFixed(2)}</p>
                                </Col>
                                <Col md={2} className="d-flex justify-content-end">
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            {/* Botón para pagar */}
            <div className="text-end mt-3">
                <Button variant="success" onClick={handleCheckout}>
                    <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                    Pagar
                </Button>
            </div>
        </Container>
    );
};

export default OrderItems;
