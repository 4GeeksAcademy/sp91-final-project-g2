import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { AdminProductList } from "../../component/Admin/AdminProductList.jsx";

export const ProductListPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

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
            <AdminProductList products={store.products} onDeactivate={handleDeactivateProduct}/>
            <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>Regresar</button>                
        </div>
    );
};