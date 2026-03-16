import axios from "axios";
import {router} from "@stf/lib/router";

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
            router.navigate('/auth/login');
        }
        if (error.response?.status === 403) {
            router.navigate('/dashboard');
        }
        return Promise.reject(error);
    }
);

export default api;