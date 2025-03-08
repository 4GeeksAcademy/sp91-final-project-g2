import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { CommentsList } from "../../component/Admin/CommentList.jsx";

export const CommentsListPage = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.isLogged || store.userRole !== "is_admin") {
      alert("Acceso denegado");
      navigate("/login");
    } else {
      actions.getComments();
    }
  }, [store.isLogged, store.userRole, actions, navigate]);

  const handleEdit = (commentId) => {
    navigate(`//${commentId}`);
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm("¿Está seguro de eliminar este comentario?");
    if (confirmed) {
      await actions.deleteComment(commentId);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Listado de Comentarios</h1>
      <CommentsList comments={store.comments || []} onEdit={handleEdit} onDelete={handleDelete} />
      <button className="btn btn-secondary mt-3" onClick={() => navigate("/adminpage")}> Regresar </button>
    </div>
  );
};