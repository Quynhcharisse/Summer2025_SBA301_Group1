import {Navigate, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie'
import {refreshToken} from "../services/JWTService.jsx";
import {useEffect, useState} from "react";

const ProtectRoute = ({children, allowedRoles}) => {
    const navigate = useNavigate()
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = Cookies.get('access');
            const checkToken = Cookies.get('check');

            if (!accessToken && !checkToken) {
                enqueueSnackbar("You are not authenticated", {variant: 'error'});
                setIsChecking(false);
                return;
            }

            if (accessToken) {
                try {
                    const decoded = jwtDecode(accessToken);
                    if (decoded && allowedRoles.includes(decoded.role)) {
                        setIsAuthorized(true);
                    } else {
                        enqueueSnackbar("You don't have permission to access this page", {variant: 'error'});
                    }
                } catch (error) {
                    console.error("Token decode error:", error);
                    enqueueSnackbar("Invalid token", {variant: 'error'});
                }
                setIsChecking(false);
            } else {
                // Try to refresh token
                try {
                    const res = await refreshToken();
                    if (res.success) {
                        window.location.reload();
                    } else {
                        enqueueSnackbar("Session expired, please login again", {variant: 'error'});
                        navigate('/login');
                    }
                } catch (error) {
                    enqueueSnackbar("Authentication failed", {variant: 'error'});
                    navigate('/login');
                }
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [allowedRoles, navigate]);

    if (isChecking) {
        return <div>Loading...</div>; // Or a proper loading component
    }

    if (!isAuthorized) {
        return <Navigate to="/login"/>;
    }

    return children;
}
export default ProtectRoute