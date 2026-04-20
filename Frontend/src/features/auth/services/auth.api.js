import axios from "axios"

const apiBaseURL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:3000' : 'https://prepdost.onrender.com');


const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true
})

// Store token in localStorage for persistence
export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
    }
}

// Load token from localStorage on app init
export function loadAuthToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
}

// Call on load
loadAuthToken();

export async function register ({username , email, password}) {


    try{

        const response = await api.post('/api/auth/register', {
            username,
            email,
            password
        })
        return response.data ;
    }
    catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }

} 




export async function login ({email, password}) {

    try{
        const response = await api.post('/api/auth/login', {
            email,
            password
        })
        return response.data ;
    }
    catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}




export async function logout () {
    try{
        const response = await api.get('/api/auth/logout',)
        return response.data ;
    }
    catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }   
}


export async function getMe () {
    try{
        const response = await api.get('/api/auth/get-me')
        return response.data ;
    }
    catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}

export async function forgotPassword(email) {
    try {
        const response = await api.post('/api/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error);
        throw error;
    }
}

export async function resetPassword({ email, code, password }) {
    try {
        const response = await api.post('/api/auth/reset-password', { email, code, password });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}