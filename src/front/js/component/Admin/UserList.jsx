import React from "react";
import { FaComments, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import '../../../styles/userlist.css';
import Pagination from "../../component/Pagination.jsx"; // Asegúrate de que este componente esté correctamente implementado

export const UserList = ({ users, onEdit, onDeactivate, onToggleExpand, expandedUserId }) => {
    const navigate = useNavigate();

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; // Número de usuarios por página

    // Calcular los usuarios a mostrar en la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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

    const renderUser = (user) => (
        <div key={user.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} onClick={() => onToggleExpand(user.id)}>
                <div className="d-flex justify-content-between align-items-center">
                    <span>{user.email}</span>
                </div>
                <div className="icon-container">
                    <FaEdit
                        className="text-primary me-3"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(user.id);
                        }}
                    />
                    <FaTrash
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeactivate(user.id);
                        }}
                    />
                </div>
            </div>
            {expandedUserId === user.id && renderUserDetails(user)}
        </div>
    );

    return (
        <div className="list-group">
            {/* Renderizar los usuarios de la página actual */}
            {currentUsers.map((user) => renderUser(user))}

            {/* Componente de paginación */}
            <div className="pagination-container">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(users.length / usersPerPage)}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};