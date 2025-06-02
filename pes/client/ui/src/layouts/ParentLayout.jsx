import DashboardUI from "../components/ui/DashhboardUI.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function ParentLayout() {
    const navigate = [
        {
            segment: 'parent/form',
            title: 'Admission Form',
            icon: <InsertDriveFileIcon/>
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