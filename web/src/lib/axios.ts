import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    }
);

//Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;