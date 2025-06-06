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
    Divider,
    Stack
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
    checkActivityDeletionImpact,
    bulkCreateActivities,
    getAllClasses,
    getAllLessons,
    getAllSchedules
} from '../../services/EducationService.jsx';
import { enqueueSnackbar } from 'notistack';
import '../../styles/manager/ActivityManagement.css';

function ActivityManagement() {
    const [activities, setActivities] = useState([]);
    const [classes, setClasses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    
    const [modal, setModal] = useState({
        isOpen: false,
        type: '' // 'create', 'edit', 'bulk', 'view', 'delete-confirm'
    });

    const [deleteConfirmData, setDeleteConfirmData] = useState({
        activityId: null,
        activityTopic: '',
        impactInfo: null
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
            
            // Handle different types of errors with specific messages
            let errorMessage = 'Failed to load activities. Please check your network connection or login status.';
            
            if (error.status === 401 || error.status === 403) {
                errorMessage = 'Authentication failed. Please log in again to access this page.';
            } else if (error.status === 500) {
                errorMessage = 'Server error occurred. Please try again later or contact support.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            enqueueSnackbar(errorMessage, { variant: 'error' });
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
        
        // Handle different possible field access patterns for lessonId and scheduleId
        const lessonId = activity.lessonId ||
                         activity.lesson?.id ||
                         (activity.getLessonId && activity.getLessonId()) ||
                         '';
                         
        const scheduleId = activity.scheduleId ||
                          activity.schedule?.id ||
                          (activity.getScheduleId && activity.getScheduleId()) ||
                          '';
        
        // Convert dayOfWeek to uppercase to match the dropdown options
        const dayOfWeek = activity.dayOfWeek ? activity.dayOfWeek.toUpperCase() : '';
        
        const formDataToSet = {
            topic: activity.topic || '',
            description: activity.description || '',
            dayOfWeek: dayOfWeek,
            startTime: activity.startTime || '',
            endTime: activity.endTime || '',
            lessonId: lessonId,
            scheduleId: scheduleId
        };
        
        setFormData(formDataToSet);
        setModal({ isOpen: true, type: 'edit' });
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            // First check the deletion impact
            const impactResponse = await checkActivityDeletionImpact(activityId);
            if (impactResponse && impactResponse.success) {
                const impactData = impactResponse.data;
                
                setDeleteConfirmData({
                    activityId: activityId,
                    activityTopic: impactData.activityTopic,
                    impactInfo: impactData
                });
                
                setModal({ isOpen: true, type: 'delete-confirm' });
            } else {
                // Fallback to simple confirmation if impact check fails
                if (window.confirm('Are you sure you want to delete this activity?')) {
                    await performActivityDeletion(activityId);
                }
            }
        } catch (error) {
            console.error('Error checking activity deletion impact:', error);
            // Fallback to simple confirmation
            if (window.confirm('Are you sure you want to delete this activity?')) {
                await performActivityDeletion(activityId);
            }
        }
    };

    const performActivityDeletion = async (activityId) => {
        try {
            const response = await deleteActivity(activityId);
            if (response && response.success) {
                enqueueSnackbar(response.message || 'Activity deleted successfully', { variant: 'success' });
                fetchInitialData();
                handleCloseModal();
            } else {
                enqueueSnackbar('Failed to delete activity', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            
            let errorMessage = 'Error deleting activity';
            if (error.status === 401 || error.status === 403) {
                errorMessage = 'Authentication failed. Please log in again to delete activities.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    const handleConfirmDelete = () => {
        performActivityDeletion(deleteConfirmData.activityId);
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
            
            let errorMessage = `Error ${modal.type === 'create' ? 'creating' : 'updating'} activity`;
            if (error.status === 401 || error.status === 403) {
                errorMessage = 'Authentication failed. Please log in again to modify activities.';
            } else if (error.status === 400) {
                errorMessage = 'Invalid activity data. Please check your inputs and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            enqueueSnackbar(errorMessage, { variant: 'error' });
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
            
            let errorMessage = 'Error creating activities';
            if (error.status === 401 || error.status === 403) {
                errorMessage = 'Authentication failed. Please log in again to create activities.';
            } else if (error.status === 400) {
                errorMessage = 'Invalid bulk activity data. Please check your inputs and try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: '' });
        setSelectedActivity(null);
        setDeleteConfirmData({
            activityId: null,
            activityTopic: '',
            impactInfo: null
        });
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
                params.row.lessonId || params.value || '-'
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
                <Box className="activity-actions-container">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit sx={{ color: 'var(--edit-color)' }} />}
                        onClick={() => handleEditActivity(params.row)}
                        sx={{
                            color: 'var(--edit-color)',
                            borderColor: 'var(--edit-color)',
                            backgroundColor: 'rgba(245, 124, 0, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(245, 124, 0, 0.12)',
                                borderColor: 'var(--edit-color)',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'var(--edit-color) !important'
                            }
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete sx={{ color: 'var(--delete-color)' }} />}
                        onClick={() => handleDeleteActivity(params.row.id)}
                        sx={{
                            color: 'var(--delete-color)',
                            borderColor: 'var(--delete-color)',
                            backgroundColor: 'rgba(211, 47, 47, 0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.12)',
                                borderColor: 'var(--delete-color)',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'var(--delete-color) !important'
                            }
                        }}
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
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Topic"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        required
                    />
                    
                    <FormControl fullWidth required>
                        <InputLabel>Day of Week</InputLabel>
                        <Select
                            key={`dayOfWeek-${selectedActivity?.id || 'new'}-${formData.dayOfWeek}`}
                            value={formData.dayOfWeek || ''}
                            onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                            label="Day of Week"
                        >
                            {daysOfWeek.map((day) => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Start Time"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="End Time"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Schedule</InputLabel>
                        <Select
                            value={formData.scheduleId}
                            onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                            label="Schedule"
                        >
                            <MenuItem value="">None</MenuItem>
                            {schedules.map((schedule) => (
                                <MenuItem key={schedule.id} value={schedule.id}>
                                    Week {schedule.weekNumber} - {schedule.className || 'Unknown Class'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter activity description..."
                    />
                </Stack>
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
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <FormControl fullWidth required>
                        <InputLabel>Target Schedule</InputLabel>
                        <Select
                            value={bulkFormData.scheduleId}
                            onChange={(e) => setBulkFormData({ ...bulkFormData, scheduleId: e.target.value })}
                            label="Target Schedule"
                        >
                            {schedules.map((schedule) => (
                                <MenuItem key={schedule.id} value={schedule.id}>
                                    Week {schedule.weekNumber} - {schedule.className || 'Unknown Class'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {bulkFormData.activities.map((activity, index) => (
                        <Card key={index} sx={{ p: 3, border: '1px solid #e0e0e0' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" color="primary">
                                    Activity {index + 1}
                                </Typography>
                                {bulkFormData.activities.length > 1 && (
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        onClick={() => removeBulkActivity(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Box>
                            
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Topic"
                                    value={activity.topic}
                                    onChange={(e) => updateBulkActivity(index, 'topic', e.target.value)}
                                    required
                                />
                                
                                <FormControl fullWidth required>
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

                                <TextField
                                    fullWidth
                                    label="Start Time"
                                    type="time"
                                    value={activity.startTime}
                                    onChange={(e) => updateBulkActivity(index, 'startTime', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="End Time"
                                    type="time"
                                    value={activity.endTime}
                                    onChange={(e) => updateBulkActivity(index, 'endTime', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />

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

                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={2}
                                    value={activity.description}
                                    onChange={(e) => updateBulkActivity(index, 'description', e.target.value)}
                                    placeholder="Enter activity description..."
                                />
                            </Stack>
                        </Card>
                    ))}

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={addBulkActivity}
                        sx={{
                            mt: 2,
                            py: 2,
                            borderStyle: 'dashed',
                            '&:hover': {
                                borderStyle: 'solid'
                            }
                        }}
                    >
                        Add Another Activity
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleBulkSubmit} variant="contained">
                    Create All Activities
                </Button>
            </DialogActions>
        </>
    );

    const renderDeleteConfirmModal = () => (
        <>
            <DialogTitle sx={{ color: 'error.main' }}>
                Confirm Activity Deletion
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <Alert severity="warning">
                        You are about to delete the activity: <strong>"{deleteConfirmData.activityTopic}"</strong>
                    </Alert>
                    
                    {deleteConfirmData.impactInfo?.hasScheduleImpact && (
                        <Card sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                            <Typography variant="h6" color="warning.main" gutterBottom>
                                Schedule Impact Warning
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Schedule Information"
                                        secondary={`Week ${deleteConfirmData.impactInfo.weekNumber} - ${deleteConfirmData.impactInfo.className || 'Unknown Class'}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Activities in Schedule"
                                        secondary={`${deleteConfirmData.impactInfo.totalActivitiesInSchedule} total activities`}
                                    />
                                </ListItem>
                                {deleteConfirmData.impactInfo.isLastActivityInSchedule && (
                                    <ListItem>
                                        <Alert severity="error" sx={{ width: '100%' }}>
                                            This is the last activity in the schedule. Deleting it may leave the schedule empty.
                                        </Alert>
                                    </ListItem>
                                )}
                            </List>
                        </Card>
                    )}
                    
                    {!deleteConfirmData.impactInfo?.hasScheduleImpact && (
                        <Alert severity="info">
                            This activity is not currently assigned to any schedule. Deletion will not affect any schedules.
                        </Alert>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone. Are you sure you want to proceed?
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                    onClick={handleConfirmDelete}
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                >
                    Delete Activity
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
                {modal.type === 'bulk' ? renderBulkModal() :
                 modal.type === 'delete-confirm' ? renderDeleteConfirmModal() :
                 renderFormModal()}
            </Dialog>
        </Box>
    );
}

export default ActivityManagement;