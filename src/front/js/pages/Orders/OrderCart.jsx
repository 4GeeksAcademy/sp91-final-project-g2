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
import { faTrash, faCreditCard, faSave } from "@fortawesome/free-solid-svg-icons";

export const OrderCarts = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const cartItems = store.cart;

    useEffect(() => {
        actions.getOrderItems();
    }, []);

    const handleDelete = (productId) => {
        actions.removeFromCart(productId);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("No hay productos en tu carrito.");
            return;
        }
        let total = cartItems.reduce((acc, product) => acc + product.price, 0);
        const orderData = {
            status: "vendido",
            address: store.user.address || "",
            total_price: total
        };
        const success = await actions.createOrder(orderData);
        if (success) {
            alert("¡Pedido realizado con éxito!");
            actions.clearCart()
            navigate("/order-confirmation");
        } else {
            alert("Hubo un error al procesar la orden. Intenta de nuevo.");
        }
    };

    const handleSaveCart = async () => {
        if (cartItems.length === 0) {
            alert("No hay productos para guardar.");
            return;
        }
        let total = cartItems.reduce((acc, product) => acc + product.price, 0);
        const orderData = {
            status: "pendiente",
            address: store.user.address || "",
            total_price: total
        };
        const success = await actions.createOrder(orderData);
        if (success) {
            alert("Carrito guardado correctamente (orden pendiente).");
        } else {
            alert("Error al guardar el carrito.");
        }
    };

    const handleGoBackToStore = () => {
        navigate("/");
    };

    return (
        <Container>
            <h2 className="my-4">Carrito de Compras</h2>
            {cartItems.length === 0 ? <p>No hay productos en tu carrito.</p>
                : (<ListGroup>{cartItems.map((product, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
                        <Row className="w-100"><Col md={2} className="d-flex align-items-center">
                            <Card.Img src={product.photo || "https://img.freepik.com/vector-premium/no-hay-foto-disponible-icono-vector_87543-10615.jpg"}
                                alt={product.name || "Producto"} className="img-fluid rounded-start" />
                        </Col>
                            <Col md={5} className="d-flex align-items-center">
                                <h5>{product.name}</h5>
                            </Col>
                            <Col md={3} className="d-flex align-items-center">
                                <p>Precio: ${parseFloat(product.price).toFixed(2)}</p>
                            </Col>
                            <Col md={2} className="d-flex justify-content-end">
                                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))}
                </ListGroup>
                )
            }
            <div className="text-end mt-3">
                <Button variant="outline-primary" onClick={handleGoBackToStore}>Regresar a la tienda</Button>
                <Button variant="secondary" className="me-2" onClick={handleSaveCart}><FontAwesomeIcon icon={faSave} className="me-2" /> Guardar Carrito</Button>
                <Button variant="success" onClick={handleCheckout}><FontAwesomeIcon icon={faCreditCard} className="me-2" /> Pagar</Button>
            </div>
        </Container>
    );
};


