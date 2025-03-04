import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {store, actions} = useContext(Context)
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isLogged){
            if(store.userRole === 'is_admin'){
                navigate('/adminpage');
            } else if (store.userRole === 'is_vendor'){
                navigate('/pruebavendor');
            } else if (store.userRole === 'is_customer'){
                navigate('/pruebacustomer')
            }
        }
    }, [store.isLogged, store.userRole, navigate]);

    const handleSubmit = async (event) =>{
        event.preventDefault();
        const dataToSend = {
            email: email,
            password: password,
        };
        await actions.login(dataToSend);
        if(store.userRole === 'is_admin'){
            navigate('/pruebaadmin');
        } else if(store.userRole === 'is_vendor'){
            navigate('/pruebavendor');
        } else if(store.userRole === 'is_customer'){
            navigate('/pruebacustomer')
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Correo electrónico" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Recordarme</label>
            </div>
            <button type="submit">Iniciar sesión</button>
            <a href="/">¿Has olvidado tu contraseña?</a>
            <p>
                Al hacer clic en "Iniciar sesión", estás de acuerdo con los {" "}
                <a href="/">Términos de servicios</a> y la {" "}
                <a href="/">Política de privacidad</a>
            </p>
        </form>
    );
};