import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    Paper,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ArrowBack,
    School,
    Event,
    CalendarToday,
    Assignment,
    Person,
    Room,
    Schedule,
    Add,
    Edit,
    Delete,
    Visibility
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import ClassesService from '../../services/ClassesService.jsx';
import {
    getSchedulesByClassId,
    getActivitiesByClassId,
    getSyllabusByClassId,
    getLessonsByClassId,
    deleteSchedule,
    deleteActivity,
    createSchedule,
    updateSchedule,
    createActivity,
    updateActivity,
    getAllLessons
} from '../../services/EducationService.jsx';
import ScheduleForm from './ScheduleForm.jsx';

function ClassDetails() {
    const { id: classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [activities, setActivities] = useState([]);
    const [syllabus, setSyllabus] = useState(null);
    const [classLessons, setClassLessons] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [allClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Schedule form modal state
    const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
    const [scheduleFormMode, setScheduleFormMode] = useState('create');
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const fetchAllLessons = useCallback(async () => {
        try {
            const response = await getAllLessons();
            if (response && response.success) {
                setAllLessons(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    }, []);

    const fetchClassDetails = useCallback(async () => {
        try {
            setLoading(true);
            
            // Fetch all class-related data in parallel
            const [
                classResponse,
                schedulesResponse,
                activitiesResponse,
                syllabusResponse,
                lessonsResponse
            ] = await Promise.all([
                ClassesService.getById(classId),
                getSchedulesByClassId(classId),
                getActivitiesByClassId(classId),
                getSyllabusByClassId(classId),
                getLessonsByClassId(classId)
            ]);

            if (classResponse && classResponse.success) {
                setClassData(classResponse.data);
            }

            if (schedulesResponse && schedulesResponse.success) {
                setSchedules(schedulesResponse.data || []);
            }

            if (activitiesResponse && activitiesResponse.success) {
                setActivities(activitiesResponse.data || []);
            }

            if (syllabusResponse && syllabusResponse.success) {
                setSyllabus(syllabusResponse.data);
            }

            if (lessonsResponse && lessonsResponse.success) {
                setClassLessons(lessonsResponse.data || []);
            }

        } catch (error) {
            console.error('Error fetching class details:', error);
            enqueueSnackbar('Failed to load class details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        const fetchData = async () => {
            if (classId) {
                await fetchClassDetails();
                await fetchAllLessons();
            }
        };
        
        fetchData();
    }, [classId, fetchClassDetails, fetchAllLessons]);

    const handleBackToClasses = () => {
        navigate('/education/classes');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    const handleCreateSchedule = () => {
        setSelectedSchedule({
            classId: classId,
            weekNumber: schedules.length + 1,
            note: '',
            activities: []
        });
        setScheduleFormMode('create');
        setScheduleFormOpen(true);
    };

    const handleEditSchedule = (schedule) => {
        // Include activities for editing
        const scheduleWithActivities = {
            ...schedule,
            activities: activities.filter(activity => activity.scheduleId === schedule.id)
        };
        setSelectedSchedule(scheduleWithActivities);
        setScheduleFormMode('edit');
        setScheduleFormOpen(true);
    };

    const handleDeleteSchedule = async (scheduleId, weekNumber) => {
        if (window.confirm(`Are you sure you want to delete Week ${weekNumber} schedule? This will also delete all associated activities.`)) {
            try {
                const response = await deleteSchedule(scheduleId);
                if (response && response.success) {
                    enqueueSnackbar('Schedule deleted successfully', { variant: 'success' });
                    fetchClassDetails(); // Refresh data
                } else {
                    enqueueSnackbar('Failed to delete schedule', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error deleting schedule:', error);
                enqueueSnackbar('Error deleting schedule', { variant: 'error' });
            }
        }
    };

    const handleDeleteActivity = async (activityId, activityTopic) => {
        if (window.confirm(`Are you sure you want to delete the activity "${activityTopic}"?`)) {
            try {
                const response = await deleteActivity(activityId);
                if (response && response.success) {
                    enqueueSnackbar('Activity deleted successfully', { variant: 'success' });
                    fetchClassDetails(); // Refresh data
                } else {
                    enqueueSnackbar('Failed to delete activity', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error deleting activity:', error);
                enqueueSnackbar('Error deleting activity', { variant: 'error' });
            }
        }
    };

    const handleScheduleFormSubmit = async (formData) => {
        try {
            let scheduleResponse;
            
            if (scheduleFormMode === 'create') {
                // Create schedule first
                scheduleResponse = await createSchedule({
                    weekNumber: formData.weekNumber,
                    note: formData.note,
                    classId: formData.classId
                });
                
                if (scheduleResponse && scheduleResponse.success) {
                    const newScheduleId = scheduleResponse.data.id;
                    
                    // Create activities for the new schedule
                    if (formData.activities && formData.activities.length > 0) {
                        for (const activity of formData.activities) {
                            if (activity.topic) { // Only create activities with topics
                                await createActivity({
                                    ...activity,
                                    scheduleId: newScheduleId
                                });
                            }
                        }
                    }
                }
            } else if (scheduleFormMode === 'edit') {
                // Update schedule
                scheduleResponse = await updateSchedule(selectedSchedule.id, {
                    weekNumber: formData.weekNumber,
                    note: formData.note
                });
                
                if (scheduleResponse && scheduleResponse.success) {
                    // Handle activities updates (create new ones, update existing ones)
                    if (formData.activities && formData.activities.length > 0) {
                        for (const activity of formData.activities) {
                            if (activity.topic) { // Only process activities with topics
                                if (activity.id) {
                                    // Update existing activity
                                    await updateActivity(activity.id, {
                                        topic: activity.topic,
                                        description: activity.description,
                                        dayOfWeek: activity.dayOfWeek,
                                        startTime: activity.startTime,
                                        endTime: activity.endTime,
                                        lessonId: activity.lessonId
                                    });
                                } else {
                                    // Create new activity
                                    await createActivity({
                                        ...activity,
                                        scheduleId: selectedSchedule.id
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            if (scheduleResponse && scheduleResponse.success) {
                setScheduleFormOpen(false);
                await fetchClassDetails();
                enqueueSnackbar(
                    scheduleFormMode === 'create' ? 'Schedule created successfully' : 'Schedule updated successfully',
                    { variant: 'success' }
                );
            } else {
                enqueueSnackbar('Failed to save schedule', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error handling schedule form submission:', error);
            enqueueSnackbar('Error saving schedule', { variant: 'error' });
        }
    };

    const groupActivitiesBySchedule = () => {
        const grouped = {};
        schedules.forEach(schedule => {
            grouped[schedule.id] = {
                schedule,
                activities: activities.filter(activity => activity.scheduleId === schedule.id)
            };
        });
        return grouped;
    };

    const renderClassInformation = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: 3 
            }}>
                <Box sx={{ flex: 1 }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <School sx={{ color: '#1976d2' }} />
                            <Typography variant="h6" color="primary">
                                Basic Information
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Class Name</Typography>
                            <Typography variant="h6">{classData?.name || 'Unknown'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Grade</Typography>
                            <Chip label={classData?.grade || 'Not set'} color="primary" size="small" />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Status</Typography>
                            <Chip 
                                label={classData?.status || 'Unknown'} 
                                color={getStatusColor(classData?.status)} 
                                size="small" 
                            />
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ color: '#1976d2' }} />
                            <Typography variant="h6" color="primary">
                                Details
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Teacher</Typography>
                            <Typography variant="body1">
                                {classData?.teacher ? 
                                    `${classData.teacher.firstName} ${classData.teacher.lastName || ''}`.trim() : 
                                    'Not assigned'
                                }
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Room Number</Typography>
                            <Typography variant="body1">{classData?.roomNumber || 'Not assigned'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Capacity</Typography>
                            <Typography variant="body1">{classData?.numberStudent || 0} students</Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarToday sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" color="primary">
                        Schedule Period
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">Start Date</Typography>
                        <Typography variant="body1">{formatDate(classData?.startDate)}</Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1">{formatDate(classData?.endDate)}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    const renderSchedulesAndActivities = () => {
        const groupedData = groupActivitiesBySchedule();
        
        return (
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                        Schedules & Activities ({schedules.length} schedules)
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreateSchedule}
                        size="small"
                    >
                        Create Schedule
                    </Button>
                </Box>

                {schedules.length === 0 ? (
                    <Alert severity="info">
                        No schedules found for this class. Click "Create Schedule" to add one.
                    </Alert>
                ) : (
                    schedules.map((schedule) => {
                        const scheduleActivities = groupedData[schedule.id]?.activities || [];
                        return (
                            <Card key={schedule.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6">
                                                Week {schedule.weekNumber}
                                            </Typography>
                                            {schedule.note && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {schedule.note}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box>
                                            <Tooltip title="Edit Schedule">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditSchedule(schedule)}
                                                    sx={{ color: '#ff9800' }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Schedule">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteSchedule(schedule.id, schedule.weekNumber)}
                                                    sx={{ color: '#f44336' }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    {scheduleActivities.length > 0 ? (
                                        <List dense>
                                            {scheduleActivities.map((activity) => (
                                                <ListItem
                                                    key={activity.id}
                                                    sx={{
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                        backgroundColor: '#fafafa'
                                                    }}
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            size="small"
                                                            onClick={() => handleDeleteActivity(activity.id, activity.topic)}
                                                            sx={{ color: '#f44336' }}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <Event sx={{ color: '#1976d2' }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={activity.topic}
                                                        secondary={
                                                            <>
                                                                {activity.dayOfWeek} • {activity.startTime} - {activity.endTime}
                                                                {activity.description && (
                                                                    <br/>
                                                                )}
                                                                {activity.description}
                                                            </>
                                                        }
                                                        secondaryTypographyProps={{
                                                            variant: 'caption',
                                                            color: 'text.secondary'
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Alert severity="info" sx={{ mt: 1 }}>
                                            No activities scheduled for this week
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </Stack>
        );
    };

    const renderSyllabusInformation = () => (
        <>
            {syllabus ? (
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment sx={{ color: '#1976d2' }} />
                        <Typography variant="h6" color="primary">
                            Syllabus Details
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">Name</Typography>
                        <Typography variant="h6">{syllabus.name || 'Untitled Syllabus'}</Typography>
                    </Box>
                    {syllabus.description && (
                        <Box>
                            <Typography variant="body2" color="text.secondary">Description</Typography>
                            <Typography variant="body1">{syllabus.description}</Typography>
                        </Box>
                    )}
                    <Box>
                        <Typography variant="body2" color="text.secondary">Grade Level</Typography>
                        <Chip label={syllabus.grade || 'Not specified'} color="primary" size="small" />
                    </Box>
                    {classLessons.length > 0 && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Associated Lessons ({classLessons.length})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {classLessons.slice(0, 5).map((lesson) => (
                                    <Chip
                                        key={lesson.id}
                                        label={lesson.topic}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                    />
                                ))}
                                {classLessons.length > 5 && (
                                    <Chip
                                        label={`+${classLessons.length - 5} more`}
                                        size="small"
                                        variant="outlined"
                                    />
                                )}
                            </Box>
                        </Box>
                    )}
                </Stack>
            ) : (
                <Alert severity="info">
                    No syllabus assigned to this class yet.
                </Alert>
            )}
        </>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack sx={{ color: '#1976d2' }} />}
                    onClick={handleBackToClasses}
                    sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            borderColor: '#1976d2'
                        }
                    }}
                >
                    Back to Classes
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Class Details: {classData?.name || 'Loading...'}
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Typography>Loading class details...</Typography>
                </Box>
            ) : (
                <Stack spacing={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                Class Information
                            </Typography>
                            {renderClassInformation()}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                Schedules & Activities
                            </Typography>
                            {renderSchedulesAndActivities()}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                                Syllabus Information
                            </Typography>
                            {renderSyllabusInformation()}
                        </CardContent>
                    </Card>
                </Stack>
            )}

            {/* Schedule Form Modal */}
            <ScheduleForm
                open={scheduleFormOpen}
                onClose={() => setScheduleFormOpen(false)}
                onSubmit={handleScheduleFormSubmit}
                mode={scheduleFormMode}
                initialData={selectedSchedule}
                classes={allClasses.map(cls => ({
                    ...cls,
                    className: cls.name || cls.className
                }))}
                lessons={allLessons}
                loading={false}
            />
        </Box>
    );
}

export default ClassDetails;