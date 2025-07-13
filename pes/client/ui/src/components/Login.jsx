import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    Link,
    Paper
} from "@mui/material";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {login, logout} from "../services/AuthService.jsx";
import {useNavigate} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: new URLSearchParams(window.location.search).get('email') || '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const isRedirectedFromAuth = new URLSearchParams(window.location.search).get('redirect') === 'auth';

    if (!isRedirectedFromAuth && localStorage.length > 0) {
        localStorage.clear()
    }

    useEffect(() => {
        if (!isRedirectedFromAuth) {
            async function signOut(){
                return await logout();
            }

            signOut().then(res => {
                console.log(res);
            });
        }

        // Highlight email field if it's pre-filled from registration
        const emailFromURL = new URLSearchParams(window.location.search).get('email');
        if (emailFromURL) {
            const emailInput = document.querySelector('input[name="email"]');
            if (emailInput) {
                emailInput.select();
            }
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form.email, form.password);
            if (res && res.success) {
                const userAcc = {
                    user: {
                        name: res.data.name,
                        email: res.data.email,
                    }
                }
                localStorage.setItem('user', JSON.stringify(userAcc));
                const accessToken = Cookies.get('access');
                if (accessToken) {
                    const decode = jwtDecode(accessToken);
                    const role = decode.role;

                    enqueueSnackbar(res.message, {
                        variant: 'success',
                        onClose: () => {
                            switch (role) {
                                case 'ADMISSION':
                                    window.location.href = "/admission/process/form";
                                    break;
                                case 'PARENT':
                                    window.location.href = "/parent/profile";
                                    break;
                                case 'EDUCATION':
                                    window.location.href = "/education";
                                    break;
                                case 'HR':
                                    window.location.href = "/hr";
                                    break;
                                default:
                                    window.location.href = "/login";
                            }
                        },
                        autoHideDuration: 800
                    });
                }
            } else {
                enqueueSnackbar(res && res.message ? res.message : "Login failed!", {variant: 'error'});
            }
        } catch (error) {
            enqueueSnackbar("Login failed!", {variant: 'error'});
        }
    };

    return (
        <Box 
            className={'wrapper'} 
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url("https://merrystar.edu.vn/wp-content/uploads/2021/09/hoi-dong-khoa-hoc-bg.png")',
                position: 'relative'
            }}
        >
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    color: '#fff',
                    backgroundColor: '#1A252F',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.5px'
                }}
            >
                Back to Home
            </Button>

            <Paper 
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" align="center" gutterBottom sx={{fontWeight: 'bold'}}>
                    Sign In
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
                    Please sign in to continue
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        size="small"
                    />

                    <FormControl sx={{ mt: 2, mb: 1 }} fullWidth variant="outlined" size="small">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={handleChange}
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#2c3e50',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1a252f',
                            }
                        }}
                    >
                        Log In
                    </Button>

                    <Box sx={{ 
                        textAlign: 'center',
                        mt: 2
                    }}>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Don't have an account?{' '}
                            <Link
                                component="button"
                                variant="body2"
                                onClick={() => navigate('/register')}
                                sx={{
                                    color: '#07663a',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                Register
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;