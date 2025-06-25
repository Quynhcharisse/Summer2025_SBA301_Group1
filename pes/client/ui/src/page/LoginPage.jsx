import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField
} from "@mui/material";
import {SignInPage} from "@toolpad/core";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {enqueueSnackbar} from "notistack";
import {login, logout} from "../services/AuthService.jsx";


const providers = [
    {
        id: 'credentials',
        name: 'Email and Password'
    }
]

// Custom email input field
function CustomEmailField({value, onchange}) {
    return (
        <TextField
            id="input-with-icon-textfield"
            label="Email"
            name="email"
            type="email"
            size="small"
            required
            fullWidth
            variant="outlined"
            value={value}
            onChange={onchange}
        />
    );
}

// Custom password input field
function CustomPasswordField({value, onchange}) {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <FormControl sx={{my: 2}} fullWidth variant="outlined">
            <InputLabel size="small" htmlFor="outlined-adornment-password">
                Password
            </InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                size="small"
                value={value}
                onChange={onchange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                        >
                            {showPassword ? <VisibilityOff fontSize="inherit" style={{color: 'white'}}/> :
                                <Visibility fontSize="inherit" style={{color: 'white'}}/>}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
    );
}

async function handleSignIn(email, password) {
    const response = await login(email, password);
    if (response) {
        console.log(response);
        return response;
    }
}

const signInPage = async (provider, formData) => {
    if (provider.id === 'credentials') {
        const email = formData.get('email');
        const password = formData.get('password');

        handleSignIn(email, password).then(res => {
            if (res && res.success) {
                enqueueSnackbar(res.message, {variant: 'success'});
                const userAcc = {
                    user: {
                        // id: res.data.parentId,
                        name: res.data.name,
                        email: res.data.email,
                    }
                }
                localStorage.setItem('user', JSON.stringify(userAcc));
                const accessToken = Cookies.get('access');
                if (accessToken) {
                    const decode = jwtDecode(accessToken);
                    const role = decode.role;

                    switch (role) {
                        case 'ADMISSION':
                            window.location.href = "/admission/process/form";
                            break;

                        case 'PARENT':
                            setTimeout(() => {
                                window.location.href = "/parent/profile";
                            }, 500)
                            break;

                        case 'EDUCATION':
                            setTimeout(() => {
                                window.location.href = "/education";
                            }, 500)
                            break;

                        case 'HR':
                            setTimeout(() => {
                                window.location.href = "/hr";
                            }, 500)
                            break;

                        default:
                            window.location.href = "/login";
                    }
                    return role;
                }
            } else {
                enqueueSnackbar(res.message, {variant: 'error'});
            }
        });
    }
}

function CustomButton() {
    return (
        <Button
            type="submit"
            variant="contained"
            size="medium"
            disableElevation
            fullWidth
            sx={{
                my: 2,
                backgroundColor: '#2c3e50',
                color: '#fff',
                '&:hover': {
                    backgroundColor: '#1a252f',
                }
            }}
        >
            Log In
        </Button>
    );
}

function Login() {
    // Clear local storage only if we're actually on the login page
    // and not being redirected here due to authentication issues
    const isRedirectedFromAuth = new URLSearchParams(window.location.search).get('redirect') === 'auth';

    if (!isRedirectedFromAuth && localStorage.length > 0) {
        localStorage.clear()
    }

    // Run logout only once when component mounts
    useEffect(() => {
        // Only logout if we're not coming from an auth redirect
        if (!isRedirectedFromAuth) {
            async function signOut(){
                return await logout();
            }

            signOut().then(res => {
                console.log(res);
            });
        }
    }, [])

    return (
        <Box className={'wrapper'} style={{backgroundImage: 'url("https://merrystar.edu.vn/wp-content/uploads/2021/09/hoi-dong-khoa-hoc-bg.png")'}}>
            <SignInPage
                providers={providers}
                signIn={signInPage}
                localeText={{
                    signInTitle: 'Sign In',
                    email: 'Email',
                    password: 'Password',
                }}
                slots={{
                    emailField: CustomEmailField,
                    passwordField: CustomPasswordField,
                    submitButton: CustomButton
                }}
                slotProps={{
                    form: {noValidate: true},
                    submitButton: {
                        color: 'primary',
                        variant: 'contained',
                    }
                }
                }
            />
        </Box>
    )
}

export default Login;