import React from "react";
import { LoginForm } from "../component/LoginForm.jsx";
import '../../styles/login.css'

export const Login = () => {
    return (
        <div className="container login-container my-5">
            <div className="row login-content">
                {/* Sección Izquierda */}
                <div className="col-12 col-md-6 left">
                    <h1>Bienvenido</h1>
                    <p>Glad to see you again! Please login with your details.</p>                    
                </div>

                {/* Sección Derecha */}
                <div className="col-12 col-md-6 right">
                    <h2>Iniciar sesión</h2>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}