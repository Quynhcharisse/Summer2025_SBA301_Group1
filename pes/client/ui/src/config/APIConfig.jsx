import axios from "axios";
import {refreshToken} from "../services/JWTService.jsx";


axios.defaults.baseURL = "http://localhost:8080/api/v1"

const axiosClient = axios.create({
    baseURL: axios.defaults.baseURL,
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
            if (originalRequest.url === "/auth/refresh") {
                console.error("Refresh token request failed, redirecting to the login.");
                // Clear tokens and redirect to login
                document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                document.cookie = 'check=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                const refreshRes = await refreshToken();
                if (refreshRes.success) {
                    return axiosClient(originalRequest);
                } else {
                    // Clear tokens and redirect to login
                    document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                    document.cookie = 'check=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                    localStorage.clear();
                    window.location.href = "/login";
                }
            } catch (refreshError) {
                console.error("Refresh token request failed", refreshError);
                // Clear tokens and redirect to login
                document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                document.cookie = 'check=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
                localStorage.clear();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
)

export default axiosClient;
