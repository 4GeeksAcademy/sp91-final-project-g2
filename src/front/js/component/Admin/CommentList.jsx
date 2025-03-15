import React, { useState } from "react";
import Pagination from "../../component/Pagination.jsx"; // Importa el componente de paginación

export const CommentsList = ({ comments, onEdit, onDelete }) => {
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5; // Número de comentarios por página

  // Calcular los comentarios a mostrar en la página actual
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  return (
    <div className="container mt-4">
      {comments.length === 0 ? (
        <p>No hay comentarios disponibles.</p>
      ) : (
        currentComments.map((comment) => (
          <div key={comment.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{comment.title}</h5>
              <p className="card-text">{comment.description}</p>
              <p className="card-text">
                <small className="text-muted">
                  Usuario: {comment.user_id} | Producto: {comment.product_id}
                </small>
              </p>
              <button className="btn btn-primary me-2" onClick={() => onEdit(comment.id)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(comment.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}

      {/* Componente de paginación */}
      {comments.length > commentsPerPage && (
        <div className="pagination-container mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(comments.length / commentsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};
