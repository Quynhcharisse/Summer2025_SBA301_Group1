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
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {Add, Delete, Info, PersonAdd, Search} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {
    createClass,
    getAllClasses,
    getAllSyllabi,
    getAllTeachers,
    getTeacherById,
    removeClass
} from "../../services/EducationService.jsx";
import {enqueueSnackbar} from 'notistack';
import ClassForm from './ClassForm.jsx';
import TeacherDetailView from './TeacherDetailView.jsx';

function ClassList() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [classFormOpen, setClassFormOpen] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [syllabi, setSyllabi] = useState([]);
    const [teacherDetailOpen, setTeacherDetailOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
        fetchSyllabi();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const classesResponse = await getAllClasses();

            if (classesResponse && classesResponse.success) {
                // Ensure data is an array and filter out any invalid entries
                const classData = Array.isArray(classesResponse.data) ? classesResponse.data : [];
                const validClasses = classData.filter(cls => cls && typeof cls === 'object' && cls.id);
                setClasses(validClasses);
            } else {
                enqueueSnackbar('Failed to fetch classes', {variant: 'error'});
                setClasses([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Error fetching data', {variant: 'error'});
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };
    const fetchTeachers = async () => {
        try {
            const teachersResponse = await getAllTeachers();
            if (teachersResponse && teachersResponse.success) {
                setTeachers(teachersResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setTeachers([]);
        }
    };

    const fetchSyllabi = async () => {
        try {
            const syllabiResponse = await getAllSyllabi();
            if (syllabiResponse && syllabiResponse.success) {
                setSyllabi(syllabiResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching syllabi:', error);
            setSyllabi([]);
        }
    };

    const handleViewInfo = (classData) => {
        navigate(`/education/classes/${classData.id}`);
    };

    const handleDeleteClick = (classData) => {
        setClassToDelete(classData);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!classToDelete) return;

        try {
            const response = await removeClass(classToDelete.id);
            if (response && response.success) {
                enqueueSnackbar(`Class "${classToDelete.name}" deleted successfully`, {variant: 'success'});
                // Refresh the class list
                fetchClasses();
            } else {
                enqueueSnackbar('Failed to delete class', {variant: 'error'});
            }
        } catch (error) {
            console.error('Error deleting class:', error);
            if (error.response?.status === 409) {
                enqueueSnackbar('Cannot delete class. It may have dependencies (students, activities, etc.)', {variant: 'error'});
            } else {
                enqueueSnackbar('Error deleting class', {variant: 'error'});
            }
        } finally {
            setDeleteDialogOpen(false);
            setClassToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setClassToDelete(null);
    };

    const handleCreateClass = () => {
        setClassFormOpen(true);
    };

    const handleClassFormSubmit = async (classData) => {
        try {
            const response = await createClass(classData);
            if (response && response.success) {
                enqueueSnackbar('Class created successfully', {variant: 'success'});
                setClassFormOpen(false);
                fetchClasses();
            } else {
                enqueueSnackbar('Failed to create class', {variant: 'error'});
            }
        } catch (error) {
            console.error('Error creating class:', error);
            enqueueSnackbar('Error creating class', {variant: 'error'});
        }
    };

    const handleClassFormClose = () => {
        setClassFormOpen(false);
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
            field: 'numberStudent',
            headerName: 'Number of Students',
            width: 180,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
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
                        startIcon={<Info/>}
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
                        startIcon={<Delete/>}
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

    // Filter classes based on search term
    const filteredClasses = classes.filter(classItem => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            classItem.name?.toLowerCase().includes(searchLower) ||
            classItem.grade?.toLowerCase().includes(searchLower) ||
            classItem.status?.toLowerCase().includes(searchLower) ||
            classItem.teacher?.name?.toLowerCase().includes(searchLower) ||
            classItem.numberStudent?.toString().includes(searchLower)
        );
    });

    return (
        <Box sx={{p: 3}}> <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
            <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                Class Management
            </Typography>
            <Box sx={{display: 'flex', gap: 1}}>
                <Button
                variant="outlined"
                startIcon={<PersonAdd color="#1976d2"/>}
                onClick={() => navigate('/education/assign-students')}
                sx={{
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        borderColor: '#1976d2',
                    }
                }}
            >
                Assign Students
            </Button>
            <Button
                variant="contained"
                startIcon={<Add/>}
                onClick={handleCreateClass}
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
        </Box>

            {/* Search Bar */}
            <Box sx={{mb: 3}}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search classes by name, grade, status, teacher, or capacity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        maxWidth: 600,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                        }
                    }}
                />
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

            <ClassForm
                open={classFormOpen}
                onClose={handleClassFormClose}
                onSubmit={handleClassFormSubmit}
                mode="create"
                teachers={teachers}
                syllabi={syllabi}
                loading={loading}
            />

            <TeacherDetailView
                teacher={selectedTeacher}
                open={teacherDetailOpen}
                onClose={handleTeacherDetailClose}
            />
        </Box>
    );
}

export default ClassList;