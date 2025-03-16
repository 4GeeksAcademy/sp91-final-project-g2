import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { CommentsList } from "../../component/Admin/CommentList.jsx";
import Pagination from "../../component/Pagination.jsx"; // Importa el componente de paginación

export const CommentsListPage = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Número de comentarios por página

  // Calcular los comentarios a mostrar en la página actual
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = store.comments?.slice(indexOfFirstComment, indexOfLastComment) || [];

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
      <CommentsList comments={currentComments} onEdit={handleEdit} onDelete={handleDelete} />

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