import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UserDetail } from "../../component/Admin/UserDetails.jsx";

export const UserDetailPage = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
        } else {
            const fetchUser = async () => {
                const data = await actions.getUserById(id);
                setUserData(data);
            };
            fetchUser();
        }
    }, [store.isLogged, store.userRole, navigate]);

    const handleChange = async (event) => {
        const { name, value, type, checked } = event.target;
        setUser({
            ...userData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await actions.updateUser(id, userData);
        if (success) {
            navigate('/user-list');
        }
    };
    
    const handleDeactivate = async () => {
        const success = await actions.deactivateUser(id);
        if (success) {
            navigate('/user-list');
        }
    };

    return (
        <div>
            <h1>Administración</h1>
            <h2>Detalles del Usuario</h2>
            <UserDetail user={userData} onChange={handleChange} onSubmit={handleSubmit} onDeactivate={handleDeactivate}/>
            <button className="btn btn-secondary" onClick={() => navigate('/adminpage')}>Regresar</button>
        </div>
    )
}