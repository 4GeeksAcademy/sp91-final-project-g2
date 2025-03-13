import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductForm = () => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        photo: null, // Cambiado a null para manejar archivos
    });

    const handleChange = (e) => {
        if (e.target.name === "photo") {
            setFormData({ ...formData, photo: e.target.files[0] }); // Almacena el archivo
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = formData;
        data.photo = "url de la foto"
        console.log(data);
/*         data.append("name", formData.name);
/*         data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("price", formData.price);
        if (formData.photo) {
            data.append("photo", formData.photo);
        } */
        await actions.createProduct(data);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card glassmorphism p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
                <h2 className="text-center text-brown">Crear Producto</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-3">
                        <label className="form-label">Nombre:</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Categoría:</label>
                        <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descripción:</label>
                        <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Precio:</label>
                        <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Foto (Adjuntar archivo):</label>
                        <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-brown w-100">Publicar</button>
                </form>
            </div>

            <style>{`
                .glassmorphism {
                    background: rgba(196, 164, 132, 0.6);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .text-brown {
                    color: #5C4033;
                }
                .btn-brown {
                    background-color: #5C4033;
                    color: white;
                    font-weight: bold;
                    border-radius: 8px;
                    transition: 0.3s;
                }
                .btn-brown:hover {
                    background-color: #D2B48C;
                    color: #5C4033;
                }
            `}</style>
        </div>
    );
};

export default ProductForm;
