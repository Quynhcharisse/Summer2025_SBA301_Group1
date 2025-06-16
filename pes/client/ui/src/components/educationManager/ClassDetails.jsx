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
    Tooltip,
    TextField
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
    Visibility,
    ChevronLeft,
    ChevronRight
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
    getAllLessons,
    getAllClasses
} from '../../services/EducationService.jsx';
import ScheduleForm from './ScheduleForm.jsx';
import ActivityForm from './ActivityForm.jsx';
import '../../styles/manager/ScheduleManagement.css';

function ClassDetails() {
    const { id: classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [activities, setActivities] = useState([]);
    const [syllabus, setSyllabus] = useState(null);
    const [classLessons, setClassLessons] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Week navigation state
    const [currentWeek, setCurrentWeek] = useState(1);
    const [weekInput, setWeekInput] = useState('1');
    
    // Schedule form modal state
    const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
    const [scheduleFormMode, setScheduleFormMode] = useState('create');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    
    // Activity form modal state
    const [activityFormOpen, setActivityFormOpen] = useState(false);
    const [activityFormMode, setActivityFormMode] = useState('create');
    const [selectedActivity, setSelectedActivity] = useState(null);

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

    const fetchAllClasses = useCallback(async () => {
        try {
            const response = await getAllClasses();
            if (response && response.success) {
                setAllClasses(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
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
                await fetchAllClasses();
            }
        };
        
        fetchData();
    }, [classId, fetchClassDetails, fetchAllLessons, fetchAllClasses]);

    // Initialize current week when schedules are loaded
    useEffect(() => {
        if (schedules.length > 0) {
            const firstWeek = Math.min(...schedules.map(s => s.weekNumber));
            if (currentWeek === 1 && firstWeek !== 1) {
                setCurrentWeek(firstWeek);
                setWeekInput(firstWeek.toString());
            }
        }
    }, [schedules, currentWeek]);

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

    // Week navigation functions
    const handlePreviousWeek = () => {
        if (currentWeek > 1) {
            const newWeek = currentWeek - 1;
            setCurrentWeek(newWeek);
            setWeekInput(newWeek.toString());
        }
    };

    const handleNextWeek = () => {
        const maxWeek = Math.max(...schedules.map(s => s.weekNumber), 0);
        if (currentWeek < maxWeek + 1) {
            const newWeek = currentWeek + 1;
            setCurrentWeek(newWeek);
            setWeekInput(newWeek.toString());
        }
    };

    const handleWeekInputChange = (event) => {
        const value = event.target.value;
        setWeekInput(value);
        
        const weekNum = parseInt(value);
        if (!isNaN(weekNum) && weekNum > 0) {
            setCurrentWeek(weekNum);
        }
    };

    const getCurrentWeekSchedule = () => {
        return schedules.find(schedule => schedule.weekNumber === currentWeek);
    };

    const getCurrentWeekActivities = () => {
        const weekSchedule = getCurrentWeekSchedule();
        if (!weekSchedule) return [];
        return activities.filter(activity => activity.scheduleId === weekSchedule.id);
    };

    const groupActivitiesByDay = () => {
        const weekActivities = getCurrentWeekActivities();
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        const grouped = {};
        
        days.forEach(day => {
            grouped[day] = weekActivities.filter(activity =>
                activity.dayOfWeek?.toUpperCase() === day
            );
        });
        
        return grouped;
    };

    const handleCreateSchedule = () => {
        setSelectedSchedule({
            classId: classId,
            weekNumber: currentWeek,
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

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setActivityFormMode('edit');
        setActivityFormOpen(true);
    };

    const handleCreateActivity = (scheduleId) => {
        setSelectedActivity({ scheduleId });
        setActivityFormMode('create');
        setActivityFormOpen(true);
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

    const handleActivityFormSubmit = async (activityData) => {
        try {
            let response;
            
            if (activityFormMode === 'create') {
                response = await createActivity(activityData);
            } else if (activityFormMode === 'edit') {
                response = await updateActivity(selectedActivity.id, {
                    topic: activityData.topic,
                    description: activityData.description,
                    dayOfWeek: activityData.dayOfWeek,
                    startTime: activityData.startTime,
                    endTime: activityData.endTime,
                    lessonId: activityData.lessonId
                });
            }
            
            if (response && response.success) {
                setActivityFormOpen(false);
                await fetchClassDetails();
                enqueueSnackbar(
                    activityFormMode === 'create' ? 'Activity created successfully' : 'Activity updated successfully',
                    { variant: 'success' }
                );
            } else {
                enqueueSnackbar('Failed to save activity', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error handling activity form submission:', error);
            enqueueSnackbar('Error saving activity', { variant: 'error' });
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
                                {classData?.teacher?.name || 'Not assigned'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Room Number</Typography>
                            <Typography variant="body1">{classData?.roomNumber || 'Not assigned'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Number of Students</Typography>
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
            
            {/* Syllabus Section */}
            <Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Assignment sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" color="primary">
                        Syllabus Information
                    </Typography>
                </Box>
                {syllabus ? (
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Syllabus Name</Typography>
                            <Typography variant="body1">{syllabus.title || 'Untitled Syllabus'}</Typography>
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
            </Box>
        </Box>
    );

    const renderSchedulesAndActivities = () => {
        const currentWeekSchedule = getCurrentWeekSchedule();
        const activitiesByDay = groupActivitiesByDay();
        const days = [
            { key: 'MONDAY', label: 'Monday' },
            { key: 'TUESDAY', label: 'Tuesday' },
            { key: 'WEDNESDAY', label: 'Wednesday' },
            { key: 'THURSDAY', label: 'Thursday' },
            { key: 'FRIDAY', label: 'Friday' }
        ];
        
        const maxWeek = Math.max(...schedules.map(s => s.weekNumber), 0);
        
        return (
            <Stack spacing={3}>
                {/* Header with navigation controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" color="primary">
                        Weekly Schedule & Activities
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

                {/* Week Navigation Controls */}
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <IconButton
                            onClick={handlePreviousWeek}
                            disabled={currentWeek <= 1}
                            sx={{
                                bgcolor: 'white',
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                    bgcolor: '#f5f5f5'
                                },
                                '&:disabled': {
                                    bgcolor: '#fafafa',
                                    color: '#ccc'
                                }
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" fontWeight="500">
                                Week
                            </Typography>
                            <TextField
                                size="small"
                                value={weekInput}
                                onChange={handleWeekInputChange}
                                type="number"
                                inputProps={{
                                    min: 1,
                                    style: { textAlign: 'center', width: '60px' }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'white',
                                        height: '40px'
                                    }
                                }}
                            />
                        </Box>
                        
                        <IconButton
                            onClick={handleNextWeek}
                            sx={{
                                bgcolor: 'white',
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                    bgcolor: '#f5f5f5'
                                }
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                    
                    {/* Week info and actions */}
                    {currentWeekSchedule && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600">
                                        Week {currentWeek}
                                    </Typography>
                                    {currentWeekSchedule.note && (
                                        <Typography variant="body2" color="text.secondary">
                                            {currentWeekSchedule.note}
                                        </Typography>
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Edit Schedule">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditSchedule(currentWeekSchedule)}
                                            sx={{
                                                bgcolor: '#1976d2',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#1565c0'
                                                }
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Schedule">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteSchedule(currentWeekSchedule.id, currentWeekSchedule.weekNumber)}
                                            sx={{
                                                bgcolor: '#f44336',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: '#d32f2f'
                                                }
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Paper>

                {/* 5-Column Daily Activities Grid */}
                {currentWeekSchedule ? (
                    <Grid container spacing={2}>
                        {days.map((day) => (
                            <Grid item xs={12} sm={6} md={2.4} key={day.key}>
                                <Card sx={{ height: '100%', minHeight: '300px' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="h6"
                                            color="primary"
                                            sx={{
                                                mb: 2,
                                                textAlign: 'center',
                                                fontSize: '1rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            {day.label}
                                        </Typography>
                                        
                                        <Stack spacing={1}>
                                            {activitiesByDay[day.key]?.length > 0 ? (
                                                activitiesByDay[day.key].map((activity) => (
                                                    <Card
                                                        key={activity.id}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                boxShadow: 2,
                                                                transform: 'translateY(-2px)'
                                                            }
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#1976d2',
                                                                mb: 0.5
                                                            }}
                                                        >
                                                            {activity.topic}
                                                        </Typography>
                                                        
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                display: 'block',
                                                                mb: 0.5,
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {activity.startTime} - {activity.endTime}
                                                        </Typography>
                                                        
                                                        {activity.description && (
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{
                                                                    display: 'block',
                                                                    fontSize: '0.7rem',
                                                                    lineHeight: 1.2
                                                                }}
                                                            >
                                                                {activity.description}
                                                            </Typography>
                                                        )}
                                                        
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                                                            <Tooltip title="Edit Activity">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditActivity(activity);
                                                                    }}
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        bgcolor: '#1976d2',
                                                                        color: 'white',
                                                                        '&:hover': {
                                                                            bgcolor: '#1565c0'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Edit sx={{ fontSize: 14 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete Activity">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteActivity(activity.id, activity.topic);
                                                                    }}
                                                                    sx={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        bgcolor: '#f44336',
                                                                        color: 'white',
                                                                        '&:hover': {
                                                                            bgcolor: '#d32f2f'
                                                                        }
                                                                    }}
                                                                >
                                                                    <Delete sx={{ fontSize: 14 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </Card>
                                                ))
                                            ) : (
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    py: 3,
                                                    color: 'text.secondary'
                                                }}>
                                                    <Typography variant="caption">
                                                        No activities
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                            {/* Add Activity Button for each day */}
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Add />}
                                                onClick={() => handleCreateActivity(currentWeekSchedule.id)}
                                                sx={{
                                                    mt: 1,
                                                    borderStyle: 'dashed',
                                                    fontSize: '0.7rem',
                                                    '&:hover': {
                                                        borderStyle: 'solid'
                                                    }
                                                }}
                                            >
                                                Add Activity
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Alert severity="info" sx={{ textAlign: 'center' }}>
                        No schedule found for Week {currentWeek}. Click "Create Schedule" to add one.
                    </Alert>
                )}
            </Stack>
        );
    };

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
                            {renderSchedulesAndActivities()}
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

            {/* Activity Form Modal */}
            <ActivityForm
                open={activityFormOpen}
                onClose={() => setActivityFormOpen(false)}
                onSubmit={handleActivityFormSubmit}
                mode={activityFormMode}
                initialData={selectedActivity}
                lessons={allLessons}
                loading={false}
                scheduleId={selectedActivity?.scheduleId}
            />
        </Box>
    );
}

export default ClassDetails;