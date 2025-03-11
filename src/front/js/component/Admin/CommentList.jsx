import React from "react";

export const CommentsList = ({ comments, onEdit, onDelete }) => {
  return (
    <div className="container mt-4">
      {comments.length === 0 ? (<p>No hay comentarios disponibles.</p>) 
      : 
      (comments.map((comment) => (<div key={comment.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{comment.title}</h5>
              <p className="card-text">{comment.description}</p>
              <p className="card-text"><small className="text-muted"> Usuario: {comment.user_id} | Producto: {comment.product_id}</small></p>
              <button className="btn btn-primary me-2" onClick={() => onEdit(comment.id)}>Editar</button>
              <button className="btn btn-danger" onClick={() => onDelete(comment.id)}>Eliminar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
