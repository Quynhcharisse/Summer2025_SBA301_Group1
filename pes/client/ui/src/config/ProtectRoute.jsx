import {Navigate, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie'
import {refreshToken} from "../services/JWTService.jsx";
import React, { useState, useEffect } from 'react';

const ProtectRoute = ({children, allowedRoles}) => {
    const navigate = useNavigate();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = Cookies.get('access');
            const checkToken = Cookies.get('check');

            if (!accessToken && !checkToken) {
                enqueueSnackbar("You are not authenticated", {variant: 'error'});
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
                    if (!isRefreshing && checkToken) {
                        setIsRefreshing(true);
                        try {
                            const res = await refreshToken();
                            if (res.success) {
                                window.location.reload();
                            } else {
                                navigate('/login');
                            }
                        } catch (error) {
                            console.error('Error refreshing token:', error);
                            navigate('/login');
                        } finally {
                            setIsRefreshing(false);
                        }
                    } else {
                        navigate('/login');
                    }
                }
            }
        };

        checkAuth();
    }, [navigate, allowedRoles, isRefreshing]);

    if (isLoading) {
        return null;
    }

    return children;
}
export default ProtectRoute