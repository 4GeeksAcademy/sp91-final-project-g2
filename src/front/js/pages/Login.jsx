import React from "react";
import { LoginForm } from "../component/LoginForm.jsx";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import '../../styles/login.css'

export const Login = () => {
    return (
        <div className="login-container">
            <div className="overlay">
                <div className="login-content">
                    <div className="left">
                        <h1>Welcome Back</h1>
                        <p>Glad to see you again! Please login with your details.</p>
                        <div className="social-icons">
                            <div className="icon">
                                <FaFacebookF />
                            </div>
                            <div className="icon">
                                <FaX />
                            </div>
                            <div className="icon">
                                <FaInstagram />
                            </div>
                            <div className="icon">
                                <FaYoutube />
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h2>Iniciar sesión</h2>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    )
}