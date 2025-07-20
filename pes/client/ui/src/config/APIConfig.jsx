import axios from "axios";
import {refreshToken} from "../services/JWTService.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const REFRESH_ENDPOINT = import.meta.env.VITE_REFRESH_ENDPOINT || "/auth/refresh";
const LOGIN_PAGE_URL = import.meta.env.VITE_LOGIN_PAGE_URL || "http://localhost:5173/login";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

axiosClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (originalRequest.url === REFRESH_ENDPOINT) {
                console.error("Refresh token request failed, redirecting to the login.");
                window.location.href = LOGIN_PAGE_URL;
                return Promise.reject(error);
            }

            try {
                const refreshRes = await refreshToken();
                if (refreshRes.success) {
                    return axiosClient(originalRequest);
                } else {
                    window.location.href = LOGIN_PAGE_URL;
                }
            } catch (refreshError) {
                console.error("Refresh token request failed", refreshError);
                window.location.href = LOGIN_PAGE_URL;
            }
        }
        return Promise.reject(error);
    }
)

export default axiosClient;
