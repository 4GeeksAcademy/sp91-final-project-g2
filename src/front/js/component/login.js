import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";
import { Link, useHistory } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import logo from "../../img/logo.jpeg";
import "../../styles/registerNew.scss";
import Swal from "sweetalert2";

export const Login = () => {
	const { actions, store } = useContext(Context);
	const history = useHistory();
	const [user, setUser] = useState({
		username: "",
		password: "",
		usertype: null
	});

	const logInSuccess = () => {
		Swal.fire({
			icon: "success",
			title: "Ingreso exitoso",
			text: "Cargando Catalogo",
			showConfirmButton: false,
			timer: 1500
		});

		store.isSeller === 1 ? history.push("/newProduct") : history.push("/logueado");
	};

	const handleChange = e => {
		setUser({
			...user,
			// Trimming any whitespace
			[e.target.name]: e.target.value.trim()
		});
	};

	const handleSubmit = e => {
		e.preventDefault();
		// ... submit to API or something
		user.usertype = store.isSeller;
		actions.userLogIn(user);
		logInSuccess();
	};
	return (
		<div className="container my-4">
			<section>
				<div className="wrap-login100 p-l-55 p-r-55 p-t-35 p-b-54 mx-auto d-block">
					<form onSubmit={handleChange} className="login100-form">
						<span className="login100-form-title p-b-30">
							{store.isSeller === 1 ? "Iniciar sesión Vendedor" : "Iniciar sesión Comprador"}{" "}
						</span>
						<div className="wrap-input100  m-b-23">
							<span className="label-input100 fas fa-envelope"> Usuario</span>
							<input
								className="input100"
								type="text"
								name="username"
								placeholder="Ingrese su usuario"
								onChange={handleChange}
							/>
							<span className="focus-input100" />
						</div>
						<div className="wrap-input100  m-b-23">
							<span className="label-input100 fas fa-envelope"> Contraseña</span>
							<input
								className="input100"
								type="text"
								name="password"
								placeholder="Ingrese su Contraseña"
								onChange={handleChange}
							/>
							<span className="focus-input100" />
						</div>
						<div className="container-login100-form-btn">
							<div className="wrap-login100-form-btn">
								<div className="login100-form-bgbtn" />
								<button type="submit" onClick={handleSubmit} className="login100-form-btn">
									Ingresar
								</button>
							</div>
						</div>
						<div className="text-right p-t-8 p-b-31">
							<Link to="/recoverLogIn">
								<a>Olvido su contraseña?</a>
							</Link>
						</div>
						{/* <div className="flex-c-m">
							<a href="#" className="login100-social-item bg1">
								<i className="fa fa-facebook" />
							</a>

							<a href="#" className="login100-social-item bg3">
								<i className="fa fa-google" />
							</a>
						</div> */}
					</form>
				</div>
			</section>
		</div>
	);
};
