import React from "react";

export const CommentList = ({ comments, users, onDelete }) => {
  const findUserById = (userId) => users.find(user => user.id === userId);

  return (
    <div className="container mt-4">
      {comments.length === 0 ? (
        <p>No hay comentarios disponibles.</p>
      ) : (
        comments.map((comment) => {
          const user = findUserById(comment.user_id);

          return (
            <div key={comment.id} className="card mb-3">
              <div className="card-header">
                Usuario: {user ? `${user.first_name} ${user.last_name}` : "Cargando..."}
                {user && (<span className="badge bg-secondary ms-2">
                    {user.is_admin ? "Admin" : user.is_vendor ? "Vendor" : "Customer"}
                  </span>
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title">{comment.title}</h5>
                <p className="card-text">{comment.description}</p>
                <p className="card-text"><small className="text-muted">Producto ID: {comment.product_id}</small></p>
                <button className="btn btn-danger" onClick={() => onDelete(comment.user_id, comment.id)}>Eliminar</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};