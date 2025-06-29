import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Divider
} from '@mui/material';
import WeeklyActivitiesView from './WeeklyActivitiesView';
import ActivityForm from './ActivityForm';

function ScheduleForm({
                          open,
                          onClose,
                          onSubmit,
                          mode,
                          initialData,
                          classes,
                          lessons,
                          loading,
                          onCreateActivity,
                          onEditActivity,
                          onDeleteActivity,
                          activitiesByDay
                      }) {
    const [formData, setFormData] = useState({
        weekNumber: 1,
        note: '',
        classId: ''
    });

    const [activityFormOpen, setActivityFormOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [slotContext, setSlotContext] = useState(null);
    const [currentActivitiesByDay, setCurrentActivitiesByDay] = useState({});
    const [tempActivities, setTempActivities] = useState([]);

    // Initialize form data when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                const newFormData = {
                    weekNumber: initialData?.weekNumber || 1,
                    note: initialData?.note || '',
                    classId: initialData?.classId || ''
                };
                setFormData(newFormData);
                setSelectedSchedule(null);
                setCurrentActivitiesByDay({});
                setTempActivities([]); // Clear temporary activities on new form open
            } else if (mode === 'edit' && initialData) {
                // Handle different possible data structures from backend
                let classId = '';
                if (initialData.classId) {
                    classId = initialData.classId;
                } else if (initialData.classes?.id) {
                    classId = initialData.classes.id;
                } else if (typeof initialData.getClassId === 'function') {
                    classId = initialData.getClassId();
                }
                
                const newFormData = {
                    weekNumber: initialData.weekNumber || 1,
                    note: initialData.note || '',
                    classId: classId
                };
                setFormData(newFormData);
                setSelectedSchedule(initialData);
                // Update activities by day when editing
                setCurrentActivitiesByDay(activitiesByDay || {});
                setTempActivities(Object.values(activitiesByDay || {}).flat()); // Populate temp activities from existing
            }
        }
    }, [open, mode, initialData, activitiesByDay]);

    // Update currentActivitiesByDay when the prop changes
    useEffect(() => {
        if (mode === 'edit' && selectedSchedule) {
            setCurrentActivitiesByDay(activitiesByDay || {});
            setTempActivities(Object.values(activitiesByDay || {}).flat());
        } else if (mode === 'create') {
            // In create mode, currentActivitiesByDay should reflect tempActivities
            const newActivitiesByDay = tempActivities.reduce((acc, activity) => {
                const day = activity.dayOfWeek;
                if (!acc[day]) {
                    acc[day] = [];
                }
                acc[day].push(activity);
                return acc;
            }, {});
            setCurrentActivitiesByDay(newActivitiesByDay);
        }
    }, [activitiesByDay, mode, selectedSchedule, tempActivities]);

    const handleCreateActivity = (scheduleId, slotContextData) => {
        setEditingActivity(null);
        setSlotContext(slotContextData);
        setActivityFormOpen(true);
    };

    const handleEditActivity = (activity) => {
        setEditingActivity(activity);
        setActivityFormOpen(true);
    };

    const handleActivityFormClose = () => {
        setActivityFormOpen(false);
        setEditingActivity(null);
        setSlotContext(null);
    };

    const handleActivityFormSubmit = async (activityData) => {
        try {
            if (editingActivity) {
                await onEditActivity(editingActivity.id, activityData);
            } else {
                if (mode === 'create') {
                    // In create mode, add to temporary state
                    setTempActivities(prev => [...prev, { ...activityData, id: Date.now() }]); // Assign a temporary ID
                } else {
                    // In edit mode, call the parent's onCreateActivity
                    await onCreateActivity({
                        ...activityData,
                        scheduleId: selectedSchedule?.id
                    });
                }
            }
            setActivityFormOpen(false);
            setEditingActivity(null);
            setSlotContext(null);
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            let result;
            if (mode === 'create') {
                // In create mode, send activities along with schedule data
                result = await onSubmit({ ...formData, activities: tempActivities });
            } else {
                // In edit mode, just send schedule data
                result = await onSubmit(formData);
            }
            
            // If creating a new schedule, set it as selected so activities can be managed
            if (mode === 'create' && result?.data) {
                setSelectedSchedule(result.data);
            }
        } catch (error) {
            // Error handling is done in the parent component (ClassDetails)
            // This catch block prevents the form from closing on error
            console.error('Error in schedule form submission:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {mode === 'create' ? 'Create New Schedule' : 'Edit Schedule'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{mt: 2}}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <strong>Schedule Validation:</strong> Each class can only have one schedule per week number.
                            If you try to create a duplicate, you'll receive an error message.
                        </Alert>
                        
                        <TextField
                            fullWidth
                            label="Week Number"
                            type="number"
                            value={formData.weekNumber}
                            onChange={(e) => setFormData({...formData, weekNumber: parseInt(e.target.value) || 1})}
                            inputProps={{min: 1}}
                            required
                            helperText="Enter the week number for this schedule. Note: Each class can only have one schedule per week number."
                        />

                        <FormControl fullWidth required>
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={formData.classId}
                                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                                label="Class"
                            >
                                {classes.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>
                                        {cls.className} (Grade {cls.grade})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Note"
                            multiline
                            rows={4}
                            value={formData.note}
                            onChange={(e) => setFormData({...formData, note: e.target.value})}
                            placeholder="Add any notes about this schedule (optional)..."
                            helperText="You can add location, special instructions, or any other relevant information"
                        />

                        {/* Activities Management Section - Always show */}
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Box>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Manage Activities
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Use the weekly activities view below to manage activities for this schedule.
                                </Typography>
                                
                                <WeeklyActivitiesView
                                    isScheduleForm={true}
                                    formMode={mode}
                                    currentWeek={formData.weekNumber}
                                    weekInput={formData.weekNumber}
                                    currentWeekSchedule={selectedSchedule}
                                    activitiesByDay={currentActivitiesByDay}
                                    disableWeekNavigation={true} // Disable week navigation when embedded in ScheduleForm
                                    onEditSchedule={() => {}} // Disabled since we're already editing
                                    onDeleteSchedule={() => {}} // Disabled in schedule form
                                    onCreateActivity={(slotContextData) => handleCreateActivity(selectedSchedule?.id, slotContextData)}
                                    onEditActivity={handleEditActivity}
                                    onDeleteActivity={onDeleteActivity}
                                    onAddTempActivity={(slotContextData) => handleCreateActivity(null, slotContextData)} // Pass null for scheduleId in create mode
                                />
                            </Box>
                        </>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                    >
                        {mode === 'create' ? 'Create Schedule' : 'Update Schedule'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Activity Form Dialog */}
            <ActivityForm
                open={activityFormOpen}
                onClose={handleActivityFormClose}
                onSubmit={handleActivityFormSubmit}
                mode={editingActivity ? 'edit' : 'create'}
                initialData={editingActivity}
                lessons={lessons}
                loading={loading}
                scheduleId={mode === 'create' ? null : selectedSchedule?.id}
                slotContext={slotContext}
                isCreateMode={mode === 'create'}
            />
        </>
    );
}

export default ScheduleForm;