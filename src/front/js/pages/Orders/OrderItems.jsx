import React from "react";
import { Card } from "react-bootstrap";

const OrderItems = ({ item }) => {
  return (
    <Card className="mb-2 shadow-sm">
      <Card.Body>
        <Card.Title>Producto ID: {item.product_id}</Card.Title>
        <Card.Text>
          <strong>Precio:</strong> ${item.price.toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default OrderItems;
