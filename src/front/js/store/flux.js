const getState = ({ getStore, getActions, setStore }) => {
<<<<<<< HEAD
	return {
		store: {
			message: null,
			isLogged: false,
			users: [],
			products: [],
			comments: [],
			currentProduct: {},
			userRole: null,
			token: typeof localStorage !== 'undefined' ? localStorage.getItem("token") || "" : ""
		},
		actions: {
			exampleFunction: () => {getActions().changeColor(0, "green");},
			getMessage: async () => {
				const uri = `${process.env.BACKEND_URL}/api/hello`
				const response = await fetch(uri)
				if (!response.ok) {
					// Gestionamos el error
					console.log("Error:", response.status, response.statusText)
					return
				}
				const data = await response.json()
				setStore({ message: data.message })
				return;
			},
			setIsLogged:(value) =>{setStore({isLogged: value})},
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method: 'POST',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(dataToSend)
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log('Error', response.status, response.statusText);
						return;
					}
			
					const data = await response.json();
					
					if (data.access_token) {
						localStorage.setItem('token', data.access_token);
					} else {
						console.error("No se recibió un token en la respuesta del servidor.");
					}
			
					const userRole = data.results.is_admin ? 'is_admin' :
									data.results.is_vendor ? 'is_vendor' :
									data.results.is_customer ? 'is_customer' : null;
			
					setStore({
						isLogged: true,
						user: data.results,
						userRole: userRole
					});
			
				} catch (error) {
					console.error("Error en el login:", error);
				}
			},
			getUsers: async() =>{
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/users`
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					}
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					console.log('Error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ users: data.results });			
			},
			getUserById: async(id) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/users/${id}`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization:`Bearer ${store.token}`
					}
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					console.log('Error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				return data.results;
			},
			updateUser: async (id, updateUser)	=> {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/users/${id}`
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					},
					body: JSON.stringify(updateUser)
				};
				try{
					const response = await fetch(uri, options);
					if (!response.ok){
						console.log('Error', response.status, response.statusText);
						return
					};
					const data = await response.json();
					console.log("Usuario actualizado", data);
					setStore({
						users: store.users.map(user => (user.id === id ? { ...user, ...updateUser} : user))
					});
					alert("Usuario actualizado correctamente");
				}catch (error){
					console.error("Error en updateUser:", error);
					alert("No se pudo actualizar el usuario");
					return false;
				}				
			},
			deactivateUser: async(id) =>{
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/users/${id}`;
				const options = {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Autorization: `Bearer ${store.token}`
					},
					body: JSON.stringify({ is_active: false })
				};
				try{
					const response = await fetch(uri, options);
					if(!response.ok) throw new Error("Error al desactivar al usuario");
					const data = await response.json();
					console.log("Usuario desactivado:", data);
					setStore({
						users: store.users.map(user => (user.id === id ? { ...user, is_active:false} : user))
					});
					alert("Usuario dado de baja correctamente");
					return true;
				}catch (error){
					console.error("Error en desactivar usuario:", error);
					alert("No se pudo desactivar el usuario");
					return false;
				}
			},			
			getProducts: async() =>{
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/products`
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					}
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					console.log('Eror', response.status, response.statusText);
					return
				}
				const data = await response.json()
				setStore({ products: data.results });				
			},
			getProductById: async (id) =>{
				const token = localStorage.getItem("token");
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization:`Bearer ${token}`
					}
				};
				try{
					const response = await fetch(uri, options);
					if(!response.ok){
						console.log('Error', response.status, response.statusText);
						return null;
					}
					const data = await response.json();
					setStore({currentProduct: data.results });
					return data;
				}catch(error){
					console.error("Error al obtener el producto:", error);
					return null;
				}
			},
			updateProduct: async(id, updateProduct) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
				const token = store.token;
			
				// Verificación del token
				if (!token) {
					alert("No se pudo obtener el token. Por favor, inicia sesión nuevamente.");
					return false;
				}
			
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(updateProduct)
				};
			
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						const errorResponse = await response.text();
						console.log('Error', response.status, response.statusText, errorResponse);
						return false;
					}
			
					const data = await response.json();
					console.log("Producto actualizado", data);
			
					// Actualización de estado en el store con el producto actualizado
					setStore({ products: store.products.map(product => product.id === id ? {...product, ...data} : product )});
					alert("Producto actualizado correctamente");
					return true;
				} catch (error) {
					console.error("Error en actualizar el producto:", error);
					alert("No se pudo actualizar el producto");
					return false;
				}
			},
			
			deactivateProduct: async(id) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					},
					body:JSON.stringify({ in_sell: false })
				};
				try{
					const response = await fetch(uri, options);
					if(!response.ok){
						throw new Error(`Error al desactivar el producto: ${response.status}`)
					}
					const data = await response.json();
					console.log("Producto desactivado", data);
					setStore({ products: store.products.map(product => product.id === id ? { ...product, in_sell:false } : product)
				});
				alert("Producto dado de baja correctamente");
				return true;
				}catch(error){
					console.error("Error en desactivar producto:", error);
					alert("No se pudo desactivar el producto");
					return false;
				}

			},
			getComments: async () => {
				const uri = `${process.env.BACKEND_URL}/api/comments`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
					}
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					console.log('Error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ comments: data.results});
			}
		}
	};
=======
    return {
        store: {
            message: null,
            isLogged: false,
            users: [],
            products: [],
            comments: [],
            userRole: null,
            token: typeof localStorage !== "undefined" ? localStorage.getItem("token") || "" : "",
            profile: null,
            loading: false
        },
        actions: {
            setIsLogged: (value) => setStore({ isLogged: value }),

            syncTokenFromLocalStorage: () => {
                const token = localStorage.getItem("token");
                if (token) setStore({ token });
            },

            login: async (dataToSend) => {
                const uri = `${process.env.BACKEND_URL}/api/login`;
                const options = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSend)
                };
                const response = await fetch(uri, options);
                if (!response.ok) return console.log("Error", response.status, response.statusText);
                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                const userRole = data.results.is_admin ? "is_admin" :
                    data.results.is_vendor ? "is_vendor" :
                        data.results.is_customer ? "is_customer" : null;
                setStore({ isLogged: true, user: data.results, userRole });
            },

            signup: async (firstName, lastName, address, phone, email, password, role) => {
                setStore({ loading: true });
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/signup`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ firstName, lastName, address, phone, email, password, role })
                    });
                    if (!response.ok) throw new Error("Error en el registro");
                    const data = await response.json();
                    localStorage.setItem("token", data.access_token);
                    setStore({ token: data.access_token, loading: false });
                    return { success: true, message: "Registro exitoso" };
                } catch (error) {
                    console.error("Error en el registro", error);
                    setStore({ loading: false });
                    return { success: false, message: error.message };
                }
            },

            getUsers: async () => {
                const store = getStore();
                const uri = `${process.env.BACKEND_URL}/api/users`;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${store.token}`
                    }
                };
                const response = await fetch(uri, options);
                if (!response.ok) return console.log("Error", response.status, response.statusText);
                const data = await response.json();
                setStore({ users: data.results });
            },

            getUserById: async (id) => {
                const uri = `${process.env.BACKEND_URL}/api/users/${id}`;
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                };
                const response = await fetch(uri, options);
                if (!response.ok) return console.log("Error", response.status, response.statusText);
                return (await response.json()).results;
            },

            updateUser: async (id, updateUser) => {
                const store = getStore();
                const uri = `${process.env.BACKEND_URL}/api/users/${id}`;
                const options = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${store.token}`
                    },
                    body: JSON.stringify(updateUser)
                };
                try {
                    const response = await fetch(uri, options);
                    if (!response.ok) return console.log("Error", response.status, response.statusText);
                    setStore({ users: store.users.map(user => (user.id === id ? { ...user, ...updateUser } : user)) });
                    alert("Usuario actualizado correctamente");
                } catch (error) {
                    console.error("Error en updateUser:", error);
                    alert("No se pudo actualizar el usuario");
                }
            },

            getProducts: async () => {
                const uri = `${process.env.BACKEND_URL}/api/products`;
                const response = await fetch(uri, { method: "GET", headers: { "Content-Type": "application/json" } });
                if (!response.ok) return console.log("Error", response.status, response.statusText);
                setStore({ products: (await response.json()).results });
            },

            getProductById: async (id) => {
                try {
                    const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
                    const response = await fetch(uri, { method: "GET", headers: { "Content-Type": "application/json" } });
                    if (!response.ok) throw new Error("Error obteniendo el producto");
                    return await response.json();
                } catch (error) {
                    console.error("Error en getProductById:", error);
                    return null;
                }
            },
            addToCart: (product) => {
                const store = getStore();
                setStore({ products: [...store.products, product] });
                console.log("Producto añadido al carrito:", product);
            },
            createProduct: async (productData) => {
                try {
                    const store = getStore();
                    const uri = `${process.env.BACKEND_URL}/api/products`;
                    const options = {
                        method: "POST",
                        headers: { Authorization: `Bearer ${store.token}` },
                        body: productData
                    };
                    const response = await fetch(uri, options);
                    if (!response.ok) throw new Error("Error al crear el producto");
                    setStore({ products: [...store.products, (await response.json()).results] });
                    alert("Producto creado con éxito");
                } catch (error) {
                    console.error("Error en createProduct:", error);
                    alert("No se pudo crear el producto");
                }
            },

            getMessage: async () => {
                try {
                    const uri = `${process.env.BACKEND_URL}/api/message`;
                    const response = await fetch(uri);
                    if (!response.ok) throw new Error("Error obteniendo el mensaje");
                    setStore({ message: (await response.json()).message });
                } catch (error) {
                    console.error("Error en getMessage:", error);
                }
            }
        }
    };
>>>>>>> develop
};

export default getState;
