import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { CommentList } from "../../component/Admin/CommentList.jsx";

export const CommentsListPage = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

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
      } else {
        alert("Error al eliminar comentario");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1>Listado de Comentarios</h1>
      <CommentList comments={store.comments || []} users={store.users || []} onDelete={handleDelete} />
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/adminpage")}> Regresar </button>
    </div>
  );
};