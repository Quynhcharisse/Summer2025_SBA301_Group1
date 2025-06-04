import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import LoginPage from "./page/LoginPage.jsx";
import {HomePage} from "./page/HomePage.jsx";
import {SnackbarProvider} from "notistack";
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ParentLayout from "./layouts/ParentLayout.jsx";
import ProtectRoute from "./config/ProtectRoute.jsx";
import AdmissionForm from "./components/parent/Form.jsx";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ProcessForm from "./components/admissionMannager/ProcessForm.jsx";
import AdmissionLayout from "./layouts/AdmissionLayout.jsx";
import EducationLayout from "./layouts/EducationLayout.jsx";
import ClassList from "./components/educationManager/ClassList.jsx";
import ActivityManagement from "./components/educationManager/ActivityManagement.jsx";
import ScheduleManagement from "./components/educationManager/ScheduleManagement.jsx";
import Dashboard from "./components/educationManager/Dashboard.jsx";


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
        path: "/",
        element: <Navigate to="/home"/>
    },    {        path: "/admission",
        element: (
            <ProtectRoute allowedRoles={["ADMISSION"]}>
                <AdmissionLayout/>
            </ProtectRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admission/process/form"/>
            },
            {
                path: 'process/form',
                element: <ProcessForm/>
            }
        ]
    },    {        path: "/parent",
        element: (
            <ProtectRoute allowedRoles={["PARENT"]}>
                <ParentLayout/>
            </ProtectRoute>
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
    },    {        path: "/education",
        element: (
            <ProtectRoute allowedRoles={["EDUCATION"]}>
                <EducationLayout/>
            </ProtectRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard/>
            },
            {
                path: 'classes',
                element: <ClassList/>
            },
            {
                path: 'activities',
                element: <ActivityManagement/>
            },
            {
                path: 'schedules',
                element: <ScheduleManagement/>
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to='/home'/>
    },
])

function App() {
    return (
        <>
            <SnackbarProvider maxSnack={3} anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                              autoHideDuration={3000}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <RouterProvider router={router}/>
                </LocalizationProvider>
            </SnackbarProvider>
        </>
    )
}

export default App
