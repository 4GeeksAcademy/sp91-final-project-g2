import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const UserList = ({ users, onEdit, onDeactivate, onToggleExpand, expandedUserId }) => {
    const navigate = useNavigate();

    const renderUserDetails = (user) => (
        <div className="mt-2 p-2 border rounded bg-light">
            <p><strong>Nombre: </strong>{user.first_name}</p>
            <p><strong>Apellido: </strong>{user.last_name}</p>
            <p><strong>Teléfono: </strong>{user.phone}</p>
            <p><strong>Dirección: </strong>{user.address}</p>
            <p><strong>Estado: </strong>{user.is_activ ? "Activo" : "Inactivo"}</p>
        </div>
    );

    const renderUser = (user) => (
        <div key={user.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => onToggleExpand(user.id)}>
                <div>
                    <span>{user.email}</span>
                    <FaEdit className="text-primary me-3" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onEdit(user.id); }} />
                    <FaTrash className="text-danger" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onDeactivate(user.id); }} />
                </div>
            </div>
            {expandedUserId === user.id && renderUserDetails(user)}
        </div>
    )

    return (
        <div className="list-group">
            {users.map((user) => renderUser(user))}
        </div>
    )
}
