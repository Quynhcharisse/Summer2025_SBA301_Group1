import { useEffect, useState } from "react";
import { getTeacherList } from "../../services/HrService";
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { addTeacher, updateTeacher } from '../../services/HrService';

export default function TeacherList() {
    const [teacherList, setTeacherList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addOpen, setAddOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        password: '',
        email: '',
        phone: '',
        gender: '',
        identityNumber: ''
    });

    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        id: '',
        name: '',
        password: '',
        email: '',
        phone: '',
        gender: '',
        identityNumber: ''
    });

    useEffect(() => {
        fetchTeacherList();
    }, []);

    const fetchTeacherList = async () => {
        try {
            setLoading(true);
            const response = await getTeacherList();
            if (response && response.success) {
                setTeacherList(response.data);
            } else {
                enqueueSnackbar('Fetch Teacher List failed!', { variant: "error" });
                setTeacherList([]);
            }
        } catch (e) {
            console.log(e);
            enqueueSnackbar('Error fetching teacher list!', { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    const handleOpenAdd = () => {
        setForm({ name: '', email: '', phone: '', gender: '', identityNumber: '' });
        setAddOpen(true);
    };
    const handleCloseAdd = () => setAddOpen(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            const res = await addTeacher(form);
            if (res && res.success) {
                enqueueSnackbar('Added teacher successfully!', { variant: 'success' });
                setAddOpen(false);
                fetchTeacherList();
            } else {
                enqueueSnackbar(res?.message || 'Failed to add teacher!', { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar('Error adding teacher!', { variant: 'error' });
        } finally {
            setAddLoading(false);
        }
    };

    const handleOpenEdit = (teacher) => {
        setEditForm({
            id: teacher.id,
            name: teacher.name || '',
            password: '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            gender: teacher.gender || '',
            identityNumber: teacher.identityNumber || ''
        });
        setEditOpen(true);
    };
    const handleCloseEdit = () => setEditOpen(false);
    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };
    const handleEditTeacher = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const { id, name, phone, gender, identityNumber } = editForm;
            const data = { name, phone, gender, identityNumber };
            const res = await updateTeacher(id, data);
            if (res && res.success) {
                enqueueSnackbar('Updated teacher successfully!', { variant: 'success' });
                setEditOpen(false);
                fetchTeacherList();
            } else {
                enqueueSnackbar(res?.message || 'Failed to update teacher!', { variant: 'error' });
            }
        } catch (err) {
            enqueueSnackbar('Error updating teacher!', { variant: 'error' });
        } finally {
            setEditLoading(false);
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
                Teacher List
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
                    Add Teacher
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: 'linear-gradient(90deg, #e3e8ee 0%, #f8fafc 100%)' }}>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>No</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Email</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Phone</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Gender</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Identity Number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                            {/* <TableCell align="center" sx={{ fontWeight: 700 }}>Is Teaching</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Class</TableCell> */}
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teacherList.map((teacher, index) => (
                            <TableRow
                                key={teacher.id}
                                sx={{
                                    '&:hover': { backgroundColor: 'rgba(44, 62, 80, 0.04)' },
                                    transition: 'background 0.2s',
                                }}
                            >
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="center">{teacher.name}</TableCell>
                                <TableCell align="center">{teacher.email}</TableCell>
                                <TableCell align="center">{teacher.phone}</TableCell>
                                <TableCell align="center">{teacher.gender}</TableCell>
                                <TableCell align="center">{teacher.identityNumber}</TableCell>
                                <TableCell align="center">{getStatusChip(teacher.status)}</TableCell>
                                {/* <TableCell align="center">
                                    {teacher.isOccupied ? (
                                        <Chip label="Teaching" color="success" size="small" />
                                    ) : (
                                        <Chip label="Available" color="info" size="small" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {teacher.classes ? teacher.classes.name : <Chip label="No Class" size="small" />}
                                </TableCell> */}
                                <TableCell align="center">
                                    <Button variant="outlined" size="small" startIcon={<Edit />} onClick={() => handleOpenEdit(teacher)}>
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={addOpen} onClose={handleCloseAdd} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleAddTeacher} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            type="email"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            type="password"
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            select
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </TextField>
                        <TextField
                            label="Identity Number"
                            name="identityNumber"
                            value={form.identityNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <DialogActions sx={{ px: 0, pb: 0 }}>
                            <Button onClick={handleCloseAdd} color="secondary" disabled={addLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={addLoading} startIcon={addLoading ? <CircularProgress size={20} /> : null}>
                                {addLoading ? 'Saving...' : 'Add Teacher'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Teacher</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleEditTeacher} sx={{ mt: 1 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Gender"
                            name="gender"
                            value={editForm.gender}
                            onChange={handleEditChange}
                            select
                            fullWidth
                            margin="normal"
                            required
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </TextField>
                        <TextField
                            label="Identity Number"
                            name="identityNumber"
                            value={editForm.identityNumber}
                            onChange={handleEditChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <DialogActions sx={{ px: 0, pb: 0 }}>
                            <Button onClick={handleCloseEdit} color="secondary" disabled={editLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={editLoading} startIcon={editLoading ? <CircularProgress size={20} /> : null}>
                                {editLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
