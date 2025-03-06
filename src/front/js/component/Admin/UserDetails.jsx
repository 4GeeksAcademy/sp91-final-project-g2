import React from "react";

export const UserDetail = ({ user, onChange, onSubmit, onDeactivate }) =>{
    if(!user) return <p>Cargando detalles...</p>

    return(
        <div className="container mt-4">
            <h1>Administración</h1>
            <h2>Detalles del Usuario</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input type="text" name="first_name" value={user.first_name || ""} onChange={onChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido:</label>
                    <input type="text" name="last_name" value={user.last_name || ""} onChange={onChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico:</label>
                    <input type="email" name="email" value={user.email || ""} onChange={onChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono:</label>
                    <input type="text" name="phone" value={user.phone || ""} onChange={onChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" name="address" value={user.address || ""} onChange={onChange} className="form-control" required/>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="is_customer" checked={user.is_customer || false} onChange={onChange} className="form-check-input"/>
                    <label className="form-check-label">Es Cliente</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="is_vendor" checked={user.is_vendor || false} onChange={onChange} className="form-check-input"/>
                    <label className="form-check-label">Es Vendedor</label>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Guardar Cambios</button>
                <button type="button" className="btn btn-danger mt-3 ms-3" onClick={onDeactivate}>Desactivar Usuario</button>
            </form>
        </div>        
    )
}