import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import LoginPage from "./page/LoginPage.jsx";
import {HomePage} from "./page/HomePage.jsx";
import {SnackbarProvider} from "notistack";
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ParentLayout from "./layouts/ParentLayout.jsx";
import ProtectRouter from "./config/ProtectRouter.jsx";
import AdmissionForm from "./components/parent/Form.jsx";


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage/>
    },
    {
        path: "/home",
        element: <HomePage/>
    },
    {
        path: '*',
        element: <Navigate to='/home'/>
    },
    {
        path: "/parent",
        element: (
            <ProtectRouter allowedRoles={["PARENT"]}>
                <ParentLayout/>
            </ProtectRouter>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/parent/form"/>
            },
            {
                path: 'form',
                element: <AdmissionForm/>
            }
        ]
    },
])

function App() {


    return (
        <>
            <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                              autoHideDuration={3000}>
                <RouterProvider router={router}/>
            </SnackbarProvider>
        </>
    )
}

export default App
