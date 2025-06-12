import DashboardUI from "../components/ui/DashhboardUI.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function ParentLayout() {
    const navigate = [
        {
            segment: 'parent/form',
            title: 'Admission Form',
            icon: <InsertDriveFileIcon sx={{ color: '#2c3e50' }} />
        },
        {
            segment: 'parent/children',
            title: 'Children',
            icon: <InsertDriveFileIcon sx={{ color: '#2c3e50' }} />
        }
    ]
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={'/parent/form'}
        />
    )
}

export default ParentLayout;