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
    getAllLessons,
    getAllSchedules
} from '../../services/ManagerService.jsx';
import { enqueueSnackbar } from 'notistack';

function ActivityManagement() {
    const [activities, setActivities] = useState([]);
    const [classes, setClasses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    
    const [modal, setModal] = useState({
        isOpen: false,
        type: '' // 'create', 'edit', 'bulk', 'view'
    });

    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        lessonId: '',
        scheduleId: ''
    });

    const [bulkFormData, setBulkFormData] = useState({
        scheduleId: '',
        activities: [
            {
                topic: '',
                description: '',
                dayOfWeek: '',
                startTime: '',
                endTime: '',
                lessonId: ''
            }
        ]
    });

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [activitiesResponse, classesResponse, lessonsResponse, schedulesResponse] = await Promise.all([
                getAllActivities(),
                getAllClasses(),
                getAllLessons(),
                getAllSchedules()
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

            if (schedulesResponse && schedulesResponse.success) {
                setSchedules(schedulesResponse.data || []);
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
            topic: '',
            description: '',
            dayOfWeek: '',
            startTime: '',
            endTime: '',
            lessonId: '',
            scheduleId: ''
        });
        setModal({ isOpen: true, type: 'create' });
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setFormData({
            topic: activity.topic || '',
            description: activity.description || '',
            dayOfWeek: activity.dayOfWeek || '',
            startTime: activity.startTime || '',
            endTime: activity.endTime || '',
            lessonId: activity.lesson?.id || activity.lessonId || '',
            scheduleId: activity.schedule?.id || activity.scheduleId || ''
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
                topic: formData.topic,
                description: formData.description,
                dayOfWeek: formData.dayOfWeek,
                startTime: formData.startTime,
                endTime: formData.endTime,
                scheduleId: formData.scheduleId ? parseInt(formData.scheduleId) : null,
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
            scheduleId: '',
            activities: [
                {
                    topic: '',
                    description: '',
                    dayOfWeek: '',
                    startTime: '',
                    endTime: '',
                    lessonId: ''
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
                    topic: '',
                    description: '',
                    dayOfWeek: '',
                    startTime: '',
                    endTime: '',
                    lessonId: ''
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
                scheduleId: parseInt(bulkFormData.scheduleId),
                activities: bulkFormData.activities.map(activity => ({
                    topic: activity.topic,
                    description: activity.description,
                    dayOfWeek: activity.dayOfWeek,
                    startTime: activity.startTime,
                    endTime: activity.endTime,
                    lessonId: activity.lessonId ? parseInt(activity.lessonId) : null
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
            field: 'topic',
            headerName: 'Topic',
            width: 200,
            headerAlign: 'center'
        },
        {
            field: 'dayOfWeek',
            headerName: 'Day of Week',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color="primary"
                    size="small"
                />
            )
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'endTime',
            headerName: 'End Time',
            width: 120,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'lessonId',
            headerName: 'Lesson ID',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.row.lesson?.id || params.value || '-'
            )
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
                            label="Topic"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Day of Week</InputLabel>
                            <Select
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                label="Day of Week"
                            >
                                {daysOfWeek.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Start Time"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="End Time"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Schedule</InputLabel>
                            <Select
                                value={formData.scheduleId}
                                onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                                label="Schedule"
                            >
                                <MenuItem value="">None</MenuItem>
                                {schedules.map((schedule) => (
                                    <MenuItem key={schedule.id} value={schedule.id}>
                                        Week {schedule.weekNumber} - {schedule.classes?.className || 'Unknown Class'}
                                    </MenuItem>
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
                        <InputLabel>Target Schedule</InputLabel>
                        <Select
                            value={bulkFormData.scheduleId}
                            onChange={(e) => setBulkFormData({ ...bulkFormData, scheduleId: e.target.value })}
                            label="Target Schedule"
                        >
                            {schedules.map((schedule) => (
                                <MenuItem key={schedule.id} value={schedule.id}>
                                    Week {schedule.weekNumber} - {schedule.classes?.className || 'Unknown Class'}
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
                                    label="Topic"
                                    value={activity.topic}
                                    onChange={(e) => updateBulkActivity(index, 'topic', e.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Day of Week</InputLabel>
                                    <Select
                                        value={activity.dayOfWeek}
                                        onChange={(e) => updateBulkActivity(index, 'dayOfWeek', e.target.value)}
                                        label="Day of Week"
                                    >
                                        {daysOfWeek.map((day) => (
                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Start Time"
                                    type="time"
                                    value={activity.startTime}
                                    onChange={(e) => updateBulkActivity(index, 'startTime', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="End Time"
                                    type="time"
                                    value={activity.endTime}
                                    onChange={(e) => updateBulkActivity(index, 'endTime', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Lesson (Optional)</InputLabel>
                                    <Select
                                        value={activity.lessonId}
                                        onChange={(e) => updateBulkActivity(index, 'lessonId', e.target.value)}
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