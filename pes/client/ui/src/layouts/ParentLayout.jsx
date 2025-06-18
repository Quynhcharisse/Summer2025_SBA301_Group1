import DashboardUI from "../components/ui/DashhboardUI.jsx";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";


function ParentLayout() {
    // Get parent id from localStorage (set at login)
    let parentId = null;
    try {
        const user = JSON.parse(localStorage.getItem('user'));        
        parentId = user.user.id;
    } catch (e) {
        parentId = '';
    }
    console.log(parentId);
    
    const navigate = [
        {
            segment: 'parent/'+parentId,
            title: 'Profile',
            icon: <InsertDriveFileIcon sx={{ color: '#2c3e50' }} />
        },
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
    ];
    return (
        <DashboardUI
            navigate={navigate}
            homeUrl={parentId ? `/parent/${parentId}` : '/parent/form'}
        />
    );
}

export default ParentLayout;