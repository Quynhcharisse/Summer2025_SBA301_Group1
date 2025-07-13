import DashboardUI from "../components/ui/DashhboardUI.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChildCareIcon from '@mui/icons-material/ChildCare';

function ParentLayout() {
    const navigate = [
        {
            segment: 'parent/profile',
            title: 'Profile',
            icon: <AccountBoxIcon sx={{ color: '#2c3e50' }} />
        },
        {
            segment: 'parent/child',
            title: 'Children',
            icon: <ChildCareIcon sx={{ color: '#2c3e50' }}/>
        },
        {
            segment: 'parent/form',
            title: 'Admission Form',
            icon: <InsertDriveFileIcon sx={{ color: '#2c3e50' }} />
        }
    ];
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={'/parent/form'}
        />
    );
}

export default ParentLayout;