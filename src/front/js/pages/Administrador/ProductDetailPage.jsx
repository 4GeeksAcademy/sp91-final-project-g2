import React, { useContext, useEffect, useState } from "react";
import { AdminProductDetail } from "../../component/Admin/AdminProductsDetails.jsx";
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetailPage = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();

  const [productOriginal, setProductOriginal] = useState({});
  const [productEdit, setProductEdit] = useState({ name: "", category: "", description: "", price: "", in_sell: ""});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = store.token;
    if (!token || !store.isLogged || store.userRole !== "is_admin") {
      alert("Acceso denegado");
      navigate("/login");
    }
  }, [store.isLogged, store.userRole, store.token, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await actions.getProductById(id);
      const actualProduct = data && data.results ? data.results : data;
      if (actualProduct) {
        setProductOriginal(actualProduct);
        setProductEdit({name: "", category: "", description: "", price: "", in_sell: ""});
      } else {
        alert("Producto no encontrado");
        navigate("/product-list");
      }
    };

    if (id) {
      fetchProduct();
    } else {
      navigate("/product-list");
    }
  }, [id, actions, navigate]);

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductEdit(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedProduct = {
      name: productEdit.name !== "" ? productEdit.name : productOriginal.name,
      category: productEdit.category !== "" ? productEdit.category : productOriginal.category,
      description: productEdit.description !== "" ? productEdit.description : productOriginal.description,
      price: productEdit.price !== "" ? productEdit.price : productOriginal.price,
      in_sell: productEdit.in_sell !== ""
        ? (productEdit.in_sell.toLowerCase() === "producto en venta" ? true : false)
        : productOriginal.in_sell
    };
    const success = await actions.updateProduct(id, updatedProduct);
    if (success) {
      navigate("/product-list");
    }
  };

  const handleDeactivate = async () => {
    const success = await actions.deactivateProduct(id);
    if (success) {
      navigate("/product-list");
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
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/product-list")}>
        Regresar
      </button>
    </div>
  );
};