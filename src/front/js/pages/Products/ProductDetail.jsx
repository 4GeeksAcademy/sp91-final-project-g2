import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../../store/appContext";

const ProductDetail = () => {
    const { id } = useParams();
    const { actions } = useContext(Context);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await actions.getProductById(id);
            setProduct(productData);
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p>Cargando producto...</p>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock}</p>
        </div>
    );
};

export default ProductDetail;
