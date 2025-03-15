import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isLogged) {
            switch (store.userRole) {
                case 'is_admin':
                    navigate('/adminpage');
                    break;
                case 'is_vendor':
                    navigate('/profilepage');
                    break;
                case 'is_customer':
                    navigate('/profilepage');
                    break;
                default:
                    console.error("Rol de usuario no reconocido.");
            }
        }
    }, [store.isLogged, store.userRole, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            email: email,
            password: password,
        };
        const success = await actions.login(dataToSend);
        if (success) {
            if (store.userRole === 'is_admin') {
                navigate('/adminPage');
            } else if (store.userRole === 'is_vendor') {
                navigate('/product-form');
            } else if (store.userRole === 'is_customer') {
                navigate('/product-cards')
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Correo electrónico" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Recordarme</label>
            </div>
            <button type="submit">Iniciar sesión</button>                       
        </form>
    );
};