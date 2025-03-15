import React from "react";
import { FaComments, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const UserList = ({ users, onEdit, onDeactivate, onToggleExpand, expandedUserId }) => {
    const navigate = useNavigate();

    const renderUserDetails = (user) => (
        <div className="mt-2 p-2 border-top">
            <p><strong>Nombre: </strong>{user.first_name}</p>
            <p><strong>Apellido: </strong>{user.last_name}</p>
            <p><strong>Teléfono: </strong>{user.phone}</p>
            <p><strong>Dirección: </strong>{user.address}</p>
            <p><strong>Estado: </strong>{user.is_activ ? "Activo" : "Inactivo"}</p>
            <button className="btn btn-sm btn-info" onClick={() => navigate(`/user/${user.id}/comments`)}><FaComments /></button>
        </div>
    );


    return (
        <div className="list-group">
            {users.map((user) => (
                <div key={user.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center" onClick={() => onToggleExpand(user.id)}>
                        <span>{user.email}</span>
                        <div>
                            <FaEdit className="mx-2 text-primary" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onEdit(user.id) }} />
                            <FaTrash className="text-danger" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onDeactivate(user.id); }} />
                            <FaComments className="mx-2 text-secondary" style={{ cursor: "pointer" }} onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/user/${user.id}/comments`);
                            }} />
                        </div>
                    </div>
                    {expandedUserId === user.id && renderUserDetails(user)}
                </div>
            ))}
        </div>
    )
}
