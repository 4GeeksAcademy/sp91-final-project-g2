const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem('access_token') || null,
        },
        actions: {
            syncTokenFromLocalStorage: () => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    setStore({ token });
                }
            },
            login: async (email, password) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });
                    if (!response.ok) throw new Error('Error logging in');
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access_token);
                    setStore({ token: data.access_token });
                    return { success: true, message: 'Inicio de sesión exitoso' };
                } catch (error) {
                    console.error('Error logging in', error);
                    return { success: false, message: error.message };
                }
            },
            signup: async (firstName, lastName, address, phone, email, password, role) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ firstName, lastName, address, phone, email, password, role }),
                    });
                    if (!response.ok) throw new Error('Error signing up');
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access_token);
                    setStore({ token: data.access_token });
                    return { success: true, message: 'Registro exitoso' };
                } catch (error) {
                    console.error('Error signing up', error);
                    return { success: false, message: error.message };
                }
            },
            getProfile: async () => {
                const store = getStore();
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/profile', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${store.token}`,
                        },
                    });
                    if (!response.ok) throw new Error('Error fetching profile');
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error fetching profile', error);
                    return null;
                }
            },
        }
    }
};

export default getState;