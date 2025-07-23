import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {Add, Delete, Info, PersonAdd, Search} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {
    getAllClasses,
    getAllTeachers,
    getTeacherById,
    removeClass
} from "../../services/EducationService.jsx";
import {enqueueSnackbar} from 'notistack';
import TeacherDetailView from './TeacherDetailView.jsx';

function ClassList() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [teacherDetailOpen, setTeacherDetailOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        grade: '',
        status: '',
        teacher: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [classesResponse, teachersResponse] = await Promise.all([
                getAllClasses(),
                getAllTeachers()
            ]);

            if (classesResponse && classesResponse.success) {
                const classData = Array.isArray(classesResponse.data) ? classesResponse.data : [];
                const validClasses = classData.filter(cls => cls && typeof cls === 'object' && cls.id);
                setClasses(validClasses);
            } else {
                enqueueSnackbar('Failed to fetch classes', {variant: 'error'});
                setClasses([]);
            }

            if (teachersResponse && teachersResponse.success) {
                const teacherData = Array.isArray(teachersResponse.data) ? teachersResponse.data : [];
                setTeachers(teacherData);
            } else {
                enqueueSnackbar('Failed to fetch teachers', {variant: 'error'});
                setTeachers([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Error fetching data', {variant: 'error'});
        } finally {
            setLoading(false);
        }
    };

    const handleViewInfo = (classData) => {
        navigate(`/education/classes/${classData.id}`);
    };

    const handleDeleteClick = (classData) => {
        setClassToDelete(classData);
        setDeleteDialogOpen(true);
    };

    const handleAssignStudentClick = (classData) => {
        navigate(`/education/assign-students`, { state: { classId: classData.id } });
    };

    const handleDeleteConfirm = async () => {
        if (!classToDelete) return;

        try {
            const response = await removeClass(classToDelete.id);
            if (response && response.success) {
                enqueueSnackbar(`Class "${classToDelete.name}" deleted successfully`, { variant: 'success' });
                fetchInitialData();
            } else {
                enqueueSnackbar(response?.message || 'Failed to delete class', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            enqueueSnackbar(error.message || 'An unexpected error occurred while deleting the class.', { variant: 'error' });
        } finally {
            setDeleteDialogOpen(false);
            setClassToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setClassToDelete(null);
    };


    const handleTeacherClick = async (teacher) => {
        try {
            // Fetch complete teacher details instead of using the simplified teacher object from class data
            const response = await getTeacherById(teacher.id);
            if (response && response.success) {
                setSelectedTeacher(response.data);
                setTeacherDetailOpen(true);
            } else {
                // Fallback to the original teacher object if fetch fails
                console.warn('Failed to fetch complete teacher details, using simplified data');
                setSelectedTeacher(teacher);
                setTeacherDetailOpen(true);
            }
        } catch (error) {
            console.error('Error fetching teacher details:', error);
            // Fallback to the original teacher object if error occurs
            setSelectedTeacher(teacher);
            setTeacherDetailOpen(true);
        }
    };

    const handleTeacherDetailClose = () => {
        setTeacherDetailOpen(false);
        setSelectedTeacher(null);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'name',
            headerName: 'Class Name',
            width: 200,
            headerAlign: 'center'
        },
        {
            field: 'grade',
            headerName: 'Grade',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip
                    label={params?.value || 'Unknown'}
                    color={getStatusColor(params?.value)}
                    size="small"
                />
            )
        },
        {
            field: 'teacher',
            headerName: 'Teacher',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const teacher = params.row?.teacher;
                const teacherName = teacher?.name || teacher?.firstName || 'No Teacher';

                if (!teacher || teacherName === 'No Teacher') {
                    return (
                        <Typography variant="body2" color="text.secondary">
                            No Teacher
                        </Typography>
                    );
                }

                return (
                    <Button
                        variant="text"
                        onClick={() => handleTeacherClick(teacher)}
                        sx={{
                            textTransform: 'none',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                textDecoration: 'underline'
                            },
                            p: 0.5,
                            minWidth: 'auto'
                        }}
                    >
                        {teacherName}
                    </Button>
                );
            }
        },
        {
            field: 'numberOfStudents',
            headerName: 'Number of Students',
            width: 180,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'numberStudent',
            headerName: 'Students capacity',
            width: 180,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 280,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%'
                    }}
                >
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<Info sx={{ color: 'white' }} />}
                        onClick={() => params?.row && handleViewInfo(params.row)}
                        disabled={!params?.row}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc',
                            }
                        }}
                    >
                        Info
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<PersonAdd sx={{ color: 'white' }} />}
                        onClick={() => params?.row && handleAssignStudentClick(params.row)}
                        disabled={!params?.row}
                        sx={{
                            backgroundColor: '#4caf50', // A green color
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#388e3c',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc',
                            }
                        }}
                    >
                        Assign
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<Delete sx={{ color: 'white' }} />}
                        onClick={() => params?.row && handleDeleteClick(params.row)}
                        disabled={!params?.row}
                        sx={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                            },
                            '&:disabled': {
                                backgroundColor: '#ccc',
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredClasses = classes.filter(classItem => {
        const { name, grade, status, teacher } = filters;
        return (
            (name === '' || classItem.name?.toLowerCase().includes(name.toLowerCase())) &&
            (grade === '' || classItem.grade === grade) &&
            (status === '' || classItem.status?.toLowerCase() === status.toLowerCase()) &&
            (teacher === '' || classItem.teacher?.id === teacher)
        );
    });

    return (
        <Box sx={{p: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    Class Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add sx={{ color: 'white' }} />}
                    onClick={() => navigate('/education/classes/new')}
                    sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#1565c0',
                        }
                    }}
                >
                    Create Class
                </Button>
            </Box>

            {/* Filter Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    variant="outlined"
                    placeholder="Search by name..."
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: '250px', backgroundColor: 'white' }}
                />
                <FormControl variant="outlined" sx={{ minWidth: 150, backgroundColor: 'white' }}>
                    <InputLabel>Grade</InputLabel>
                    <Select
                        name="grade"
                        value={filters.grade}
                        onChange={handleFilterChange}
                        label="Grade"
                    >
                        <MenuItem value=""><em>All Grades</em></MenuItem>
                        <MenuItem value="SEED">Seed</MenuItem>
                        <MenuItem value="BUD">Bud</MenuItem>
                        <MenuItem value="LEAF">Leaf</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 150, backgroundColor: 'white' }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        label="Status"
                    >
                        <MenuItem value=""><em>All Statuses</em></MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="pending approval">Pending Approval</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: 'white' }}>
                    <InputLabel>Teacher</InputLabel>
                    <Select
                        name="teacher"
                        value={filters.teacher}
                        onChange={handleFilterChange}
                        label="Teacher"
                    >
                        <MenuItem value=""><em>All Teachers</em></MenuItem>
                        {teachers.map(teacher => (
                            <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Paper sx={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={filteredClasses || []}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    loading={loading}
                    disableSelectionOnClick
                    getRowId={(row) => row?.id || Math.random()}
                    sx={{
                        '& .MuiDataGrid-header': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }}
                />
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete the class "{classToDelete?.name}"?
                        This action cannot be undone and may affect related data such as students, activities, and
                        schedules.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeleteCancel}
                        color="primary"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


            <TeacherDetailView
                teacher={selectedTeacher}
                open={teacherDetailOpen}
                onClose={handleTeacherDetailClose}
            />
        </Box>
    );
}

export default ClassList;