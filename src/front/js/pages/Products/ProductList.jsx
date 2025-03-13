import React, { useEffect, useContext } from "react";
import { Context } from "../../store/appContext";
import {ProductCards} from "./ProductCards.jsx";

export const ProductList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProducts();
    }, []);

    return (
        <div>
            <h2>Lista de Productos</h2>
            <div className="product-list row row-cols-1 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 ">
                {store.products.length > 0 ? (
                    store.products.map((product) => (
                        <ProductCards key={product.id} product={product} />
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </div>
        </div>
    );
};


