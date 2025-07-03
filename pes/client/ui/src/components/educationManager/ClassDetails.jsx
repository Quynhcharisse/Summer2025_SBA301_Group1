import React, {useCallback, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography
} from '@mui/material';
import {
    ArrowBack} from '@mui/icons-material';
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
    deleteActivity,
    updateClass,
    getAllTeachers,
    getAllSyllabi,
    getTeacherById,
    createClass
} from '../../services/EducationService.jsx';
import ScheduleForm from './ScheduleForm.jsx';
import ActivityForm from './ActivityForm.jsx';
import ClassInformation from './ClassInformation.jsx';
import ScheduleAndActivitiesSection from './ScheduleAndActivitiesSection.jsx';
import TeacherDetailView from './TeacherDetailView.jsx';

function ClassDetails() {
    const {id: classId} = useParams();
    const navigate = useNavigate();
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [classData, setClassData] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [activities, setActivities] = useState([]);
    const [syllabus, setSyllabus] = useState(null);
    const [classLessons, setClassLessons] = useState([]);
    const [allLessons, setAllLessons] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [syllabi, setSyllabi] = useState([]);
    const [loading, setLoading] = useState(true); // Set to true initially for create mode as well
    
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
    const [teacherDetailOpen, setTeacherDetailOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

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

    const fetchAllTeachers = useCallback(async () => {
        try {
            const response = await getAllTeachers();
            if (response && response.success) {
                setTeachers(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }, []);

    const fetchAllSyllabi = useCallback(async () => {
        try {
            const response = await getAllSyllabi();
            if (response && response.success) {
                setSyllabi(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching syllabi:', error);
        }
    }, []);

    const fetchClassDetails = useCallback(async () => {
        try {
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
            if (classId === 'new') {
                setIsCreateMode(true);
                setClassData({
                    name: '',
                    description: '',
                    grade: '',
                    status: 'ACTIVE',
                    teacher: null,
                    syllabus: null,
                    startDate: '',
                    endDate: ''
                });
                setSchedules([]);
                setActivities([]);
                setSyllabus(null);
                setClassLessons([]);
                setLoading(false);
            } else {
                setIsCreateMode(false);
                await fetchClassDetails();
            }
            await fetchAllLessons();
            await fetchAllClasses();
            await fetchAllTeachers();
            await fetchAllSyllabi();
        };

        fetchData();
    }, [classId, fetchClassDetails, fetchAllLessons, fetchAllClasses, fetchAllTeachers, fetchAllSyllabi, setIsCreateMode]);

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

    // Helper function to group activities by day for a specific schedule
    const groupActivitiesByDayForSchedule = (scheduleId) => {
        const scheduleActivities = activities.filter(activity => activity.scheduleId === scheduleId);
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        const grouped = {};
        
        days.forEach(day => {
            grouped[day] = scheduleActivities.filter(activity =>
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

    const handleEditSchedule = async (schedule) => {
        try {
            // Fetch the latest activities for this schedule to ensure we have current data
            const activitiesResponse = await getActivitiesByClassId(classId);
            if (activitiesResponse && activitiesResponse.success) {
                setActivities(activitiesResponse.data || []);
            }
            
            // Include activities for editing - use the freshly fetched activities
            const freshActivities = activitiesResponse?.data || activities;
            const scheduleWithActivities = {
                ...schedule,
                activities: freshActivities.filter(activity => activity.scheduleId === schedule.id)
            };
            setSelectedSchedule(scheduleWithActivities);
            setScheduleFormMode('edit');
            setScheduleFormOpen(true);
        } catch (error) {
            console.error('Error fetching fresh activities for schedule edit:', error);
            // Fallback to using existing activities
            const scheduleWithActivities = {
                ...schedule,
                activities: activities.filter(activity => activity.scheduleId === schedule.id)
            };
            setSelectedSchedule(scheduleWithActivities);
            setScheduleFormMode('edit');
            setScheduleFormOpen(true);
        }
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setActivityFormMode('edit');
        setActivityFormOpen(true);
    };

    const handleCreateActivity = (scheduleId, slotContext) => {
        setSelectedActivity({ 
            scheduleId,
            slotContext 
        });
        setActivityFormMode('create');
        setActivityFormOpen(true);
    };

    // These handlers are for activities created/edited from the schedule form
    const handleCreateActivityFromForm = async (activityData) => {
        if (isCreateMode) {
            // In create mode, add activity to local state
            const newActivity = {
                ...activityData,
                id: Date.now(), // Assign a temporary ID
                scheduleId: activityData.scheduleId
            };
            setActivities(prevActivities => [...prevActivities, newActivity]);
            enqueueSnackbar('Activity added locally', { variant: 'info' });
            return { success: true, data: newActivity };
        } else {
            try {
                const response = await createActivity(activityData);
                if (response && response.success) {
                    await fetchClassDetails(); // Refresh all data
                    enqueueSnackbar('Activity created successfully', { variant: 'success' });
                    return response;
                } else {
                    enqueueSnackbar('Failed to create activity', { variant: 'error' });
                    throw new Error('Failed to create activity');
                }
            } catch (error) {
                console.error('Error creating activity:', error);
                enqueueSnackbar('Error creating activity', { variant: 'error' });
                throw error;
            }
        }
    };

    const handleEditActivityFromForm = async (activityId, activityData) => {
        if (isCreateMode) {
            // In create mode, update activity in local state
            setActivities(prevActivities =>
                prevActivities.map(act =>
                    act.id === activityId ? { ...act, ...activityData } : act
                )
            );
            enqueueSnackbar('Activity updated locally', { variant: 'info' });
            return { success: true, data: { id: activityId, ...activityData } };
        } else {
            try {
                const response = await updateActivity(activityId, activityData);
                if (response && response.success) {
                    await fetchClassDetails(); // Refresh all data
                    enqueueSnackbar('Activity updated successfully', { variant: 'success' });
                    return response;
                } else {
                    enqueueSnackbar('Failed to update activity', { variant: 'error' });
                    throw new Error('Failed to update activity');
                }
            } catch (error) {
                console.error('Error updating activity:', error);
                enqueueSnackbar('Error updating activity', { variant: 'error' });
                throw error;
            }
        }
    };

    const handleDeleteSchedule = async (scheduleId, weekNumber) => {
        if (window.confirm(`Are you sure you want to delete Week ${weekNumber} schedule? This will also delete all associated activities.`)) {
            if (isCreateMode) {
                // In create mode, remove schedule and its activities from local state
                setSchedules(prevSchedules => prevSchedules.filter(s => s.id !== scheduleId));
                setActivities(prevActivities => prevActivities.filter(act => act.scheduleId !== scheduleId));
                enqueueSnackbar('Schedule deleted locally', { variant: 'info' });
            } else {
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
        }
    };

    const handleDeleteActivity = async (activityId, activityTopic) => {
        if (window.confirm(`Are you sure you want to delete the activity "${activityTopic}"?`)) {
            if (isCreateMode) {
                // In create mode, remove activity from local state
                setActivities(prevActivities => prevActivities.filter(act => act.id !== activityId));
                enqueueSnackbar('Activity deleted locally', { variant: 'info' });
            } else {
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
        }
    };

    const handleActivityFormSubmit = async (activityData) => {
        try {
            let response;
            
            if (isCreateMode) {
                if (activityFormMode === 'create') {
                    // Add activity to local state
                    const newActivity = {
                        ...activityData,
                        id: Date.now(), // Assign a temporary ID
                        scheduleId: activityData.scheduleId
                    };
                    setActivities(prevActivities => [...prevActivities, newActivity]);
                    enqueueSnackbar('Activity added locally', { variant: 'info' });
                    response = { success: true, data: newActivity };
                } else if (activityFormMode === 'edit') {
                    // Update activity in local state
                    setActivities(prevActivities =>
                        prevActivities.map(act =>
                            act.id === selectedActivity.id ? { ...act, ...activityData } : act
                        )
                    );
                    enqueueSnackbar('Activity updated locally', { variant: 'info' });
                    response = { success: true, data: { id: selectedActivity.id, ...activityData } };
                }
            } else {
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
            }
            
            if (response && response.success) {
                setActivityFormOpen(false);
                if (!isCreateMode) {
                    await fetchClassDetails();
                }
                enqueueSnackbar(
                    activityFormMode === 'create' ? 'Activity saved successfully' : 'Activity updated successfully',
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

            if (isCreateMode) {
                if (scheduleFormMode === 'create') {
                    // Assign a temporary ID for local state management
                    const tempScheduleId = Date.now();
                    const newSchedule = {
                        ...formData,
                        id: tempScheduleId,
                        classId: classId // Ensure classId is set for new schedules
                    };
                    setSchedules(prevSchedules => [...prevSchedules, newSchedule]);

                    // Assign temporary scheduleId to activities and add to local state
                    if (formData.activities && formData.activities.length > 0) {
                        const newActivities = formData.activities.map(activity => ({
                            ...activity,
                            id: Date.now() + Math.random(), // Unique temporary ID for activity
                            scheduleId: tempScheduleId
                        }));
                        setActivities(prevActivities => [...prevActivities, ...newActivities]);
                    }
                    enqueueSnackbar('Schedule added locally', { variant: 'info' });
                    scheduleResponse = { success: true, data: newSchedule };
                } else if (scheduleFormMode === 'edit') {
                    // Update schedule in local state
                    setSchedules(prevSchedules =>
                        prevSchedules.map(s =>
                            s.id === selectedSchedule.id ? { ...s, ...formData } : s
                        )
                    );

                    // Handle activities updates locally
                    if (formData.activities && formData.activities.length > 0) {
                        const updatedActivities = formData.activities.map(activity => {
                            if (activity.id) {
                                // Update existing activity
                                return activity;
                            } else {
                                // Create new activity
                                return {
                                    ...activity,
                                    id: Date.now() + Math.random(),
                                    scheduleId: selectedSchedule.id
                                };
                            }
                        });
                        // Filter out old activities for this schedule and add updated ones
                        setActivities(prevActivities => [
                            ...prevActivities.filter(act => act.scheduleId !== selectedSchedule.id),
                            ...updatedActivities
                        ]);
                    }
                    enqueueSnackbar('Schedule updated locally', { variant: 'info' });
                    scheduleResponse = { success: true, data: { id: selectedSchedule.id, ...formData } };
                }
            } else {
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
            }

            if (scheduleResponse && scheduleResponse.success) {
                setScheduleFormOpen(false);
                if (!isCreateMode) {
                    await fetchClassDetails();
                }
                enqueueSnackbar(
                    scheduleFormMode === 'create' ? 'Schedule saved successfully' : 'Schedule updated successfully',
                    {variant: 'success'}
                );
                return scheduleResponse; // Return the response for ScheduleForm to use
            } else {
                // Handle specific error messages from backend
                const errorMessage = scheduleResponse?.message || 'Failed to save schedule';
                enqueueSnackbar(errorMessage, {variant: 'error'});
                throw new Error(errorMessage); // Throw error so ScheduleForm can handle it
            }
        } catch (error) {
            console.error('Error handling schedule form submission:', error);
            // Check if it's a duplicate schedule error or other specific errors
            if (error.details && error.details.message) {
                enqueueSnackbar(error.details.message, {variant: 'error'});
            } else if (error.message && error.message.includes('already exists')) {
                enqueueSnackbar('A schedule already exists for this week and class. Please choose a different week number.', {variant: 'warning'});
            } else {
                enqueueSnackbar('Error saving schedule', {variant: 'error'});
            }
            throw error; // Re-throw so ScheduleForm knows there was an error
        }
    };

    const handleTeacherClick = async (teacher) => {
        try {
            // Fetch complete teacher details instead of using the simplified teacher object from class data
            const response = await getTeacherById(teacher.id);
            if (response && response.success) {
                setSelectedTeacher(response.data);
                setTeacherDetailOpen(true);
            } else {
                // Fallback to the original teacher object if fetch fails
                console.warn('Failed to fetch complete teacher details, using simplified data');
                setSelectedTeacher(teacher);
                setTeacherDetailOpen(true);
            }
        } catch (error) {
            console.error('Error fetching teacher details:', error);
            // Fallback to the original teacher object if error occurs
            setSelectedTeacher(teacher);
            setTeacherDetailOpen(true);
        }
    };

    const handleTeacherDetailClose = () => {
        setTeacherDetailOpen(false);
        setSelectedTeacher(null);
    };

    const handleUpdateClass = async (classId, updateData) => {
        try {
            const response = await updateClass(classId, updateData);
            if (response && response.success) {
                enqueueSnackbar('Class updated successfully', { variant: 'success' });
                await fetchClassDetails(); // Refresh class data
            } else {
                enqueueSnackbar('Failed to update class', { variant: 'error' });
                throw new Error('Failed to update class');
            }
        } catch (error) {
            console.error('Error updating class:', error);
            enqueueSnackbar('Error updating class', { variant: 'error' });
            throw error;
        }
    };

    const handleCreateClass = async (newClassData) => {
        try {
            // Validation: At least one schedule with at least one activity
            if (!schedules || schedules.length === 0) {
                enqueueSnackbar('A new class must have at least one schedule week.', { variant: 'error' });
                return;
            }

            const hasActivities = schedules.some(schedule =>
                activities.some(activity => activity.scheduleId === schedule.id)
            );

            if (!hasActivities) {
                enqueueSnackbar('Each schedule week must have at least one activity.', { variant: 'error' });
                return;
            }

            // 1. Create the class
            const classResponse = await createClass(newClassData);
            if (!classResponse || !classResponse.success) {
                enqueueSnackbar('Failed to create class', { variant: 'error' });
                return;
            }
            const newClassId = classResponse.data.id;
            enqueueSnackbar('Class created successfully', { variant: 'success' });

            // 2. Create schedules and activities for the new class
            for (const localSchedule of schedules) {
                const schedulePayload = {
                    weekNumber: localSchedule.weekNumber,
                    note: localSchedule.note,
                    classId: newClassId
                };
                const createdScheduleResponse = await createSchedule(schedulePayload);

                if (createdScheduleResponse && createdScheduleResponse.success) {
                    const createdScheduleId = createdScheduleResponse.data.id;
                    const activitiesForSchedule = activities.filter(
                        activity => activity.scheduleId === localSchedule.id
                    );

                    for (const localActivity of activitiesForSchedule) {
                        const activityPayload = {
                            topic: localActivity.topic,
                            description: localActivity.description,
                            dayOfWeek: localActivity.dayOfWeek,
                            startTime: localActivity.startTime,
                            endTime: localActivity.endTime,
                            scheduleId: createdScheduleId,
                            lessonId: localActivity.lessonId
                        };
                        await createActivity(activityPayload);
                    }
                } else {
                    enqueueSnackbar(`Failed to create schedule for week ${localSchedule.weekNumber}`, { variant: 'warning' });
                }
            }

            enqueueSnackbar('Schedules and activities saved successfully', { variant: 'success' });
            navigate(`/education/classes/${newClassId}`); // Navigate to the new class's detail page

        } catch (error) {
            console.error('Error creating new class with schedules and activities:', error);
            enqueueSnackbar('Error creating class', { variant: 'error' });
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
                    {isCreateMode ? 'Create New Class' : `Class Details: ${classData?.name || 'Loading...'}`}
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
                            <ClassInformation
                                classData={classData}
                                syllabus={syllabus}
                                classLessons={classLessons}
                                onTeacherClick={handleTeacherClick}
                                teachers={teachers}
                                syllabi={syllabi}
                                onUpdateClass={isCreateMode ? handleCreateClass : handleUpdateClass}
                                isCreateMode={isCreateMode}
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
                                isCreateMode={isCreateMode} // Pass isCreateMode to ScheduleAndActivitiesSection
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
                onCreateActivity={handleCreateActivityFromForm}
                onEditActivity={handleEditActivityFromForm}
                onDeleteActivity={handleDeleteActivity}
                activitiesByDay={selectedSchedule?.id ? groupActivitiesByDayForSchedule(selectedSchedule.id) : {}}
                isCreateMode={isCreateMode} // Pass isCreateMode to ScheduleForm
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
                slotContext={selectedActivity?.slotContext}
                isCreateMode={isCreateMode} // Pass isCreateMode to ActivityForm
            />

            <TeacherDetailView
                teacher={selectedTeacher}
                open={teacherDetailOpen}
                onClose={handleTeacherDetailClose}
            />
        </Box>
    );
}

export default ClassDetails;