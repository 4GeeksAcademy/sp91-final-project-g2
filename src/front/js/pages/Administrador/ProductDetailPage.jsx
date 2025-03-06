import React, { useContext, useEffect, useState } from "react";
import { ProductDetail } from "../../component/Admin/ProductDetails.jsx";
import { Context } from "../../store/appContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const ProductDetailPage = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
        }
    }, [store.isLogged, store.userRole, navigate]);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await actions.getProductById(id);
            setProductData(data);
        };
        fetchProduct();
    }, [id, actions])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProductData((prevData) => ({ ...prevData, [name]: value, }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await actions.updateProduct(id, productData);
        if (success) navigate("/product-list");        
    };

    const handleDeactivate = async () => {
        const success = await actions.deactivateProduct(id);
        if (success) navigate("/product-list")
    }

    return (
        <div className="container mt-4">
            <h2>Detalle del Producto</h2>
            <ProductDetail product={productData} onChange={handleChange} onSubmit={handleSubmit} onDeactivate={handleDeactivate} />
            <button className="btn btn-secondary mt-3" onClick={() => Navigate("/product-list")}>Regresar</button>
        </div>
    )
}