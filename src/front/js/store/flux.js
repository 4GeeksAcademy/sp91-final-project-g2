import { jwtDecode } from "jwt-decode";
import userForm from "../pages/User/userForm";
import { useNavigate } from "react-router-dom";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: sessionStorage.getItem("token") || "",
			exerciseOptions: {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
					'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
				}
			},
		},
		actions: {
			logOut: () => {
				sessionStorage.removeItem("token");
				setStore({ token: "" });
			},
			login: async (loginData) => {
				const response = await fetch(`${process.env.BACKEND_URL}/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(loginData)
				});
				if (!response.ok) {
					alert("Wrong user or password")
				}
				if (response.ok) {
					const data = await response.json()
					const decoded = jwtDecode(data.access_token);
					sessionStorage.setItem("token", data.access_token);
					setStore({ token: data.access_token, user_id: decoded.sub, role: decoded.role });
					return true;
				}
			},

			signUp: async (email, password) => {
				const response = await fetch(process.env.BACKEND_URL + "/signup", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(email, password)
				})
				if (!response.ok) {
					alert("Error al registrarse")
				}
				if (response.ok) {
					const data = await response.json()
					sessionStorage.setItem("token", data.access_token);
				}
			},

			postUserData: async (formData) => {
				const store = getStore()
				const response = await fetch(`${process.env.BACKEND_URL}/user_data`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: "Bearer " + store.token
					},
					body: JSON.stringify(formData),
				});

				if (response.ok) {

					const decoded = jwtDecode(store.token);
					setStore({ user_id: decoded.sub, role: decoded.role });
				} else {
					console.error('Error al enviar los datos');
				}
			}, catch(error) {
				console.error('Error de red:', error);
			}
		},

		fetchData: async (url, options) => {
			const response = await fetch(url, options);
			const data = await response.json();
			return data;
		},
	}
};


export default getState;
