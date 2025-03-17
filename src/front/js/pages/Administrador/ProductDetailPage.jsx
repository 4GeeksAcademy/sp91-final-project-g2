import React, { useContext, useEffect, useState } from "react";
import { AdminProductDetail } from "../../component/Admin/AdminProductsDetails.jsx";
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetailPage = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

  const [productOriginal, setProductOriginal] = useState({});
  const [productEdit, setProductEdit] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let isMounted = true
    const token = store.token;
    if (!token || !store.isLogged || store.userRole !== "is_admin") {
      alert("Acceso denegado");
      navigate("/login");
    }
    const fetchProduct = async () => {
      const data = await actions.getProductById(id);
      const actualProduct = data?.results || data;
      if (isMounted) {
        if (actualProduct) {
          setProductOriginal(actualProduct);
          setProductEdit({
            ...actualProduct,
            in_sell: actualProduct.in_sell ? "Producto en venta" : "Producto no está en venta",
          });
        } else {
          alert("Producto no encontrado");
          navigate("/product-list-page");
        }
      }
    };

    if (id) {
      fetchProduct();
    } else {
      navigate("/product-list-page");
    }

    return () => {
      isMounted = false;
    };

  }, [store.isLogged, store.userRole, store.token, navigate]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    if (!editMode) {
      setProductEdit({
        ...productOriginal,
        in_sell: productOriginal.in_sell ? "Producto en venta" : "Producto no está en venta",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedProduct = {
      name: productEdit.name.trim() || productOriginal.name,
      category: productEdit.category.trim() || productOriginal.category,
      description: productEdit.description.trim() || productOriginal.description,
      price: productEdit.price !== "" ? parseFloat(productEdit.price) : productOriginal.price,
      in_sell: productEdit.in_sell === "Producto en venta"
    };
    const success = await actions.updateProduct(id, updatedProduct);
    if (success) {
      setProductOriginal(updatedProduct)
      setEditMode(false)
      navigate("/product-list-page");
    }
  };

  const handleDeactivate = async () => {
    const success = await actions.deactivateProduct(id);
    if (success) {
      navigate("/product-list-page");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Detalle del Producto</h2>
      {Object.keys(productOriginal).length > 0 ? (
        <AdminProductDetail
          product={productOriginal}
          editMode={editMode}
          toggleEditMode={toggleEditMode}
          editValues={productEdit}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onDeactivate={handleDeactivate}
        />
      ) : (
        <p>Cargando detalles del producto...</p>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/product-list-page")}>
        Regresar
      </button>
    </div>
  );
};