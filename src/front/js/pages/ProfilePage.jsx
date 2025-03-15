import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/profilepage.css';

export const ProfilePage = () => {
    const { store, actions } = useContext(Context);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener los datos del perfil del usuario
        if (!store.user || !store.user.id) {
            alert("No hay usuario en logueado")
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            const data = await actions.getUserById(store.user.id);
            if (data) {
                setProfile(data);
            }
        }
        fetchProfile();
    }, [store.user, actions, navigate]);

    const isVendor = profile.is_vendor === true;
    const isCustomer = profile.is_customer === true;

    const vendorOptions = [
        { title: "Publicar Productos", description: "Crear nuevas publicaciones", onClick: () => navigate("/") },
        { title: "Ventas realizadas", description: "Revisar tus ventas", onClick: () => navigate("/") },
        { title: "Listado de Productos", description: "Ver todos tus productos", onClick: () => navigate("/") },
        { title: "Comentarios recibidos", description: "Ver comentarios de tus clientes", onClick: () => navigate("/") },
    ];

    const customerOptions = [
        { title: "Compras realizadas", description: "Historial de tus pedidos", onClick: () => navigate("/") },
        { title: "Comentarios", description: "Tus comentarios en productos", onClick: () => navigate("/") },
        { title: "Carrito de compra", description: "Revisar tus artículos", onClick: () => navigate("/") },
        { title: "Favoritos", description: "Lista de productos favoritos", onClick: () => navigate("/") },
    ];

    const handleEditProfile = () => {
        navigate("/profileform");
    };

    return (
        <div className="profile-page container">
            <h2 className="mb-4">Mi cuenta</h2>

            {/* Datos básicos del perfil */}
            <div className="d-flex align-items-center mb-4">
                <img src="https://www.fundaciomaresme.cat/wp-content/uploads/2019/11/imagen-de-prueba-320x240.jpg" alt="Profile" className="rounded-circle me-3" />
                <div>
                    <h5>{profile.first_name} {profile.last_name}</h5>
                    <p>{profile.email}</p>
                    <button className="btn btn-primary" onClick={handleEditProfile}>Editar Perfil</button>
                </div>
            </div>

            {/* Opciones según sea vendor o customer */}
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {isVendor && vendorOptions.map((opt, idx) => (
                    <div key={idx} className="col">
                        <div className="card h-100" onClick={opt.onClick} style={{ cursor: "pointer" }}>
                            <div className="card-body">
                                <h5 className="card-title">{opt.title}</h5>
                                <p className="card-text">{opt.description}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {isCustomer && customerOptions.map((opt, idx) => (
                    <div key={idx} className="col">
                        <div className="card h-100" onClick={opt.onClick} style={{ cursor: "pointer" }}>
                            <div className="card-body">
                                <h5 className="card-title">{opt.title}</h5>
                                <p className="card-text">{opt.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

