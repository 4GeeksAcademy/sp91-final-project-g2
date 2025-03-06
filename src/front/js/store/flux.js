const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogged: false,
			users: [],
			products: [],
			comments: [],
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
			login: async(dataToSend) =>{
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options ={
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body:JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if(!response.ok){
					console.log('Error', response.status, response.statusText);
					if(response.status == 401){
						console.log("User not found")
					}
					return;
				}
				const data = await response.json()
				localStorage.setItem('token', data.access_token)
				const userRole = data.results.is_admin ? 'is_admin':
								 data.results.is_vendor ? 'is_vendor':
								 data.results.is_customer ? 'is_customer': null;
				setStore({
					isLogged: true,
					user: data.results,
					userRole: userRole
				})
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
				const uri = `${process.env.BACKEND_URL}/api/products`
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json"
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
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
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
					return;
				}
				const data = await response.json();
				return data.results
			},
			updateProduct: async(id, updateProduct) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
				const options = {
					headers: {
						method: 'PUT',
						Authorization: `Bearer ${store.token}`
					},
					body: JSON.stringify(updateProduct)
				}
				try{
					const response = await fetch(uri, options);
					if(!response.ok){
						console.log('Error', response.status, response.statusText);
						return false;
					}
					const data = await response.json();
					console.log("Producto actualizado", data);
					setStore({ products: store.products.map(product => product.id === id ?  {...product, ...productData} : product )});
					alert ("Producto actualizado correctamente")
					return true;
				}catch(error){
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
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
