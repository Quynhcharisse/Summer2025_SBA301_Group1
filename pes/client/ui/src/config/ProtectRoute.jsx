import {Navigate, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie'
import {refreshToken} from "../services/JWTService.jsx";
import React, { useState, useEffect } from 'react';

const ProtectRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const accessToken = Cookies.get('access');
        const checkToken = Cookies.get('check');
        const LOGIN_URL = import.meta.env.VITE_LOGIN_PAGE_URL || "/login";

        if (!accessToken && !checkToken) {
            enqueueSnackbar("You are not authenticated", { variant: 'error' });
            navigate(LOGIN_URL);
            return;
        }

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                if (decoded && allowedRoles.includes(decoded.role)) {
                    setIsLoading(false);
                    return;
                }
                throw new Error('Unauthorized');
            } catch (error) {
                // Invalid token
            }
        }

        // Nếu đến đây, accessToken không hợp lệ
        if (checkToken) {
            const res = await refreshToken();
            if (res.success) {
                await checkAuth();
            } else {
                navigate(LOGIN_URL);
            }
        } else {
            navigate(LOGIN_URL);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
    }

    return children;
};
export default ProtectRoute