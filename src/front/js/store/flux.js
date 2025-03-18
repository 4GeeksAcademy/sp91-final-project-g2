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
			loading: false,
			cart: [],
			orderitems: [],
			orders: [],
			favorites: [],
			userComments: [],
			tokenExpiry: null
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
				if (!response.ok) {
					console.log("Error", response.status, response.statusText);
					return false;
				}
				const data = await response.json();
				const token = data.access_token;
				const tokenTime = new Date().getTime() + 300000;
				const userRole = data.results.is_admin ? "is_admin" :
					data.results.is_vendor ? "is_vendor" :
						"is_customer"
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(data.results));
				localStorage.setItem("userRole", userRole);
				localStorage.setItem("tokenExpiry", tokenTime);
				setStore({
					isLogged: true,
					user: data.results,
					userRole,
					token,
					tokenExpiry: tokenTime
				});

				return true;
			},
			logout: () => {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				localStorage.removeItem("userRole");
				localStorage.removeItem("tokenExpiry");
				setStore({
					isLogged: false,
					user: {},
					users: [],
					currentProduct: {},
					userRole: null,
					token: "",
					loading: false,
					favorites: [],
					userComments: [],
					tokenExpiry: null,
					cart: [],
					orderitems: [],
					orders: [],
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
						Authorization: `Bearer ${store.token}`
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
				const user = JSON.parse(localStorage.getItem("user"))
				const userRole = localStorage.getItem("userRole");
				const tokenExpiry = localStorage.getItem("tokenExpiry");
				if (token && user && userRole && tokenExpiry) {
					if (new Date().getTime() < tokenExpiry) {
						setStore({
							isLogged: true,
							user,
							userRole,
							token,
							tokenExpiry
						});
					} else {
						localStorage.removeItem("token");
						localStorage.removeItem("user");
						localStorage.removeItem("userRole");
						localStorage.removeItem("tokenExpiry")
						setStore({
							isLogged: false,
							user: {},
							userRole: null,
							token: "",
							tokenExpiry: null
						});
					}
				}
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
			addToCart: async (product) => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.error("No hay token, el usuario debe estar autenticado.");
					return;
				}
				const alreadyInCart = store.cart.find(item => item.id === product.id);
				if (alreadyInCart) {
					alert("Este producto ya está en el carrito");
					return;
				}
				setStore({ cart: [...store.cart, product] });
				console.log("Producto agregado al carrito local", product);
			},
			removeFromCart: async (productId) => {
				const store = getStore();
				const updatedCart = store.cart.filter(item => item.id !== productId);
				setStore({ cart: updatedCart });
				console.log("Producto eliminado del carrito local, id:", productId);
			},
			checkoutCart: async () => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.error("No hay token, no se puede proceder al checkout.");
					return false;
				}
				if (store.cart.length === 0) {
					alert("No hay productos en el carrito.");
					return false;
				}
				let total = 0;
				store.cart.forEach(p => {
					total += p.price; // si tu items no tienen quantity, asume price
				});
				const orderData = {
					status: "pendiente",
					address: store.user.address || "",
					total_price: total
				};
				const createOrderResp = await getActions().createOrder(orderData);
				if (!createOrderResp) {
					alert("Error creando la orden");
					return false;
				}
				setStore({ cart: [] });
				alert("Compra completada");
				return true;
			},
			clearCart: () => {
				setStore({ cart: [] });
				alert("El carrito ha sido vaciado.");
			},
			getOrderItems: async () => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.log("No hay token, no se puede obtener orderitems");
					return;
				}
				try {
					const uri = `${process.env.BACKEND_URL}/api/orderitems`;
					const options = {
						method: 'GET',
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						}
					};
					const resp = await fetch(uri, options);
					if (!resp.ok) {
						console.log("Error", resp.status, resp.statusText);
						return;
					}
					const data = await resp.json();
					setStore({ orderitems: data.results });
				} catch (error) {
					console.error("Error en getOrderItems:", error);
				}
			},
			createOrder: async (orderData) => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.error("No hay token disponible");
					return false;
				}
				try {
					const uri = `${process.env.BACKEND_URL}/api/orders`;
					const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(orderData)
					};
					const resp = await fetch(uri, options);
					if (!resp.ok) {
						console.error("Error al crear la orden:", resp.statusText);
						return false;
					}
					const data = await resp.json();
					console.log("Orden creada (pendiente):", data);

					await getActions().getOrders();
					return true;  // podrías retornar data.order_id para saber el id
				} catch (error) {
					console.error("Error en createOrder:", error);
					return false;
				}
			},
			getOrders: async () => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.log("No hay token, no se puede obtener órdenes");
					return;
				}
				try {
					const uri = `${process.env.BACKEND_URL}/api/orders`;
					const options = {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						}
					};
					const resp = await fetch(uri, options);
					if (!resp.ok) {
						console.error("Error la orden:", resp.status, resp.statusText);
						return;
					}
					const data = await resp.json();
					setStore({ orders: data.results || [] });
					console.log("Órdenes obtenidas:", data.results);
				} catch (error) {
					console.error("Error:", error);
				}
			},
			updateOrder: async (orderId, dataToUpdate) => {
				const store = getStore();
				if (!store.token) {
					console.error("No token");
					return false;
				}
				try {
					const uri = `${process.env.BACKEND_URL}/api/orders/${orderId}`;
					const options = {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store.token}`
						},
						body: JSON.stringify(dataToUpdate)
					};
					const resp = await fetch(uri, options);
					if (!resp.ok) {
						console.error("Error en updateOrder:", resp.statusText);
						return false;
					}
					console.log("Orden actualizada (ej. a 'vendido').");
					await getActions().getOrders();
					return true;
				} catch (error) {
					console.error("updateOrder error:", error);
					return false;
				}
			},
			createOrderItem: async (itemData) => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.error("No token");
					return false;
				}
				try {
					const resp = await fetch(`${process.env.BACKEND_URL}/api/orderitems`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`
						},
						body: JSON.stringify(itemData)
					});
					if (!resp.ok) {
						console.error("Error en createOrderItem:", resp.statusText);
						return false;
					}
					// refrescamos las órdenes
					await getActions().getOrders();
					return true;
				} catch (error) {
					console.error("createOrderItem error:", error);
					return false;
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
			clearUserComments: () => setStore({ userComments: [] }),
			createOrderFromFavorites: async (orderData) => {
				const store = getStore();
				const uri = `${process.env.BACKEND_URL}/api/orders`;
				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store.token}`
					},
					body: JSON.stringify(orderData)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.error("Error al crear la orden:", response.statusText)
					return
				}
				const createdOrder = await response.json();
				setStore({
					orders: [...store.orders, createdOrder.results],
					favorites: []
				});
			}
		}
	}
};
export default getState;
