import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

export const UserCommentsPage = () => {
    const { store, actions } = useContext(Context);
    const { user_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
        } else {
            actions.clearUserComments();
            actions.getUserComments(user_id);
        }
    }, [store.isLogged, store.userRole, user_id]);

    const handleEdit = (commentId) => {
        navigate(`/`)
    }

    const handleDelete = async (commentId) => {
        const confirmed = window.confirm("¿Seguro que deseas eliminar este comentario?");
        if (confirmed) {
            const success = await actions.deleteComment(user_id, commentId);
            if (success) actions.getUserComments(user_id); 
        }
    };

    return (
        <div className="container mt-4">
            <h1>Comentarios del Usuario {user_id}</h1>
            {store.userComments.length === 0 ? (
                <p>No hay comentarios disponibles.</p>
            ) : (
                store.userComments.map((comment) => (
                    <div key={comment.id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{comment.title}</h5>
                            <p className="card-text">{comment.description}</p>
                            <button className="btn btn-primary me-2" onClick={() => handleEdit(comment.id)}>Editar</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(comment.id)}>Eliminar</button>
                        </div>
                    </div>
                ))
            )}
            <button className="btn btn-secondary" onClick={() => navigate("/user-list-page")}>
                Volver
            </button>
        </div>
    )
}