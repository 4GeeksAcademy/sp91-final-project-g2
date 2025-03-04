import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export const UserList = () => {
    const {store, actions} = useContext(Context);
    const navigate = useNavigate();

    const admins = store.users?.filter(user => user.is_admin) || [];
    const vendors = store.users?.filter(user => user.is_vendor) || [];
    const customers = store.users?.filter(user => user.is_customer) || [];

    const renderUser = (user) =>(
        <div key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{user.first_name} - {user.email}</span>
            <div>
                <FaEdit className="text-primary me-3" style={{ cursor: "pointer"}} onClick={() => navigate(`/user-details/${user.id}`, { state: { id: user.id }})}/>
                <FaTrash className="text-danger" style={{ cursor: "pointer" }} onClick={() => actions.deactivateUser(user.id)}/>
            </div>
        </div> 
    );

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
          alert("Acceso denegado");
          navigate("/login");
        }
      }, [store.isLogged, store.userRole, navigate]);

    return(
        <div className="container mt-5">
            <h2>Lista de Usuarios</h2>
            <h4>Administradores</h4>
            <div className="list-group mb-4">
                {admins.length > 0 ? admins.map(renderUser) : <p>No hay Administradores registrados.</p>}
            </div>
            <h4>Vendedores</h4>
            <div className="list-group mb-4">
                {admins.length > 0 ? vendors.map(renderUser) : <p>No hay vendedores registrados.</p>}
            </div>
            <h4>Clientes</h4>
            <div className="list-group mb-4">
                {customers.length > 0 ? customers.map(renderUser) : <p>No hay clientes registrados.</p>}
            </div>
            <div>
            <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>Regresar</button>
            </div>
        </div>
    )
}
   