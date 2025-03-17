import React from "react";

export const Error404 = () => {
  return (
    <div 
      className="container d-flex flex-column align-items-center justify-content-center my-5" 
      style={{ minHeight: "50vh" }}>
      <h1 className="text-center mb-4">Oops!</h1>
      <p className="text-center mb-4">La página que buscas no existe o no se pudo encontrar.</p>

      <img src="https://img.freepik.com/premium-vector/404-error-design-with-coffee_23-2147734760.jpg?w=826"
        alt="404 Error Coffee"
        style={{ maxWidth: "450px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "8px" }}/>
    </div>
  );
};