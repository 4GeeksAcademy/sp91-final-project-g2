import React from "react";

export const ProductDetail = ({ product, onChange, onSubmit, onDeactivate }) => {
    if (!product) return <p>Cargando detalles del producto...</p>

    return (
        <div className="card mb-3" style={{ maxWidth: "800px" }}>
            <div className="row g-0">
                <div className="col-md-4">
                    {product.photo ? (<img src={product.photo} className="img-fluid rounded-start" alt={product.name} />)
                        :
                        (<div className="d-flex align-items-center justify-content-center bg-secondary text-white" style={{ height: "100%", minHeight: "200px" }}>Sin Imagen</div>)}
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre:</label>
                                <input type="text" name="name" value={product.name || ""} onChange={onChange} className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Categoría:</label>
                                <input type="text" name="category" value={product.category || ""} onChange={onChange} className="form-control" required />
                            </div>
                            <div>
                                <label className="form-label">Descripción:</label>
                                <input type="text" name="description" value={product.description || ""} onChange={onChange} className="form-control" required />
                            </div>
                            <div>
                                <label className="form-label">Precio:</label>
                                <input type="text" name="price" value={product.price || ""} onChange={onChange} className="form-control" required />
                            </div>
                            <div>
                                <label className="form-label">Estado:</label>
                                <input type="text" name="in_sell" value={product.in_sell ? "En Venta" : "Desactivado"} onChange={onChange} className="form-control" required />
                            </div>
                            <button type="submit" className="btn btn-primary me-2"> Guardar Cambios</button>
                            <button type="button" className="btn btn-danger" onClick={onDeactivate}>Desactivar Producto</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}