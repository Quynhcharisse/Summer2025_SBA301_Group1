import DashboardUI from "../components/ui/DashhboardUI.jsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssignmentIcon from "@mui/icons-material/Assignment";

function ManagerLayout() {
    const navigate = [
        {
            segment: 'manager/dashboard',
            title: 'Dashboard',
            icon: <DashboardIcon/>
        },
        {
            segment: 'manager/classes',
            title: 'Class Management',
            icon: <ClassIcon/>
        },
        {
            segment: 'manager/schedules',
            title: 'Schedule Management',
            icon: <ScheduleIcon/>
        },
        {
            segment: 'manager/activities',
            title: 'Activity Management',
            icon: <AssignmentIcon/>
        }
    ]
    
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={'/manager/dashboard'}
        />
    )
}

export default ManagerLayout;