import React from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const AdminProductDetail = ({ product, editMode, toggleEditMode, editValues, onChange, onSubmit, onDeactivate }) => {
  const navigate = useNavigate();

  if (!product || Object.keys(product).length === 0) return <p>Cargando producto...</p>;

  return (
    <div className="card mb-3" style={{ maxWidth: "1000px", position: "relative" }}>
      <div style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer", zIndex: 10 }} onClick={toggleEditMode} title="Editar">
        <FaEdit size={24} color="blue" />
      </div>
      <div className="row g-0">
        <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
          <img
            src={product.photo || "https://www.fundaciomaresme.cat/wp-content/uploads/2019/11/imagen-de-prueba-320x240.jpg"}
            className="img-fluid rounded-start"
            alt={product.name || "Producto sin nombre"}
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            {editMode ? (
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <h5>Nombre:</h5>
                  <input
                    type="text"
                    name="name"
                    value={editValues.name}
                    onChange={onChange}
                    className="form-control"
                    placeholder={product.name || "Nombre del producto"}
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Categoría:</h5>
                  <input
                    type="text"
                    name="category"
                    value={editValues.category}
                    onChange={onChange}
                    className="form-control"
                    placeholder={product.category || "Categoría"}
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Descripción:</h5>
                  <input
                    type="text"
                    name="description"
                    value={editValues.description}
                    onChange={onChange}
                    className="form-control"
                    placeholder={product.description || "Descripción del producto"}
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Precio:</h5>
                  <input
                    type="number"
                    name="price"
                    value={editValues.price}
                    onChange={onChange}
                    className="form-control"
                    placeholder={product.price || "Precio"}
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Estado:</h5>
                  <input
                    type="text"
                    name="in_sell"
                    value={editValues.in_sell}
                    onChange={onChange}
                    className="form-control"
                    placeholder={product.in_sell ? "Producto en venta" : "Producto no está en venta"}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary me-2">
                  Guardar Cambios
                </button>
                <button type="button" className="btn btn-danger" onClick={onDeactivate}>
                  Desactivar Producto
                </button>
              </form>
            ) : (
              <div>
                <h5>Nombre:</h5>
                <p>{product.name || "Sin nombre"}</p>
                <h5>Categoría:</h5>
                <p>{product.category || "Sin categoría"}</p>
                <h5>Descripción:</h5>
                <p>{product.description || "Sin descripción"}</p>
                <h5>Precio:</h5>
                <p>{product.price ? `$${product.price}` : "Sin precio"}</p>
                <h5>Estado:</h5>
                <p>{product.in_sell ? "Producto en venta" : "Producto no está en venta"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};