import { useEffect, useState } from "react";
import { viewParentList, banParent, unbanParent } from "../../services/HrService";
import { enqueueSnackbar } from "notistack";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function ParentList() {
    const [parentList, setParentList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching....");

        fetchParentList();
    }, []);

    const fetchParentList = async () => {
        try {
            setLoading(true)
            const response = await viewParentList();
            console.log(response);
            if (response && response.success) {
                const parents = response.data;
                setParentList(parents);
            } else {
                enqueueSnackbar('Fetch Parent List!', { variant: "error" });
                setParentList([])
            }
        } catch (e) {
            console.log(e);

        } finally {
            setLoading(false);
        }

    }

    const handleBan = async (parentId) => {
        try {
            const response = await banParent(parentId);
            if (response && response.success) {
                enqueueSnackbar('Parent banned successfully!', { variant: 'success' });
                fetchParentList(); // Refresh the list
            } else {
                enqueueSnackbar('Failed to ban parent!', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error banning parent:', error);
            enqueueSnackbar('Error banning parent!', { variant: 'error' });
        }
    };

    const handleUnban = async (parentId) => {
        try {
            const response = await unbanParent(parentId);
            if (response && response.success) {
                enqueueSnackbar('Parent unbanned successfully!', { variant: 'success' });
                fetchParentList(); // Refresh the list
            } else {
                enqueueSnackbar('Failed to unban parent!', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error unbanning parent:', error);
            enqueueSnackbar('Error unbanning parent!', { variant: 'error' });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ban':
                return { backgroundColor: 'red', color: 'white', borderRadius: '8px', padding: '5px 10px', display: 'inline-block' };
            case 'active':
                return { backgroundColor: 'green', color: 'white', borderRadius: '8px', padding: '5px 10px', display: 'inline-block' };
            default:
                return { backgroundColor: 'blue', color: 'white', borderRadius: '8px', padding: '5px 10px', display: 'inline-block' }; // Default case
        }
    };

    return (
        <Box sx={{ alignContent: 'space-around' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Day of Birth</TableCell>
                            <TableCell>Relationship</TableCell>
                            <TableCell>Job</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parentList.map((parent, index) => (
                            <TableRow key={parent.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{parent.name}</TableCell>
                                <TableCell>{parent.address}</TableCell>
                                <TableCell>{parent.phone}</TableCell>
                                <TableCell>{parent.dayOfBirth}</TableCell>
                                <TableCell>{parent.relationshipToChild}</TableCell>
                                <TableCell>{parent.job}</TableCell>
                                <TableCell>
                                    <div style={getStatusStyle(parent.status)}>
                                        {parent.status}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {parent.status === 'active' ? (
                                        <LockOutlineIcon color="black" cursor='pointer' onClick={() => handleBan(parent.id)} >
                                        </LockOutlineIcon>

                                    ) : (
                                        <LockOpenIcon color="black" cursor='pointer' onClick={() => handleUnban(parent.id)} >
                                        </LockOpenIcon>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}