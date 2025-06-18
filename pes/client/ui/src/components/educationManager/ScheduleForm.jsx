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
            } else if (mode === 'edit' && initialData) {
                const newFormData = {
                    weekNumber: initialData.weekNumber || 1,
                    note: initialData.note || '',
                    classId: initialData.classId || initialData.classes?.id || ''
                };
                setFormData(newFormData);
                setSelectedSchedule(initialData);
            }
        }
    }, [open, mode, initialData]);

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
                // Add scheduleId to the activity data
                await onCreateActivity({
                    ...activityData,
                    scheduleId: selectedSchedule?.id
                });
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
            // Call the onSubmit prop with form data
            const result = await onSubmit(formData);
            
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

                        {/* Activities Management Section - Only show if schedule exists (edit mode or after creation) */}
                        {selectedSchedule && (
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
                                        currentWeek={selectedSchedule.weekNumber}
                                        weekInput={selectedSchedule.weekNumber}
                                        currentWeekSchedule={selectedSchedule}
                                        activitiesByDay={activitiesByDay || {}}
                                        onPreviousWeek={() => {}} // Disabled in schedule form
                                        onNextWeek={() => {}} // Disabled in schedule form
                                        onWeekInputChange={() => {}} // Disabled in schedule form
                                        onEditSchedule={() => {}} // Disabled since we're already editing
                                        onDeleteSchedule={() => {}} // Disabled in schedule form
                                        onCreateActivity={handleCreateActivity}
                                        onEditActivity={handleEditActivity}
                                        onDeleteActivity={onDeleteActivity}
                                    />
                                </Box>
                            </>
                        )}

                        {/* Show message for create mode before schedule is created */}
                        {mode === 'create' && !selectedSchedule && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Box sx={{
                                    p: 3,
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    border: '1px dashed',
                                    borderColor: 'primary.main',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Create the schedule first, then you'll be able to manage activities using the weekly view.
                                    </Typography>
                                </Box>
                            </>
                        )}
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
                scheduleId={selectedSchedule?.id}
                slotContext={slotContext}
            />
        </>
    );
}

export default ScheduleForm;