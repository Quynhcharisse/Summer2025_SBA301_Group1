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
import ClassManagement from "./components/educationManager/ClassManagement.jsx";
import ActivityManagement from "./components/educationManager/ActivityManagement.jsx";
import ScheduleManagement from "./components/educationManager/ScheduleManagement.jsx";
import DashboardUI from "./components/ui/DashhboardUI.jsx";


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
        ),        children: [
            {
                index: true,
                element: (
                    <div style={{ padding: '24px' }}>
                        <h1 style={{ marginBottom: '16px', color: '#1976d2' }}>
                            Education Management Dashboard
                        </h1>
                        <p style={{ marginBottom: '24px', color: '#666', fontSize: '16px' }}>
                            Welcome to the Education Management System. Use the navigation menu to access different features.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '32px' }}>
                            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                                <h3 style={{ color: '#1976d2', marginBottom: '12px' }}>Class Management</h3>
                                <p style={{ color: '#666' }}>Manage student classes, enrollment, and class information.</p>
                            </div>
                            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                                <h3 style={{ color: '#1976d2', marginBottom: '12px' }}>Activity Management</h3>
                                <p style={{ color: '#666' }}>Organize and manage educational activities and events.</p>
                            </div>
                            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
                                <h3 style={{ color: '#1976d2', marginBottom: '12px' }}>Schedule Management</h3>
                                <p style={{ color: '#666' }}>Plan and manage class schedules and timetables.</p>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                path: 'classes',
                element: <ClassManagement/>
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
