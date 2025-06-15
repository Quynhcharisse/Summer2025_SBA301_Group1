import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Info, Visibility, Assignment, Search, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    getAllClasses,
    getSyllabusByClassId,
    getLessonsByClassId,
    createActivitiesFromLessons
} from '../../services/EducationService.jsx';
import { enqueueSnackbar } from 'notistack';
import '../../styles/manager/ActivityManagement.css';

function ClassList() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                enqueueSnackbar('Failed to fetch classes', { variant: 'error' });
                setClasses([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Error fetching data', { variant: 'error' });
            setClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewInfo = (classData) => {
        navigate(`/education/classes/${classData.id}`);
    };

    const handleViewSyllabus = async (classData) => {
        try {
            const syllabusResponse = await getSyllabusByClassId(classData.id);
            if (syllabusResponse && syllabusResponse.success) {
                enqueueSnackbar(`Syllabus loaded for ${classData.name}`, { variant: 'success' });
                // Placeholder for future implementation
            } else {
                enqueueSnackbar('No syllabus found for this class', { variant: 'warning' });
            }
        } catch (error) {
            console.error('Error fetching syllabus:', error);
            enqueueSnackbar('Error fetching syllabus', { variant: 'error' });
        }
    };

    const handleViewLessons = async (classData) => {
        try {
            const lessonsResponse = await getLessonsByClassId(classData.id);
            if (lessonsResponse && lessonsResponse.success) {
                const lessons = lessonsResponse.data || [];
                if (lessons.length > 0) {
                    // Ask if user wants to create activities from lessons
                    const confirm = window.confirm(`Found ${lessons.length} lessons for ${classData.name}. Would you like to create activities from these lessons?`);
                    if (confirm) {
                        const requestData = {
                            classId: classData.id,
                            lessonIds: lessons.map(lesson => lesson.id)
                        };
                        
                        const response = await createActivitiesFromLessons(requestData);
                        if (response && response.success) {
                            enqueueSnackbar('Activities created successfully from lessons', { variant: 'success' });
                        } else {
                            enqueueSnackbar('Failed to create activities from lessons', { variant: 'error' });
                        }
                    } else {
                        enqueueSnackbar(`Found ${lessons.length} lessons for ${classData.name}`, { variant: 'info' });
                    }
                } else {
                    enqueueSnackbar('No lessons found for this class', { variant: 'warning' });
                }
            } else {
                enqueueSnackbar('Failed to fetch lessons', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            enqueueSnackbar('Error fetching lessons', { variant: 'error' });
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
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
                if (params && params.row && params.row.teacher) {
                    return `${params.row.teacher.firstName}${params.row.teacher.lastName ? ' ' + params.row.teacher.lastName : ''}`;
                }
                return 'No Teacher';
            }
        },
        {
            field: 'numberStudent',
            headerName: 'Capacity',
            width: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 350,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box className="activity-actions-container">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Info sx={{ color: '#1976d2' }} />}
                        onClick={() => params?.row && handleViewInfo(params.row)}
                        disabled={!params?.row}
                        sx={{
                            color: '#1976d2',
                            borderColor: '#1976d2',
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                borderColor: '#1976d2',
                            }
                        }}
                    >
                        Info
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility sx={{ color: '#4caf50' }} />}
                        onClick={() => params?.row && handleViewSyllabus(params.row)}
                        disabled={!params?.row}
                        sx={{
                            color: '#4caf50',
                            borderColor: '#4caf50',
                            backgroundColor: 'rgba(76, 175, 80, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(76, 175, 80, 0.12)',
                                borderColor: '#4caf50',
                            }
                        }}
                    >
                        Syllabus
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Assignment sx={{ color: '#ff9800' }} />}
                        onClick={() => params?.row && handleViewLessons(params.row)}
                        disabled={!params?.row}
                        sx={{
                            color: '#ff9800',
                            borderColor: '#ff9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 152, 0, 0.12)',
                                borderColor: '#ff9800',
                            }
                        }}
                    >
                        Lessons
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
            classItem.teacher?.firstName?.toLowerCase().includes(searchLower) ||
            classItem.teacher?.lastName?.toLowerCase().includes(searchLower) ||
            classItem.numberStudent?.toString().includes(searchLower)
        );
    });

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Class Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
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
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search classes by name, grade, status, teacher, or capacity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
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

            <Paper sx={{ height: 600, width: '100%' }}>
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
                        }
                    }}
                />
            </Paper>
        </Box>
    );
}

export default ClassList;