import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardUI from "../components/ui/DashhboardUI.jsx";


function HrLayout() {
    console.log("HrLayout");
    
    const navigate = [
        {
            segment: 'hr/parent-list',
            title: 'Parent List',
            icon: <AccountBoxIcon sx={{ color: '#2c3e50' }} />
        },
        {
            segment: 'hr/teacher-list',
            title: 'Teacher List',
            icon: <AccountBoxIcon sx={{ color: '#2c3e50' }} />
        }
    ];
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={'/hr/parent-list'}
        />
    );
}
export default HrLayout;