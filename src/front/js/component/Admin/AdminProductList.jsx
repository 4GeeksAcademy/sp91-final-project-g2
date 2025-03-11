import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const AdminProductList = ({ products, onDeactivate }) => {
    const navigate = useNavigate();


    return (
        <div className="list-group">
            {products.map(product => (
                <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{product.name} - ${product.price}</span>
                    <div>
                        <FaEdit className="text-primary me-3" style={{ cursor: "pointer" }} onClick={() => {navigate(`/product-details-page/${product.id}`)}} />
                        <FaTrash className="text-danger" style={{ cursor: "pointer" }} onClick={() => onDeactivate(product.id)} />
                    </div>
                </div>
            ))}
        </div>
    );
};