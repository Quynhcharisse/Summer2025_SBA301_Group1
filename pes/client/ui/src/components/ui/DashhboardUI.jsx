import {createTheme} from "@mui/material";
import {useState, useEffect} from "react";
import {ReactRouterAppProvider} from "@toolpad/core/react-router";
import {DashboardLayout} from "@toolpad/core";
import {Outlet} from "react-router-dom"
import Cookies from 'js-cookie'
import {jwtDecode} from "jwt-decode";

export default function DashboardUI({navigate, homeUrl}) {
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Check both localStorage and cookies for authentication
        const userFromStorage = localStorage.getItem("user");
        const accessToken = Cookies.get('access');
        
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setSession({
                    user: {
                        email: decoded.email || "",
                        name: decoded.name || decoded.sub || "",
                        role: decoded.role || ""
                    }
                });
            } catch (error) {
                console.error("Token decode error:", error);
                setSession(null);
            }
        } else if (userFromStorage) {
            setSession(JSON.parse(userFromStorage));
        } else {
            setSession({user: {email: "", name: ""}});
        }
    }, []);

    const authen = {
        signIn: () => {
            // This would be handled by the login page
        },
        signOut: () => {
            setSession(null);
            localStorage.removeItem("user");
            Cookies.remove('access');
            Cookies.remove('check');
            window.location.href = "/login"
        }
    }

    const theme = createTheme({
        colorSchemes: { light: true, dark: false },
        components: {
            // Override any component that might be trying to load external resources
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundImage: 'none !important',
                    },
                },
            },
        },
    });

    return (
        <ReactRouterAppProvider
            navigation={navigate}
            branding={{
                logo: <img src="/logo-merrystar-horizontal.png" alt="MerryStar Logo" style={{ maxHeight: '40px' }} />,
                title: "MerryStar",
                homeUrl: homeUrl
            }}
            theme={theme}
            authentication={authen}
            session={session}
        >
            <DashboardLayout>
                <Outlet/>
            </DashboardLayout>
        </ReactRouterAppProvider>
    )
}