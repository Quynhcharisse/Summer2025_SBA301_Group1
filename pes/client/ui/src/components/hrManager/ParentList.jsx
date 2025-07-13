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
    Typography,
    Chip,
    Tooltip,
    Button
} from '@mui/material';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function ParentList() {
    const [parentList, setParentList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParentList();
    }, []);

    const fetchParentList = async () => {
        try {
            setLoading(true)
            const response = await viewParentList();
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

    const getStatusChip = (status) => {
        switch (status) {
            case 'ban':
                return <Chip label="Banned" color="error" variant="filled" size="small" sx={{ fontWeight: 600 }} />;
            case 'active':
                return <Chip label="Active" color="success" variant="filled" size="small" sx={{ fontWeight: 600 }} />;
            default:
                return <Chip label={status} color="info" variant="filled" size="small" sx={{ fontWeight: 600 }} />;
        }
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 5, mb: 5 }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3, color: '#2c3e50', letterSpacing: 1 }}>
                Parent List
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)' }}>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>No</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Address</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Phone</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Day of Birth</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Relationship</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Job</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {parentList.map((parent, index) => (
                            <TableRow
                                key={parent.id}
                                sx={{
                                    '&:hover': { backgroundColor: 'rgba(44, 62, 80, 0.04)' },
                                    transition: 'background 0.2s',
                                }}
                            >
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{parent.name}</TableCell>
                                <TableCell align="center">{parent.address}</TableCell>
                                <TableCell align="center">{parent.phone}</TableCell>
                                <TableCell align="center">{parent.dayOfBirth}</TableCell>
                                <TableCell align="center">{parent.relationshipToChild}</TableCell>
                                <TableCell align="center">{parent.job}</TableCell>
                                <TableCell align="center">{getStatusChip(parent.status)}</TableCell>
                                <TableCell align="center">
                                    {parent.status === 'active' ? (
                                        <Tooltip title="Ban Parent">
                                            <span>
                                                <Button
                                                    onClick={() => handleBan(parent.id)}
                                                    color="error"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ minWidth: 0, p: 1, borderRadius: 2 }}
                                                >
                                                    <LockOutlineIcon />
                                                </Button>
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Unban Parent">
                                            <span>
                                                <Button
                                                    onClick={() => handleUnban(parent.id)}
                                                    color="success"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ minWidth: 0, p: 1, borderRadius: 2 }}
                                                >
                                                    <LockOpenIcon />
                                                </Button>
                                            </span>
                                        </Tooltip>
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