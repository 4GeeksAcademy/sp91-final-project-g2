import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { UserList } from "../../component/Admin/UserList.jsx";

export const UserListPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
        }
    }, []);

    const handleEdit = (id) => {
        navigate(`/user-details/${id}`);
    };

    const handleDeactivate = async (id) => {
        await actions.deactivateUser(id);
        if (success) actions.getUsers();
    };

    const handleToggleExpand = (id) => {
        setExpandedUserId(expandedUserId === id ? null : id);
    }

    // Separar a los usuarios dependiendo el tipo de rol que tengan.
    const admins = store.users?.filter((user) => user.is_admin) || [];
    const vendors = store.users?.filter((user) => user.is_vendor && !user.is_admin) || [];
    const customers = store.users?.filter((user) => user.is_customer && !user.is_vendor && !user.is_admin) || [];

    return (
        <div className="container mt-5">
            <h1>Administración</h1>
            <h2>Listado de Usuarios</h2>
            <h4>Administradores</h4>
            <UserList users={admins} onEdit={handleEdit} onDeactivate={handleDeactivate} onToggleExpand={handleToggleExpand} expandedUserId={expandedUserId} />
            <h4>Vendedores</h4>
            <UserList users={vendors} onEdit={handleEdit} onDeactivate={handleDeactivate} onToggleExpand={handleToggleExpand} expandedUserId={expandedUserId} />
            <h4>Clientes</h4>
            <UserList users={customers} onEdit={handleEdit} onDeactivate={handleDeactivate} onToggleExpand={handleToggleExpand} expandedUserId={expandedUserId} />
            <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>Regresar</button>
        </div>
    )
}
