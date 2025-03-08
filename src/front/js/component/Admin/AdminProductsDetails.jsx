import React from "react";
import { FaEdit, FaCamera } from "react-icons/fa";

export const AdminProductDetail = ({ product, editMode, toggleEditMode, onChange, onSubmit, onDeactivate, onPhotoAction }) => {
  
  if (!product || Object.keys(product).length === 0) return <p>Cargando producto...</p>;

  return (
    <div className="card mb-3" style={{ maxWidth: "1000px", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          zIndex: 10,
        }}gi
        onClick={toggleEditMode}
        title="Editar"
      >
        <FaEdit size={24} color="blue" />
      </div>
      <div className="row g-0">
        <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
          <img
            src={product.photo || "https://detallesorballo.com/wp-content/uploads/2020/09/imagen-de-prueba-320x240-1.jpg"}
            className="img-fluid rounded-start"
            alt={product.name || "Producto sin nombre"}
            style={{ maxHeight: "250px", objectFit: "cover" }}
          />
          <div style={{ marginTop: "5px", cursor: "pointer" }} onClick={onPhotoAction} title="Editar/Eliminar Foto">
            <FaCamera size={20} color="gray" />
          </div>
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
                    value={product.name || ""}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Nombre del producto"
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Categoría:</h5>
                  <input
                    type="text"
                    name="category"
                    value={product.category || ""}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Categoría"
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Descripción:</h5>
                  <input
                    type="text"
                    name="description"
                    value={product.description || ""}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Descripción del producto"
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Precio:</h5>
                  <input
                    type="number"
                    name="price"
                    value={product.price || ""}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Precio"
                    required
                  />
                </div>
                <div className="mb-3">
                  <h5>Estado:</h5>
                  <input
                    type="text"
                    name="in_sell"
                    value={product.in_sell ? "Producto en venta" : "Producto no está en venta"}
                    onChange={onChange}
                    className="form-control"
                    placeholder="Estado"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary me-2">Guardar Cambios</button>
                <button type="button" className="btn btn-danger" onClick={onDeactivate}>Desactivar Producto</button>
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
