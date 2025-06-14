import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Card,
    TextField,
    InputAdornment
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import {
    getAllSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getAllClasses,
    getAllLessons,
    bulkCreateActivities,
    getActivitiesByScheduleId,
    createActivity,
    updateActivity,
    deleteActivity
} from '../../services/EducationService.jsx';
import { enqueueSnackbar } from 'notistack';
import ScheduleForm from './ScheduleForm.jsx';
import '../../styles/manager/ActivityManagement.css';

function ScheduleManagement() {
    const [schedules, setSchedules] = useState([]);
    const [classes, setClasses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
      const [modal, setModal] = useState({
        isOpen: false,
        type: '' // 'create', 'edit', 'delete-confirm'
    });

    const [deleteConfirmData, setDeleteConfirmData] = useState({
        scheduleId: null,
        scheduleInfo: '',
        activitiesCount: 0
    });

    const [formLoading, setFormLoading] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [schedulesResponse, classesResponse, lessonsResponse] = await Promise.all([
                getAllSchedules(),
                getAllClasses(),
                getAllLessons()
            ]);

            if (schedulesResponse && schedulesResponse.success) {
                setSchedules(schedulesResponse.data || []);
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


    const handleCreateSchedule = () => {
        setInitialFormData({
            weekNumber: 1,
            note: '',
            classId: '',
            activities: [{
                topic: '',
                description: '',
                dayOfWeek: '',
                startTime: '',
                endTime: '',
                lessonId: ''
            }]
        });
        setModal({ isOpen: true, type: 'create' });
    };

    const handleEditSchedule = async (schedule) => {
        try {
            setSelectedSchedule(schedule);
            
            // Fetch existing activities for this schedule
            let existingActivities = [];
            if (schedule.id) {
                const activitiesResponse = await getActivitiesByScheduleId(schedule.id);
                if (activitiesResponse && activitiesResponse.success) {                    existingActivities = activitiesResponse.data.map(activity => ({
                        id: activity.id, // Keep the ID to distinguish existing vs new activities
                        topic: activity.topic || '',
                        description: activity.description || '',
                        dayOfWeek: activity.dayOfWeek ? activity.dayOfWeek.toUpperCase() : '',
                        startTime: activity.startTime || '',
                        endTime: activity.endTime || '',
                        // Handle both nested and direct lessonId access patterns
                        lessonId: activity.lessonId || activity.lesson?.id || ''
                    }));
                }
            }
            
            // If no existing activities, provide one empty activity template
            if (existingActivities.length === 0) {
                existingActivities = [{
                    topic: '',
                    description: '',
                    dayOfWeek: '',
                    startTime: '',
                    endTime: '',
                    lessonId: ''
                }];
            }
            
            setInitialFormData({
                weekNumber: schedule.weekNumber || 1,
                note: schedule.note || '',
                classId: schedule.classes?.id || '',
                activities: existingActivities
            });
            setModal({ isOpen: true, type: 'edit' });
        } catch (error) {
            console.error('Error fetching activities for edit:', error);
            enqueueSnackbar('Error loading schedule activities', { variant: 'error' });
            
            // Fallback to basic edit without activities
            setSelectedSchedule(schedule);
            setInitialFormData({
                weekNumber: schedule.weekNumber || 1,
                note: schedule.note || '',
                classId: schedule.classes?.id || '',
                activities: [{
                    topic: '',
                    description: '',
                    dayOfWeek: '',
                    startTime: '',
                    endTime: '',
                    lessonId: ''
                }]
            });
            setModal({ isOpen: true, type: 'edit' });
        }
    };    const handleDeleteSchedule = async (scheduleId, scheduleData) => {
        try {
            // Set up delete confirmation data
            const schedule = schedules.find(s => s.id === scheduleId) || scheduleData;
            const activitiesCount = schedule?.activities?.length || 0;
            const scheduleInfo = `Week ${schedule?.weekNumber || 'Unknown'} - ${schedule?.classes?.name || 'Unknown Class'}`;
            
            setDeleteConfirmData({
                scheduleId: scheduleId,
                scheduleInfo: scheduleInfo,
                activitiesCount: activitiesCount
            });
            
            setModal({ isOpen: true, type: 'delete-confirm' });
        } catch (error) {
            console.error('Error preparing schedule deletion:', error);
            enqueueSnackbar('Error preparing to delete schedule', { variant: 'error' });
        }
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await deleteSchedule(deleteConfirmData.scheduleId);
            if (response && response.success) {
                enqueueSnackbar('Schedule deleted successfully', { variant: 'success' });
                fetchInitialData();
                handleCloseModal();
            } else {
                enqueueSnackbar('Failed to delete schedule', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            enqueueSnackbar('Error deleting schedule', { variant: 'error' });
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            setFormLoading(true);

            const scheduleData = {
                weekNumber: formData.weekNumber,
                note: formData.note,
                classId: parseInt(formData.classId)
            };

            let scheduleResponse;
            if (modal.type === 'create') {
                scheduleResponse = await createSchedule(scheduleData);
            } else if (modal.type === 'edit') {
                scheduleResponse = await updateSchedule(selectedSchedule.id, scheduleData);
            }

            if (scheduleResponse && scheduleResponse.success) {
                let activityResults = { success: 0, failed: 0, errors: [] };
                
                if (modal.type === 'create') {
                    // Create activities for new schedules
                    if (formData.activities.length > 0 &&
                        formData.activities.some(activity => activity.topic.trim())) {
                        
                        const scheduleId = scheduleResponse.data?.id;
                        if (scheduleId) {
                            activityResults = await createScheduleActivities(scheduleId, formData.activities);
                        }
                    }
                } else if (modal.type === 'edit') {
                    // Handle activity updates for existing schedules
                    const scheduleId = selectedSchedule.id;
                    activityResults = await handleActivityUpdates(scheduleId, formData.activities);
                }

                // Show appropriate success message
                if (activityResults.success > 0 && activityResults.failed === 0) {
                    enqueueSnackbar(
                        `Schedule ${modal.type === 'create' ? 'created' : 'updated'} successfully with ${activityResults.success} activities`,
                        { variant: 'success' }
                    );
                } else if (activityResults.success > 0 && activityResults.failed > 0) {
                    enqueueSnackbar(
                        `Schedule ${modal.type === 'create' ? 'created' : 'updated'} successfully. ${activityResults.success} activities processed, ${activityResults.failed} failed`,
                        { variant: 'warning' }
                    );
                } else if (activityResults.failed > 0) {
                    enqueueSnackbar(
                        `Schedule ${modal.type === 'create' ? 'created' : 'updated'} successfully, but ${activityResults.failed} activities failed`,
                        { variant: 'warning' }
                    );
                } else {
                    enqueueSnackbar(
                        `Schedule ${modal.type === 'create' ? 'created' : 'updated'} successfully`,
                        { variant: 'success' }
                    );
                }

                handleCloseModal();
                fetchInitialData();
            } else {
                enqueueSnackbar(
                    `Failed to ${modal.type} schedule`,
                    { variant: 'error' }
                );
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            enqueueSnackbar(`Error ${modal.type === 'create' ? 'creating' : 'updating'} schedule`, { variant: 'error' });
        } finally {
            setFormLoading(false);
        }
    };

    const createScheduleActivities = async (scheduleId, activities) => {
        const results = { success: 0, failed: 0, errors: [] };
        
        const validActivities = activities.filter(activity =>
            activity.topic.trim() &&
            activity.dayOfWeek &&
            activity.startTime &&
            activity.endTime
        );

        if (validActivities.length === 0) {
            return results;
        }

        try {
            // Use bulk create for better performance
            const bulkData = {
                scheduleId: scheduleId,
                activities: validActivities.map(activity => ({
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
                results.success = validActivities.length;
            } else {
                results.failed = validActivities.length;
                results.errors.push('Failed to create activities');
            }
        } catch (error) {
            console.error('Error creating activities:', error);
            results.failed = validActivities.length;
            results.errors.push(error.message || 'Unknown error creating activities');
        }

        return results;
    };

    const handleActivityUpdates = async (scheduleId, formActivities) => {
        const results = { success: 0, failed: 0, errors: [] };
        
        try {
            // Get current activities from the database
            const currentActivitiesResponse = await getActivitiesByScheduleId(scheduleId);
            const currentActivities = currentActivitiesResponse?.success ? currentActivitiesResponse.data : [];
            
            // Separate existing activities (with IDs) from new activities (without IDs)
            const existingActivities = formActivities.filter(activity => activity.id);
            const newActivities = formActivities.filter(activity => !activity.id && activity.topic.trim());
            
            // Find activities to delete (current activities not in form)
            const activitiesToDelete = currentActivities.filter(current =>
                !existingActivities.some(existing => existing.id === current.id)
            );
            
            // Delete removed activities
            for (const activity of activitiesToDelete) {
                try {
                    const deleteResponse = await deleteActivity(activity.id);
                    if (deleteResponse?.success) {
                        results.success++;
                    } else {
                        results.failed++;
                        results.errors.push(`Failed to delete activity: ${activity.topic}`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(`Error deleting activity: ${activity.topic}`);
                }
            }
            
            // Update existing activities
            for (const activity of existingActivities) {
                if (!activity.topic.trim()) continue; // Skip empty activities
                
                try {
                    const updateData = {
                        topic: activity.topic,
                        description: activity.description,
                        dayOfWeek: activity.dayOfWeek,
                        startTime: activity.startTime,
                        endTime: activity.endTime,
                        lessonId: activity.lessonId ? parseInt(activity.lessonId) : null
                    };
                    
                    const updateResponse = await updateActivity(activity.id, updateData);
                    if (updateResponse?.success) {
                        results.success++;
                    } else {
                        results.failed++;
                        results.errors.push(`Failed to update activity: ${activity.topic}`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(`Error updating activity: ${activity.topic}`);
                }
            }
            
            // Create new activities
            for (const activity of newActivities) {
                try {
                    const createData = {
                        topic: activity.topic,
                        description: activity.description,
                        dayOfWeek: activity.dayOfWeek,
                        startTime: activity.startTime,
                        endTime: activity.endTime,
                        scheduleId: scheduleId,
                        lessonId: activity.lessonId ? parseInt(activity.lessonId) : null
                    };
                    
                    const createResponse = await createActivity(createData);
                    if (createResponse?.success) {
                        results.success++;
                    } else {
                        results.failed++;
                        results.errors.push(`Failed to create activity: ${activity.topic}`);
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push(`Error creating activity: ${activity.topic}`);
                }
            }
            
        } catch (error) {
            console.error('Error in handleActivityUpdates:', error);
            results.failed++;
            results.errors.push('Error processing activity updates');
        }
        
        return results;
    };    const handleCloseModal = () => {
        setModal({ isOpen: false, type: '' });
        setSelectedSchedule(null);
        setWeeklySchedule([]);
        setInitialFormData(null);
        setFormLoading(false);
        setDeleteConfirmData({
            scheduleId: null,
            scheduleInfo: '',
            activitiesCount: 0
        });
    };

    const getDayColor = (day) => {
        const colors = {
            'MONDAY': 'primary',
            'TUESDAY': 'secondary',
            'WEDNESDAY': 'success',
            'THURSDAY': 'warning',
            'FRIDAY': 'error',
            'SATURDAY': 'info',
            'SUNDAY': 'default'
        };
        return colors[day] || 'default';
    };

    // Filter schedules based on search term
    const filteredSchedules = schedules.filter(schedule => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        return (
            schedule.weekNumber?.toString().includes(searchLower) ||
            schedule.note?.toLowerCase().includes(searchLower) ||
            schedule.classes?.name?.toLowerCase().includes(searchLower) ||
            schedule.classes?.grade?.toLowerCase().includes(searchLower) ||
            schedule.activities?.some(activity =>
                activity.topic?.toLowerCase().includes(searchLower) ||
                activity.description?.toLowerCase().includes(searchLower) ||
                activity.dayOfWeek?.toLowerCase().includes(searchLower)
            )
        );
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'weekNumber',
            headerName: 'Week',
            width: 80,
            headerAlign: 'center',
            align: 'center'        },        {
            field: 'note',
            headerName: 'Note',
            width: 300,
            headerAlign: 'center',
            align: 'center'
        },        {
            field: 'className',
            headerName: 'Class',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.row.classes?.name || '-'
            )
        },
        {
            field: 'grade',
            headerName: 'Grade',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.row.classes?.grade || '-'
            )
        },        
        {
            field: 'activitiesCount',
            headerName: 'Activities',
            width: 350,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => {
                const activities = params.row.activities;
                
                if (!activities || activities.length === 0) {
                    return (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            No activities
                        </Typography>
                    );
                }

                const maxDisplayed = 2;
                const displayedActivities = activities.slice(0, maxDisplayed);
                const remainingCount = activities.length - maxDisplayed;

                return (
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        alignItems: 'center',
                        maxWidth: '100%'
                    }}>
                        {displayedActivities.map((activity, index) => (
                            <Chip
                                key={index}
                                label={`${activity.topic} (${activity.dayOfWeek.slice(0, 3)} ${activity.startTime})`}
                                size="small"
                                color={getDayColor(activity.dayOfWeek)}
                                sx={{
                                    fontSize: '0.75rem',
                                    height: '24px',
                                    maxWidth: '160px',
                                    '& .MuiChip-label': {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            />
                        ))}
                        {remainingCount > 0 && (
                            <Chip
                                label={`+${remainingCount} more`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: '24px',
                                    color: 'text.secondary',
                                    borderColor: 'text.secondary'
                                }}
                            />
                        )}
                    </Box>
                );
            }        },        {
            field: 'actions',
            headerName: 'Actions',
            width: 400,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box className="activity-actions-container">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit sx={{ color: 'var(--edit-color)' }} />}
                        onClick={() => handleEditSchedule(params.row)}
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
                        onClick={() => handleDeleteSchedule(params.row.id)}
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
    const renderDeleteConfirmModal = () => (
        <>
            <DialogTitle sx={{ color: 'error.main' }}>
                Confirm Schedule Deletion
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <Alert severity="warning">
                        You are about to delete the schedule: <strong>"{deleteConfirmData.scheduleInfo}"</strong>
                    </Alert>
                    
                    {deleteConfirmData.activitiesCount > 0 && (
                        <Card sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                            <Typography variant="h6" color="warning.main" gutterBottom>
                                Activities Impact Warning
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Schedule Information"
                                        secondary={deleteConfirmData.scheduleInfo}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Activities in Schedule"
                                        secondary={`${deleteConfirmData.activitiesCount} activities will be deleted`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Alert severity="error" sx={{ width: '100%' }}>
                                        Deleting this schedule will also permanently remove all {deleteConfirmData.activitiesCount} associated activities.
                                    </Alert>
                                </ListItem>
                            </List>
                        </Card>
                    )}
                    
                    {deleteConfirmData.activitiesCount === 0 && (
                        <Alert severity="info">
                            This schedule has no associated activities. Only the schedule will be deleted.
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
                    Delete Schedule
                </Button>
            </DialogActions>
        </>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Schedule Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateSchedule}
                >
                    Create Schedule
                </Button>
            </Box>

            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search schedules by week number, note, class name, grade, or activity details..."
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
                    rows={filteredSchedules}
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

            {/* ScheduleForm Component */}
            <ScheduleForm
                open={modal.isOpen && (modal.type === 'create' || modal.type === 'edit')}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                mode={modal.type}
                initialData={initialFormData}
                classes={classes}
                lessons={lessons}
                loading={formLoading}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={modal.isOpen && modal.type === 'delete-confirm'}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                {renderDeleteConfirmModal()}
            </Dialog>
        </Box>
    );
}

export default ScheduleManagement;