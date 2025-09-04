import axios from 'axios';

// http://localhost:8000
// Create axios instance with base URL

// const baseURL = 'https://13.53.164.183';
const baseURL = 'https://api.mypathfinder.uk';
const stripe_pub_key = "pk_test_51S2X9nLXAyXMSXYptjL5LpP0NOg3aEMj7wWJf2ERqW1kFRPbBw4sxOAjEZhTiy4tuWrLrrEa4hvtGGaAsO4T4Ov700TPQ8wqTZ"

// const baseURL = 'https://deepskyblue-donkey-692108.hostingersite.com';
// const baseURL = 'http://localhost:8000';

const instance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

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

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
        }
        return Promise.reject(error);
    }
);

export const baseUrl = baseURL;
export const stripe_public_key = stripe_pub_key;

export default instance;
