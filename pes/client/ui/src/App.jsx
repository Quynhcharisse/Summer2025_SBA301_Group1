import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import LoginPage from "./page/LoginPage.jsx";
import {HomePage} from "./page/HomePage.jsx";
import {SnackbarProvider} from "notistack";
import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ParentLayout from "./layouts/ParentLayout.jsx";
import ProtectRoute from "./config/ProtectRoute.jsx";
import AdmissionForm from "./components/parent/AdmissionForm.jsx";
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ProcessForm from "./components/admissionManager/ProcessForm.jsx";
import AdmissionLayout from "./layouts/AdmissionLayout.jsx";
import EducationLayout from "./layouts/EducationLayout.jsx";
import ClassList from "./components/educationManager/ClassList.jsx";
import ClassDetails from "./components/educationManager/ClassDetails.jsx";
import EducationDashboard from "./components/educationManager/EducationDashboard.jsx";
import AdmissionTerm from "./components/admissionManager/AdmissionTerm.jsx";
import ChildrenList from "./components/parent/ChildrenList.jsx";
import SyllabusList from "./components/educationManager/SyllabusList.jsx";
import LessonList from "./components/educationManager/LessonList.jsx";
import ProfileParent from "./components/parent/ProfileParent.jsx";
import AssignStudentToClass from "./components/educationManager/AssignStudentToClass.jsx";
import LessonDetails from "./components/educationManager/LessonDetails.jsx";
import SyllabusDetails from "./components/educationManager/SyllabusDetails.jsx";


const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage/>
    },
    // {
    //     path: '/register',
    //     element: <RegisterPage/>
    // },
    {
        path: "/home",
        element: <HomePage/>
    },
    {
        path: "/",
        element: <Navigate to="/home"/>
    },
    {
        path: "/admission",
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
            },
            {
                path: 'term',
                element: <AdmissionTerm/>
            }
        ]
    }, {
        path: "/parent",
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
                path: 'profile',
                element: <ProfileParent/>
            },
            {
                path: 'form',
                element: <AdmissionForm/>
            },
            {
                path: 'child',
                element: <ChildrenList/>
            }
        ]
    },
    {
        path: "/education",
        element: (
            <ProtectRoute allowedRoles={["EDUCATION"]}>
                <EducationLayout/>
            </ProtectRoute>
        ), children: [
            {
                index: true,
                element: <EducationDashboard/>
            },
            {
                path: 'classes',
                element: <ClassList/>
            },            {
                path: 'classes/:id',
                element: <ClassDetails/>
            },
            {
                path: 'assign-students',
                element: <AssignStudentToClass/>
            },
            {
                path: 'syllabus',
                element: <SyllabusList/>
            },
            {
                path: 'syllabus/:id',
                element: <SyllabusDetails/>
            },
            {
                path: 'lessons',
                element: <LessonList/>
            },
            {
                path: 'lessons/:id',
                element: <LessonDetails/>
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
