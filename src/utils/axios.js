import axios from 'axios';

// http://localhost:8000
// https://deepskyblue-donkey-692108.hostingersite.com
// Create axios instance with base URL
const instance = axios.create({
    baseURL: 'https://deepskyblue-donkey-692108.hostingersite.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to add auth token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('access_token');
            // window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
    }
);

export default instance;
