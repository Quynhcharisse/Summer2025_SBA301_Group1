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

        if (!accessToken && !checkToken) {
            enqueueSnackbar("You are not authenticated", { variant: 'error' });
            navigate('/login');
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
                // ✅ Sau khi có token mới → kiểm tra lại
                await checkAuth();
            } else {
                navigate('/login');
            }
        } else {
            navigate('/login');
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