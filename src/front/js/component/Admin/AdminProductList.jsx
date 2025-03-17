import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../../component/Pagination.jsx";

export const AdminProductList = ({ products, onDeactivate }) => {
    const navigate = useNavigate();

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5; // Número de productos por página

    // Calcular los productos a mostrar en la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className="list-group">
            {/* Renderizar los productos de la página actual */}
            {currentProducts.map(product => (
                <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{product.name} - ${product.price}</span>
                    <div>
                        <FaEdit
                            className="text-primary me-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/product-details-page/${product.id}`)}
                        />
                        <FaTrash
                            className="text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => onDeactivate(product.id)}
                        />
                    </div>
                </div>
            ))}

            {/* Componente de paginación */}
            <div className="pagination-container mt-3">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(products.length / productsPerPage)}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};