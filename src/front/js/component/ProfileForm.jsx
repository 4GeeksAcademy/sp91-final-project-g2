import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import LoadingSpinner from './LoadingSpinner.jsx';
import '../../styles/profileform.css';

export const ProfileForm = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({});

    useEffect(() => {
        if (!store.user || !store.user.id) {
            navigate('/login');
        } else {
            (async () => {
                const data = await actions.getUserById(store.user.id);
                if (data) setProfile(data);
            })();
        }
    }, [store.user, actions, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.updateUser(store.user.id, {
            first_name: profile.first_name,
            last_name: profile.last_name,
            address: profile.address,
            phone: profile.phone,
            is_active: profile.is_active
        });;
        if (success !== false) {
            console.log("Perfil actualizado correctamente");
            navigate("/profilepage");
        } else {
            console.error('Error al actualizar el perfil');
        }
    };
    if (store.loading) {
        return <LoadingSpinner />;
    }

    
    return (
        <div className="container my-4">
            <h2>Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>First Name</label>
                    <input className="form-control" name="first_name" value={profile.first_name || ""} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label>Last Name</label>
                    <input className="form-control" name="last_name" value={profile.last_name || ""} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label>Address</label>
                    <input className="form-control" name="address" value={profile.address || ""} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label>Phone</label>
                    <input className="form-control" name="phone" value={profile.phone || ""} onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/profilepage")}>Cancelar</button>
            </form>
        </div>
    );
};

