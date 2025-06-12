import DashboardUI from "../components/ui/DashhboardUI.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SchoolIcon from '@mui/icons-material/School';

function AdmissionLayout() {
    const navigate = [
        {
            segment: 'admission/process/form',
            title: 'Process Admission Form',
            icon: <InsertDriveFileIcon/>
        },
        {
            segment: 'admission/term',
            title: 'Admission Term',
            icon: <SchoolIcon sx={{ color: '#2c3e50' }} />
        }
    ]
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={'/admission/process/form'}/>
    )
}

export default AdmissionLayout;