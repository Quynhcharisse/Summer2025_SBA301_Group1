import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Card,
    CardContent,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Assignment, PostAdd } from '@mui/icons-material';
import {
    getAllActivities,
    getActivitiesByClassId,
    getActivitiesByLessonId,
    createActivity,
    updateActivity,
    deleteActivity,
    bulkCreateActivities,
    getAllClasses,
    getAllLessons
} from '../../services/ManagerService.jsx';
import { enqueueSnackbar } from 'notistack';

function ActivityManagement() {
    const [activities, setActivities] = useState([]);
    const [classes, setClasses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    
    const [modal, setModal] = useState({
        isOpen: false,
        type: '' // 'create', 'edit', 'bulk', 'view'
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        activityType: '',
        duration: '',
        difficulty: '',
        materials: '',
        instructions: '',
        lessonId: '',
        classId: ''
    });

    const [bulkFormData, setBulkFormData] = useState({
        classId: '',
        activities: [
            {
                title: '',
                description: '',
                activityType: '',
                duration: '',
                difficulty: '',
                materials: '',
                instructions: ''
            }
        ]
    });

    const activityTypes = ['LESSON', 'EXERCISE', 'PROJECT', 'ASSESSMENT', 'DISCUSSION', 'PRESENTATION'];
    const difficulties = ['EASY', 'MEDIUM', 'HARD'];

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [activitiesResponse, classesResponse, lessonsResponse] = await Promise.all([
                getAllActivities(),
                getAllClasses(),
                getAllLessons()
            ]);

            if (activitiesResponse && activitiesResponse.success) {
                setActivities(activitiesResponse.data || []);
            }

            if (classesResponse && classesResponse.success) {
                setClasses(classesResponse.data || []);
            }

            if (lessonsResponse && lessonsResponse.success) {
                setLessons(lessonsResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Error fetching data', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateActivity = () => {
        setFormData({
            title: '',
            description: '',
            activityType: '',
            duration: '',
            difficulty: '',
            materials: '',
            instructions: '',
            lessonId: '',
            classId: ''
        });
        setModal({ isOpen: true, type: 'create' });
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setFormData({
            title: activity.title || '',
            description: activity.description || '',
            activityType: activity.activityType || '',
            duration: activity.duration || '',
            difficulty: activity.difficulty || '',
            materials: activity.materials || '',
            instructions: activity.instructions || '',
            lessonId: activity.lessonId || '',
            classId: activity.classId || ''
        });
        setModal({ isOpen: true, type: 'edit' });
    };

    const handleDeleteActivity = async (activityId) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                const response = await deleteActivity(activityId);
                if (response && response.success) {
                    enqueueSnackbar('Activity deleted successfully', { variant: 'success' });
                    fetchInitialData();
                } else {
                    enqueueSnackbar('Failed to delete activity', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error deleting activity:', error);
                enqueueSnackbar('Error deleting activity', { variant: 'error' });
            }
        }
    };

    const handleFormSubmit = async () => {
        try {
            const activityData = {
                title: formData.title,
                description: formData.description,
                activityType: formData.activityType,
                duration: parseInt(formData.duration),
                difficulty: formData.difficulty,
                materials: formData.materials,
                instructions: formData.instructions,
                lessonId: formData.lessonId ? parseInt(formData.lessonId) : null
            };

            let response;
            if (modal.type === 'create') {
                response = await createActivity(activityData);
            } else if (modal.type === 'edit') {
                response = await updateActivity(selectedActivity.id, activityData);
            }

            if (response && response.success) {
                enqueueSnackbar(
                    `Activity ${modal.type === 'create' ? 'created' : 'updated'} successfully`,
                    { variant: 'success' }
                );
                handleCloseModal();
                fetchInitialData();
            } else {
                enqueueSnackbar(
                    `Failed to ${modal.type} activity`,
                    { variant: 'error' }
                );
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            enqueueSnackbar(`Error ${modal.type === 'create' ? 'creating' : 'updating'} activity`, { variant: 'error' });
        }
    };

    const handleBulkCreate = () => {
        setBulkFormData({
            classId: '',
            activities: [
                {
                    title: '',
                    description: '',
                    activityType: '',
                    duration: '',
                    difficulty: '',
                    materials: '',
                    instructions: ''
                }
            ]
        });
        setModal({ isOpen: true, type: 'bulk' });
    };

    const addBulkActivity = () => {
        setBulkFormData({
            ...bulkFormData,
            activities: [
                ...bulkFormData.activities,
                {
                    title: '',
                    description: '',
                    activityType: '',
                    duration: '',
                    difficulty: '',
                    materials: '',
                    instructions: ''
                }
            ]
        });
    };

    const removeBulkActivity = (index) => {
        const newActivities = bulkFormData.activities.filter((_, i) => i !== index);
        setBulkFormData({
            ...bulkFormData,
            activities: newActivities
        });
    };

    const updateBulkActivity = (index, field, value) => {
        const newActivities = [...bulkFormData.activities];
        newActivities[index][field] = value;
        setBulkFormData({
            ...bulkFormData,
            activities: newActivities
        });
    };

    const handleBulkSubmit = async () => {
        try {
            const bulkData = {
                classId: parseInt(bulkFormData.classId),
                activities: bulkFormData.activities.map(activity => ({
                    ...activity,
                    duration: parseInt(activity.duration)
                }))
            };

            const response = await bulkCreateActivities(bulkData);
            if (response && response.success) {
                enqueueSnackbar('Activities created successfully', { variant: 'success' });
                handleCloseModal();
                fetchInitialData();
            } else {
                enqueueSnackbar('Failed to create activities', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error creating bulk activities:', error);
            enqueueSnackbar('Error creating activities', { variant: 'error' });
        }
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: '' });
        setSelectedActivity(null);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'success';
            case 'medium': return 'warning';
            case 'hard': return 'error';
            default: return 'default';
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            'LESSON': 'primary',
            'EXERCISE': 'secondary',
            'PROJECT': 'info',
            'ASSESSMENT': 'warning',
            'DISCUSSION': 'success',
            'PRESENTATION': 'error'
        };
        return colors[type] || 'default';
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
            field: 'title',
            headerName: 'Title',
            width: 200,
            headerAlign: 'center'
        },
        {
            field: 'activityType',
            headerName: 'Type',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    color={getTypeColor(params.value)}
                    size="small"
                />
            )
        },
        {
            field: 'duration',
            headerName: 'Duration (min)',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'difficulty',
            headerName: 'Difficulty',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    color={getDifficultyColor(params.value)}
                    size="small"
                />
            )
        },
        {
            field: 'lessonId',
            headerName: 'Lesson ID',
            width: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 200,
            headerAlign: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEditActivity(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteActivity(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    const renderFormModal = () => (
        <>
            <DialogTitle>
                {modal.type === 'create' ? 'Create New Activity' : 'Edit Activity'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Activity Type</InputLabel>
                            <Select
                                value={formData.activityType}
                                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                                label="Activity Type"
                            >
                                {activityTypes.map((type) => (
                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Duration (minutes)"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                label="Difficulty"
                            >
                                {difficulties.map((difficulty) => (
                                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Lesson (Optional)</InputLabel>
                            <Select
                                value={formData.lessonId}
                                onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                                label="Lesson (Optional)"
                            >
                                <MenuItem value="">None</MenuItem>
                                {lessons.map((lesson) => (
                                    <MenuItem key={lesson.id} value={lesson.id}>
                                        {lesson.topic}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Materials"
                            multiline
                            rows={2}
                            value={formData.materials}
                            onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Instructions"
                            multiline
                            rows={3}
                            value={formData.instructions}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleFormSubmit} variant="contained">
                    {modal.type === 'create' ? 'Create' : 'Update'}
                </Button>
            </DialogActions>
        </>
    );

    const renderBulkModal = () => (
        <>
            <DialogTitle>Bulk Create Activities</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Target Class</InputLabel>
                        <Select
                            value={bulkFormData.classId}
                            onChange={(e) => setBulkFormData({ ...bulkFormData, classId: e.target.value })}
                            label="Target Class"
                        >
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.className} (Grade {cls.grade})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {bulkFormData.activities.map((activity, index) => (
                    <Card key={index} sx={{ mb: 2, p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Activity {index + 1}
                            {bulkFormData.activities.length > 1 && (
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => removeBulkActivity(index)}
                                    sx={{ ml: 2 }}
                                >
                                    Remove
                                </Button>
                            )}
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={activity.title}
                                    onChange={(e) => updateBulkActivity(index, 'title', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={activity.activityType}
                                        onChange={(e) => updateBulkActivity(index, 'activityType', e.target.value)}
                                        label="Type"
                                    >
                                        {activityTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Duration (min)"
                                    type="number"
                                    value={activity.duration}
                                    onChange={(e) => updateBulkActivity(index, 'duration', e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        value={activity.difficulty}
                                        onChange={(e) => updateBulkActivity(index, 'difficulty', e.target.value)}
                                        label="Difficulty"
                                    >
                                        {difficulties.map((difficulty) => (
                                            <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={2}
                                    value={activity.description}
                                    onChange={(e) => updateBulkActivity(index, 'description', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                ))}

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addBulkActivity}
                    sx={{ mt: 2 }}
                >
                    Add Another Activity
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleBulkSubmit} variant="contained">
                    Create All Activities
                </Button>
            </DialogActions>
        </>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Activity Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<PostAdd />}
                        onClick={handleBulkCreate}
                    >
                        Bulk Create
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateActivity}
                    >
                        Create Activity
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={activities}
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
                open={modal.isOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                {modal.type === 'bulk' ? renderBulkModal() : renderFormModal()}
            </Dialog>
        </Box>
    );
}

export default ActivityManagement;