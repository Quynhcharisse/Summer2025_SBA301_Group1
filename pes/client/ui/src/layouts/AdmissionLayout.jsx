import DashboardUI from "../components/ui/DashhboardUI.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

function AdmissionLayout() {
    const navigate = [
        {
            segment: 'admission/process/form',
            title: 'Process Admission Form',
            icon: <InsertDriveFileIcon/>
        }
    ]
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={'/admission/process/form'}/>
    )
}

export default AdmissionLayout;