import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { AdminProductList } from "../../component/Admin/AdminProductList.jsx";
import Pagination from "../../component/Pagination.jsx"; // Importa el componente de paginación

export const ProductListPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5; // Número de productos por página

    // Calcular los productos a mostrar en la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = store.products?.slice(indexOfFirstProduct, indexOfLastProduct) || [];

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
        }
    }, [store.isLogged, store.userRole, navigate]);

    const handleDeactivateProduct = async (productId) => {
        await actions.deactivateProduct(productId);
    };

    return (
        <div className="container mt-4">
            <h1>Administración</h1>
            <h2>Listado de Productos</h2>
            <AdminProductList products={currentProducts} onDeactivate={handleDeactivateProduct} />

            {/* Componente de paginación */}
            {store.products?.length > productsPerPage && (
                <div className="pagination-container mt-3">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(store.products.length / productsPerPage)}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}

            <button className="btn btn-secondary mt-3" onClick={() => navigate('/adminpage')}>
                Regresar
            </button>
        </div>
    );
};