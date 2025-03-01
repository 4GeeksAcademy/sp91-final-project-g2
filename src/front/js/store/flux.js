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
                } catch (error) {
                    console.error('Error signing up', error);
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
                } catch (error) {
                    console.error('Error logging in', error);
                }
            },
            logout: () => {
                localStorage.removeItem('access_token');
                setStore({ token: null });
            },
        },
    };
};

export default getState;

// Revisar este gist para más detalles sobre la sintaxis dentro del archivo flux.js
// https://gist.github.com/hchocobar/25a43adda3a66130dc2cb2fed8b212d0
