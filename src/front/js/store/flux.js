const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            token: localStorage.getItem('access_token') || null,
            profile: null,
            loading: false,
        },
        actions: {
            signup: async (firstName, lastName, address, phone, email, password, role) => {
                setStore({ loading: true });
                try {
                    const response = await fetch(process.env.BACKEND_URL + '/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ firstName, lastName, address, phone, email, password, role }),
                    });
                    if (!response.ok) throw new Error('Error en el registro');
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access_token);
                    setStore({ token: data.access_token, loading: false });
                    return { success: true, message: 'Registro exitoso' };
                } catch (error) {
                    console.error('Error en el registro', error);
                    setStore({ loading: false });
                    return { success: false, message: error.message };
                }
            },
            syncTokenFromLocalStorage: () => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    setStore({ token });
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
            // Otras acciones...
        }
    }
};

export default getState;