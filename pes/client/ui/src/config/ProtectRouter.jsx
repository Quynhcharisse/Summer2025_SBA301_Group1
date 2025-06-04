import {Navigate, useNavigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {enqueueSnackbar} from "notistack";
import Cookies from 'js-cookie'
import {refreshToken} from "../services/JWTService.jsx";

const ProtectRouter = ({children, allowedRoles}) => {
    const navigate = useNavigate()
    const accessToken = Cookies.get('access');
    const checkToken = Cookies.get('check');

    if (!accessToken && !checkToken) {
        enqueueSnackbar("You are not authenticated", {variant: 'error'});
        return <Navigate to="/login"/>;
    }

    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (decoded && allowedRoles.includes(decoded.role)) { //decode = giai ma
            return children
        } else { // bắt TH phủ định của phủ định trường hợp đúng
            return null; // nếu ko có access, thì có refresh để refresh token lại
        }
    }
    refreshToken().then(res => {
        if (res.success) {
            window.location.reload(); // để reload lại trang ==> sinh ra refresh token
        } else {
            navigate('/login')
        }
    })
}
export default ProtectRouter