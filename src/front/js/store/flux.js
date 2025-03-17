const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			isLogged: false,
			users: [],
			user: {},
			orderId: null,
			products: [],
			comments: [],
			currentProduct: {},
			userRole: null,
			token: "",
			profile: null,
			loading: false,
			cart: [], // 🛒 Nuevo estado para el carrito
			orderitems: [],
			orders: [],
			favorites: [],
			userComments: [],
		},
		actions: {
			signup: async (firstName, lastName, address, phone, email, password, role) => {
				setStore({ loading: true });
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/signup`;
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ firstName, lastName, address, phone, email, password, role }),
				};
				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error('Error in signup');
					const data = await response.json();
					localStorage.setItem('access_token', data.access_token);
					setStore({ token: data.access_token, loading: false });
					return { success: true, message: 'Register success' };
				} catch (error) {
					console.error('Error en el registro', error);
					setStore({ loading: false });
					return { success: false, message: error.message };
				}
			},
			exampleFunction: () => { getActions().changeColor(0, "green"); },
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
			setIsLogged: (value) => { setStore({ isLogged: value }) },
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
				setStore({
					isLogged: true,
					user: data.results,
					userRole,
					token: localStorage.getItem("token")
				});
			},
			logout: () => {
				localStorage.removeItem("token");
				setStore({
					isLogged: false,
					user: {},
					users: [],
					currentProduct: {},
					userRole: null,
					token: "",
					profile: null,
					loading: false,
					favorites: [],
					userComments: []
				})

			},
			getUsers: async () => {
				const uri = `${process.env.BACKEND_URL}/api/users`
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				};
				console.log(options);
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ users: data.results });
			},
			getUserById: async (id) => {
				const uri = `${process.env.BACKEND_URL}/api/users/${id}`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				return data.results;
			},
			updateUser: async (id, updateUser) => {
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
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log('Error', response.status, response.statusText);
						return
					};
					const data = await response.json();
					console.log("Usuario actualizado", data);
					setStore({
						users: store.users.map(user => (user.id === id ? { ...user, ...updateUser } : user))
					});
					alert("Usuario actualizado correctamente");
				} catch (error) {
					console.error("Error en updateUser:", error);
					alert("No se pudo actualizar el usuario");
					return false;
				}
			},
			deactivateUser: async (id) => {
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
				try {
					const response = await fetch(uri, options);
					if (!response.ok) throw new Error("Error al desactivar al usuario");
					const data = await response.json();
					console.log("Usuario desactivado:", data);
					setStore({
						users: store.users.map(user => (user.id === id ? { ...user, is_active: false } : user))
					});
					alert("Usuario dado de baja correctamente");
					return true;
				} catch (error) {
					console.error("Error en desactivar usuario:", error);
					alert("No se pudo desactivar el usuario");
					return false;
				}
			},
			getProducts: async () => {
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
				if (!response.ok) {
					console.log('Eror', response.status, response.statusText);
					return
				}
				const data = await response.json()
				setStore({ products: data.results });
			},
			getProductById: async (id) => {
				const token = localStorage.getItem("token");
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				};
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log('Error', response.status, response.statusText);
						return null;
					}
					const data = await response.json();
					setStore({ currentProduct: data.results });
					return data;
				} catch (error) {
					console.error("Error al obtener el producto:", error);
					return null;
				}
			},
			updateProduct: async (id, updateProduct) => {
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
					setStore({ products: store.products.map(product => product.id === id ? { ...product, ...data.results } : product) });
					alert("Producto actualizado correctamente");
					return true;
				} catch (error) {
					console.error("Error en actualizar el producto:", error);
					alert("No se pudo actualizar el producto");
					return false;
				}
			},
			deactivateProduct: async (id) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/products/${id}`;
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					},
					body: JSON.stringify({ in_sell: false })
				};
				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						throw new Error(`Error al desactivar el producto: ${response.status}`)
					}
					const data = await response.json();
					console.log("Producto desactivado", data);
					setStore({
						products: store.products.map(product => product.id === id ? { ...product, in_sell: false } : product)
					});
					alert("Producto dado de baja correctamente");
					return true;
				} catch (error) {
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
				if (!response.ok) {
					console.log('Error', response.status, response.statusText);
					return
				}
				const data = await response.json();
				setStore({ comments: data });
			},
			syncTokenFromLocalStorage: () => {
				const token = localStorage.getItem("token");
				if (token) setStore({ token });
			},
			createProduct: async (productData) => {
				try {
					const store = getStore();
					// enviar el archivo a cloudinary y que cloudinary me devuelva una url
					// envio productData.photo
					// con lo que me devuelve el back reemplaazo el productData.photo por el string de la url
					const uri = `${process.env.BACKEND_URL}/api/vendors/${store.user.id}/products`;
					const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store.token}`
						},
						body: JSON.stringify(productData)
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
			getProfile: async () => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/profile`, {
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
			addToCart: async (product) => {
				const store = getStore();
				const token = store.token;

				if (!token) {
					console.error("No hay token, el usuario debe estar autenticado.");
					return;
				}

				try {
					const dataToSend = {
						product_id: product.id,
						order_id: store.orderId,
						address: store.user.address
					}
					const uri = process.env.BACKEND_URL + `/api/orderitems`
					const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(dataToSend)
					}
					console.log(dataToSend);
					console.log(uri);
					console.log(options);


					const response = await fetch(uri, options)
					if (!response.ok) {
						console.error("Error al añadir producto a la orden:", response.status, response.statusText);
						return;
					}

					const addedItem = await response.json();
					console.log("Producto añadido correctamente a la orden:", addedItem);

					// Actualizar el estado del carrito en el frontend
					setStore({ cart: [...store.cart, { ...product, quantity: 1 }] });
					// setStore({ products: [...store.products, product] });
				} catch (error) {
					console.error("Error en addToCart:", error);
				}
			},
			removeOrderItem: async (itemId) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/orderitems/${itemId}`;

				const options = {
					method: 'DELETE',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					}
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log('Error al eliminar', response.status, response.statusText);
						return;
					}

					// Actualizar la orden eliminando el producto
					setStore({
						orderitems: store.orderitems.filter(item => item.id !== itemId)
					});

				} catch (error) {
					console.error("Error en removeOrderItem:", error);
				}
			},
			getOrderItems: async () => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/orderitems`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					}
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log('Error', response.status, response.statusText);
						return;
					}

					const data = await response.json();

					// Mapear los orderitems para añadir la información completa del producto
					const orderItemsWithProductInfo = data.results.map(orderItem => {
						const product = Array.isArray(store.products)
							? store.products.find(p => p.id === orderItem.product_id)
							: null;

						return {
							...orderItem,
							name: product ? product.name : "Producto desconocido",
							price: product ? product.price : 0,
							image: product ? product.image : "https://via.placeholder.com/100"
						};
					});


					setStore({ orderitems: orderItemsWithProductInfo });

				} catch (error) {
					console.error("Error en getOrderItems:", error);
				}
			},
			createOrder: async () => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/orders`
				// Verificar si hay productos en la orden antes de enviarla
				if (!store.orderitems || store.orderitems.length === 0) {
					console.warn("No hay productos en la orden para procesar.");
					return false;
				}

				console.log(store.orderitems);


				const orderData = {
					items: store.orderitems.map(product => ({
						product_id: product.id,
						price: product.price
					}))
				};

				console.log(orderData)

				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					},
					body: JSON.stringify(orderData)
				};

				try {
					const response = await fetch(uri, options);

					if (!response.ok) {
						console.error(`Error al crear la orden: ${response.status} ${response.statusText}`);
						return false;
					}

					const data = await response.json();

					// Limpiar la orden solo si la creación fue exitosa
					setStore({ orderitems: [] });

					console.log("Orden creada exitosamente:", data);
					return true;
				} catch (error) {
					console.error("Error en createOrder:", error);
					return false;
				}
			},
			getOrders: async () => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/orders`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					}
				};

				try {
					const response = await fetch(uri, options);
					if (!response.ok) {
						console.log('Error', response.status, response.statusText);
						return;
					}

					const data = await response.json();

					setStore({ orders: data.results }); // Guardamos las órdenes en el estado global
				} catch (error) {
					console.error("Error en getOrders:", error);
				}
			},	
			getFavorites: async () => {
				const token = localStorage.getItem("token");
				const uri = `${process.env.BACKEND_URL}/api/favorites`;
				const options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("Error al obtener los favoritos:", response.status, response.statusText);
					return;
				}
				const data = await response.json();
				console.log("Datos recibidos en getFavorites:", data);
				setStore({ favorites: data.results });
			},
			addFavorite: async (productId) => {
				const token = localStorage.getItem("token");
				if (!token) {
					console.log("No hay token disponible");
					return;
				}
				const uri = `${process.env.BACKEND_URL}/api/favorites`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify({ product_id: productId })
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("Error al agregar favorito:", response.status, response.statusText);
					return;
				}
				const data = await response.json();
				const currentFavorites = getStore().favorites;
				setStore({ favorites: [...currentFavorites, data.results ? data.results : data] });
				alert("Producto añadido a favoritos");
			},
			deleteFavorite: async (favoriteId) => {
				const token = localStorage.getItem("token");
				if (!token) {
					console.log("No hay token disponible");
					return false;
				}
				const uri = `${process.env.BACKEND_URL}/api/favorites/${favoriteId}`;
				const options = {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("Error al eliminar favorito:", response.status, response.statusText);
					return false;
				}
				const currentFavorites = getStore().favorites;
				setStore({ favorites: currentFavorites.filter(fav => fav.favorite_id !== favoriteId) });
				alert("Favorito eliminado");
				return true;
			},
			getUserComments: async (user_id) => {
				const token = localStorage.getItem("token")
				if (!token) {
					console.log("No hay token disponible");
					return false;
				}
				const uri = `${process.env.BACKEND_URL}/api/users/${user_id}/comments`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log("Error:", response.status, response.statusText);
					return false;
				}
				const data = await response.json();
				const comments = data.results ? data.results : data;
				setStore({ userComments: comments });
			},
			deleteCommentAsAdmin: async (userId, commentId) => {
				const token = localStorage.getItem("token");
				const uri = `${process.env.BACKEND_URL}/users/${userId}/comments/${commentId}`;
				const options = {
					method: "DELETE",
					headers: {
						"Authorization": `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options);
				const data = await response.json();
				if (!response.ok) {
					console.log("Error al eliminar comentario:", data.message);
					return false;
				}
				const updatedComments = getStore().userComments.filter(comment => comment.id !== commentId);
				setStore({ userComments: updatedComments });

				console.log("Comentario eliminado correctamente");
				return true;
			},
			addAllFavoritesToCart: async () => {
				const store = getStore();
				if (store.favorites.length === 0) {
					alert("No hay productos favoritos para añadir al carrito")
					return;
				}
				const udpdateCart = [...store.products, ...store.favorites.map(fav => fav.product)];
				setStore({ products: udpdateCart });
				alert("Todos los productos favoritos han sido incluidos al carrito")
			},
			clearUserComments: () => setStore({ userComments: [] })
		}
	}
};
export default getState;
