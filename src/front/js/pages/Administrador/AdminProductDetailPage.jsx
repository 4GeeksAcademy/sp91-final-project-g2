import React, { useContext, useEffect, useState } from "react";
import { ProductDetail } from "../../component/Admin/AdminProductsDetails.jsx";
import { Context } from "../../store/appContext.js";
import { useNavigate, useParams } from "react-router-dom";

export const ProductDetailPage = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado local para el producto y el modo de edición
  const [productData, setProductData] = useState({});
  const [editMode, setEditMode] = useState(false);

  // Verificar acceso (token, login y rol)
  useEffect(() => {
    const token = store.token;
    if (!token || !store.isLogged || store.userRole !== "is_admin") {
      alert("Acceso denegado");
      navigate("/login");
    }
  }, [store.isLogged, store.userRole, store.token, navigate]);

  // Obtener el producto desde la API y actualizar el estado local
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await actions.getProductById(id);
      // Si la API devuelve un objeto envuelto en results, extraemos el objeto real
      const actualProduct = data && data.results ? data.results : data;
      if (actualProduct) {
        setProductData(actualProduct);
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

  // Handler para alternar el modo edición
  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  // Handler para actualizar los inputs en modo edición
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para enviar la actualización al backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await actions.updateProduct(id, productData);
    if (success) {
      navigate("/product-list");
    }
  };

  // Handler para desactivar el producto
  const handleDeactivate = async () => {
    const success = await actions.deactivateProduct(id);
    if (success) {
      navigate("/product-list");
    }
  };

  // Handler para la acción sobre la foto
  const handlePhotoAction = () => {
    alert("Acción para editar/eliminar la foto. Implementar según la lógica deseada.");
  };

  return (
    <div className="container mt-4">
      <h2>Detalle del Producto</h2>
      {Object.keys(productData).length > 0 ? (
        <ProductDetail 
          product={productData}
          editMode={editMode}
          toggleEditMode={toggleEditMode}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onDeactivate={handleDeactivate}
          onPhotoAction={handlePhotoAction}
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
