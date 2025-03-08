const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            isLogged: false,
            users: [],
            products: [],
            comments: [],
            userRole: null,
            token: "",
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


            getProfile: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/profile', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                    });
                    if (!response.ok) throw new Error('Error al obtener el perfil');
                    const data = await response.json();
                    setStore({ profile: data });
                    return data;
                } catch (error) {
                    console.error('Error al obtener el perfil', error);
                    return null;
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
};

export default getState;
