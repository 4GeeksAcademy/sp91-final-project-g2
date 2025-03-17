import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../../component/Pagination.jsx";
import { CommentList } from "../../component/Admin/CommentList.jsx";

export const CommentsListPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    useEffect(() => {
        const loadCommentsAndUsers = async () => {
            if (!store.isLogged || store.userRole !== "is_admin") {
                alert("Acceso denegado");
                navigate("/login");
            } else {
                await actions.getComments();
                const userIds = [...new Set(store.comments.map(c => c.user_id))];
                userIds.forEach(async userId => {
                    if (!store.users.some(user => user.id === userId)) {
                        await actions.getUserById(userId);
                    }
                });
            }
        };
        loadCommentsAndUsers();
    }, [store.isLogged, store.userRole, actions, navigate]);

    const handleDelete = async (userId, commentId) => {
        const confirmed = window.confirm("¿Está seguro de eliminar este comentario?");
        if (confirmed) {
            const success = await actions.deleteCommentAsAdmin(userId, commentId);
            if (success) {
                alert("Comentario eliminado correctamente");
                await actions.getComments();  // Recargar comentarios luego de eliminar
            } else {
                alert("Error al eliminar comentario");
            }
        }
    };

    // Paginación calculada aquí:
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = store.comments?.slice(indexOfFirstComment, indexOfLastComment) || [];

    return (
        <div className="container mt-4">
            <h1>Listado de Comentarios</h1>
            <CommentList comments={currentComments} users={store.users} onDelete={handleDelete} />

            {/* Componente de paginación */}
            <div className="pagination-container mt-3">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil((store.comments?.length || 0) / commentsPerPage)}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <button className="btn btn-secondary mt-3" onClick={() => navigate("/adminpage")}>
                Regresar
            </button>
        </div>
    );
};
