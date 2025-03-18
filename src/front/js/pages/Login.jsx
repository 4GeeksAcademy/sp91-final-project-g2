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
                    <h2>Accede a tu cuenta</h2>
                    <form className="login-form">
                        <input
                            type="email"
                            placeholder="Email"
                            className="form-input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            className="form-input"
                            required
                        />
                        <div className="remember-me">
                            <input type="checkbox" id="remember" className="checkbox-input" />
                            <label htmlFor="remember" className="checkbox-label">Recordarme</label>
                        </div>
                        <button type="submit" className="form-button">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    )
}