import {createTheme} from "@mui/material";
import {useState} from "react";

export default function DashboardUI({navigate, homeUrl}) {
    const [session, setSession] = useState(
        localStorage.getItem("user") ?
            JSON.parse(localStorage.getItem("user"))
            : {user: {email: "", name: ""}}
    );
    const authen = {
        signIn: () => {
            setSession(session);
        },
        signOut: () => {
            setSession(null);
            window.location.href = "/login"
        }
    }

    const theme = createTheme({
        colorSchemes: { light: true, dark: false },
    });

    return (
        <ReactRouterAppProvider
            navigation={navigate}
            branding={
                {
                    logo: <img src="/img.png" alt="logo"/>,
                    title: "PES",
                    homeUrl: homeUrl
                }
            }
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