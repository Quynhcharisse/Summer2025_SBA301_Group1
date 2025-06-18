import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Add,
    ArrowBack,
    ChevronLeft,
    ChevronRight,
    Delete,
    Edit
} from '@mui/icons-material';
import {useNavigate, useParams} from 'react-router-dom';
import {enqueueSnackbar} from 'notistack';
import {
    getSchedulesByClassId,
    getActivitiesByClassId,
    getAllLessons,
    getLessonsByClassId,
    getClassById,
    getSyllabusByClassId,
    updateActivity,
    getAllClasses,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    createActivity,
    deleteActivity
} from '../../services/EducationService.jsx';
import ScheduleForm from './ScheduleForm.jsx';
import ActivityForm from './ActivityForm.jsx';
import ClassInformation from './ClassInformation.jsx';
import ScheduleAndActivitiesSection from './ScheduleAndActivitiesSection.jsx';
import '../../styles/manager/ScheduleManagement.css';

function ClassDetails() {
    const {id: classId} = useParams();
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
                getClassById(classId),
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
            enqueueSnackbar('Failed to load class details', {variant: 'error'});
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
                    enqueueSnackbar('Schedule deleted successfully', {variant: 'success'});
                    fetchClassDetails(); // Refresh data
                } else {
                    enqueueSnackbar('Failed to delete schedule', {variant: 'error'});
                }
            } catch (error) {
                console.error('Error deleting schedule:', error);
                enqueueSnackbar('Error deleting schedule', {variant: 'error'});
            }
        }
    };

    const handleDeleteActivity = async (activityId, activityTopic) => {
        if (window.confirm(`Are you sure you want to delete the activity "${activityTopic}"?`)) {
            try {
                const response = await deleteActivity(activityId);
                if (response && response.success) {
                    enqueueSnackbar('Activity deleted successfully', {variant: 'success'});
                    fetchClassDetails(); // Refresh data
                } else {
                    enqueueSnackbar('Failed to delete activity', {variant: 'error'});
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
                    {variant: 'success'}
                );
            } else {
                enqueueSnackbar('Failed to save schedule', {variant: 'error'});
            }
        } catch (error) {
            console.error('Error handling schedule form submission:', error);
            enqueueSnackbar('Error saving schedule', {variant: 'error'});
        }
    };




    return (
        <Box sx={{p: 3}}>
            {/* Header with Back Button */}
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 3}}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack sx={{color: '#1976d2'}}/>}
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
                <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                    Class Details: {classData?.name || 'Loading...'}
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
                    <Typography>Loading class details...</Typography>
                </Box>
            ) : (
                <Stack spacing={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary" sx={{mb: 2}}>
                                Class Information
                            </Typography>
                            <ClassInformation
                                classData={classData}
                                syllabus={syllabus}
                                classLessons={classLessons}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <ScheduleAndActivitiesSection
                                currentWeek={currentWeek}
                                weekInput={weekInput}
                                currentWeekSchedule={getCurrentWeekSchedule()}
                                activitiesByDay={groupActivitiesByDay()}
                                onPreviousWeek={handlePreviousWeek}
                                onNextWeek={handleNextWeek}
                                onWeekInputChange={handleWeekInputChange}
                                onCreateSchedule={handleCreateSchedule}
                                onEditSchedule={handleEditSchedule}
                                onDeleteSchedule={handleDeleteSchedule}
                                onCreateActivity={handleCreateActivity}
                                onEditActivity={handleEditActivity}
                                onDeleteActivity={handleDeleteActivity}
                            />
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