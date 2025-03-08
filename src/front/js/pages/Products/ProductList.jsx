import React, { useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import ProductCard from "./ProductCards.jsx";

const ProductList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProducts();
    }, []);

    return (
        <div>
            <h2>Lista de Productos</h2>
            <div className="product-list">
                {store.products.length > 0 ? (
                    store.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default ProductList;
