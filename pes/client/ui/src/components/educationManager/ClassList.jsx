import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Info, Visibility, Assignment } from '@mui/icons-material';
import {
    getAllClasses,
    getSyllabusByClassId,
    getLessonsByClassId,
    createActivitiesFromLessons
} from '../../services/EducationService.jsx';
import { enqueueSnackbar } from 'notistack';

function ClassList() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [syllabus, setSyllabus] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [detailModal, setDetailModal] = useState({
        isOpen: false,
        type: '' // 'info', 'syllabus', 'lessons'
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await getAllClasses();
            if (response && response.success) {
                setClasses(response.data || []);
            } else {
                enqueueSnackbar('Failed to fetch classes', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            enqueueSnackbar('Error fetching classes', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (classData, type) => {
        setSelectedClass(classData);
        
        if (type === 'syllabus') {
            try {
                const syllabusResponse = await getSyllabusByClassId(classData.id);
                if (syllabusResponse && syllabusResponse.success) {
                    setSyllabus(syllabusResponse.data);
                } else {
                    enqueueSnackbar('Failed to fetch syllabus', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error fetching syllabus:', error);
                enqueueSnackbar('Error fetching syllabus', { variant: 'error' });
            }
        } else if (type === 'lessons') {
            try {
                const lessonsResponse = await getLessonsByClassId(classData.id);
                if (lessonsResponse && lessonsResponse.success) {
                    setLessons(lessonsResponse.data || []);
                } else {
                    enqueueSnackbar('Failed to fetch lessons', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error fetching lessons:', error);
                enqueueSnackbar('Error fetching lessons', { variant: 'error' });
            }
        }
        
        setDetailModal({ isOpen: true, type });
    };

    const handleCreateActivitiesFromLessons = async () => {
        if (!selectedClass || lessons.length === 0) {
            enqueueSnackbar('No lessons available to create activities', { variant: 'warning' });
            return;
        }

        try {
            const requestData = {
                classId: selectedClass.id,
                lessonIds: lessons.map(lesson => lesson.id)
            };
            
            const response = await createActivitiesFromLessons(requestData);
            if (response && response.success) {
                enqueueSnackbar('Activities created successfully from lessons', { variant: 'success' });
                setDetailModal({ isOpen: false, type: '' });
            } else {
                enqueueSnackbar('Failed to create activities from lessons', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error creating activities:', error);
            enqueueSnackbar('Error creating activities from lessons', { variant: 'error' });
        }
    };

    const handleCloseModal = () => {
        setDetailModal({ isOpen: false, type: '' });
        setSelectedClass(null);
        setSyllabus(null);
        setLessons([]);
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
            field: 'className',
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
                    label={params.value} 
                    color={getStatusColor(params.value)}
                    size="small"
                />
            )
        },
        {
            field: 'teacherId',
            headerName: 'Teacher ID',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'capacity',
            headerName: 'Capacity',
            width: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Info />}
                        onClick={() => handleViewDetails(params.row, 'info')}
                    >
                        Info
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(params.row, 'syllabus')}
                    >
                        Syllabus
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Assignment />}
                        onClick={() => handleViewDetails(params.row, 'lessons')}
                    >
                        Lessons
                    </Button>
                </Box>
            )
        }
    ];

    const renderModalContent = () => {
        switch (detailModal.type) {
            case 'info':
                return (
                    <>
                        <DialogTitle>Class Information</DialogTitle>
                        <DialogContent>
                            {selectedClass && (
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Class Name:</Typography>
                                                <Typography variant="body1">{selectedClass.className}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Grade:</Typography>
                                                <Typography variant="body1">{selectedClass.grade}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Status:</Typography>
                                                <Chip 
                                                    label={selectedClass.status} 
                                                    color={getStatusColor(selectedClass.status)}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Teacher ID:</Typography>
                                                <Typography variant="body1">{selectedClass.teacherId}</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2">Capacity:</Typography>
                                                <Typography variant="body1">{selectedClass.capacity}</Typography>
                                            </Grid>
                                            {selectedClass.description && (
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2">Description:</Typography>
                                                    <Typography variant="body1">{selectedClass.description}</Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}
                        </DialogContent>
                    </>
                );

            case 'syllabus':
                return (
                    <>
                        <DialogTitle>Class Syllabus</DialogTitle>
                        <DialogContent>
                            {syllabus ? (
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {syllabus.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {syllabus.description}
                                        </Typography>
                                        <Typography variant="subtitle2">Duration: {syllabus.duration} weeks</Typography>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Alert severity="info">No syllabus found for this class</Alert>
                            )}
                        </DialogContent>
                    </>
                );

            case 'lessons':
                return (
                    <>
                        <DialogTitle>
                            Class Lessons
                            {lessons.length > 0 && (
                                <Button
                                    sx={{ ml: 2 }}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Assignment />}
                                    onClick={handleCreateActivitiesFromLessons}
                                >
                                    Create Activities from Lessons
                                </Button>
                            )}
                        </DialogTitle>
                        <DialogContent>
                            {lessons.length > 0 ? (
                                <List>
                                    {lessons.map((lesson, index) => (
                                        <React.Fragment key={lesson.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={lesson.topic}
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2">
                                                                Duration: {lesson.duration} minutes
                                                            </Typography>
                                                            {lesson.description && (
                                                                <Typography variant="body2">
                                                                    {lesson.description}
                                                                </Typography>
                                                            )}
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            {index < lessons.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Alert severity="info">No lessons found for this class</Alert>
                            )}
                        </DialogContent>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Class Management
            </Typography>

            <Paper sx={{ height: 600, width: '100%', mb: 2 }}>
                <DataGrid
                    rows={classes}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    loading={loading}
                    disableSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-header': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Paper>

            <Dialog
                open={detailModal.isOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                {renderModalContent()}
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ClassList;