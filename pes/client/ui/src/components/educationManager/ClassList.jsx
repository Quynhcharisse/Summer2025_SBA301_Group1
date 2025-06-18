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
import {Add, Delete, Info, Search} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {getAllClasses, removeClass} from "../../services/EducationService.jsx";
import {enqueueSnackbar} from 'notistack';

function ClassList() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);

    useEffect(() => {
        fetchClasses();
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
            valueGetter: (params) => {
                // DataGrid passes the teacher object directly as params for this field
                if (params && params.name) {
                    return params.name;
                }
                if (params && params.firstName) {
                    return params.firstName;
                }
                // Fallback to check if it's the full row object
                if (params && params.row && params.row.teacher) {
                    return params.row.teacher.name || params.row.teacher.firstName || 'No Teacher';
                }
                return 'No Teacher';
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
        <Box sx={{p: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    Class Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add/>}
                    sx={{
                        background: 'linear-gradient(135deg, var(--success-color), #45a049)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                        }
                    }}
                >
                    Create Class
                </Button>
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
        </Box>
    );
}

export default ClassList;