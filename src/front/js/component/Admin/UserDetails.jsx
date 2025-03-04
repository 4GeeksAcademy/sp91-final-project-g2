import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const UserDetail = () =>{
    const {store, actions} = useContext(Context);
    const { id: paramId } = useParams ();
    const location = useLocation();
    const navigate = useNavigate ();
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        is_customer: false,
        is_vendor: false,
        is_active: true
    });
    const id = location.state?.id || paramId;

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
    }}, [store.isLogged, store.userRole, navigate]);

    useEffect(() =>{
        if(!id){
            navigate('(user-list');
            return;
        }
        const fetchUser = async () => {
            const userData = await actions.getUserById(id)
            if(userData){
                setUser(userData);
            }
        };
        fetchUser();
    }, [id, actions, navigate]);  

    const handleSubmit = async(event) =>{
        event.preventDefault();
        const success = await actions.updateUser(id, user);
        if(success){
            navigate('/user-list');
        }
    };

    const handleChange = async(event) =>{
        const { name, value, type, checked } = event.target;
        setUser({
            ...user,
            [name]: type === "checkbox" ? checked : value
        });
    };
    
    const handleDeactivate = async(event) =>{
        const success = await actions.deactivateUser(id);
        if (success) {
            navigate('/user-list');
        }
    };

    return(
        <div className="container mt-4">
            <h2>Detalles del Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre:</label>
                    <input type="text" name="first_name" value={user.first_name} onChange={handleChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido:</label>
                    <input type="text" name="last_name" value={user.last_name} onChange={handleChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono:</label>
                    <input type="text" name="phone" value={user.phone} onChange={handleChange} className="form-control" required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" name="address" value={user.address} onChange={handleChange} className="form-control" required/>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="is_customer" checked={user.is_customer} onChange={handleChange} className="form-check-input"/>
                    <label className="form-check-label">Es Cliente</label>
                </div>
                <div className="form-check">
                    <input type="checkbox" name="is_vendor" checked={user.is_vendor} onChange={handleChange} className="form-check-input"/>
                    <label className="form-check-label">Es Vendedor</label>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Guardar Cambios</button>
                <button type="button" className="btn btn-danger mt-3 ms-3" onClick={handleDeactivate}>Desactivar Usuario</button>
            </form>
        </div>        
    )
}