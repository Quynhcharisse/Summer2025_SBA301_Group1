import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack,
    Typography,
    Box,
    Card,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Chip
} from '@mui/material';
import { Add, Remove, ExpandMore } from '@mui/icons-material';

function ScheduleForm({
    open,
    onClose,
    onSubmit,
    mode,
    initialData,
    classes,
    lessons,
    loading
}) {
    const [formData, setFormData] = useState({
        weekNumber: 1,
        note: '',
        classId: '',
        activities: []
    });

    const [activityErrors, setActivityErrors] = useState([]);

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    // Initialize form data when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                const newFormData = {
                    weekNumber: initialData?.weekNumber || 1,
                    note: initialData?.note || '',
                    classId: initialData?.classId || '',
                    activities: initialData?.activities || [{
                        topic: '',
                        description: '',
                        dayOfWeek: '',
                        startTime: '',
                        endTime: '',
                        lessonId: ''
                    }]
                };
                setFormData(newFormData);
            } else if (mode === 'edit' && initialData) {
                // Ensure activities are properly formatted with all required fields
                const processedActivities = (initialData.activities || []).map(activity => ({
                    id: activity.id,
                    topic: activity.topic || '',
                    description: activity.description || '',
                    dayOfWeek: activity.dayOfWeek || '', // Ensure this is properly set
                    startTime: activity.startTime || '',
                    endTime: activity.endTime || '',
                    lessonId: activity.lessonId || (activity.lesson?.id) || ''
                }));
                
                // If no activities exist, provide one empty template
                const activitiesArray = processedActivities.length > 0 ? processedActivities : [{
                    topic: '',
                    description: '',
                    dayOfWeek: '',
                    startTime: '',
                    endTime: '',
                    lessonId: ''
                }];
                
                const newFormData = {
                    weekNumber: initialData.weekNumber || 1,
                    note: initialData.note || '',
                    classId: initialData.classId || '',
                    activities: activitiesArray
                };
                setFormData(newFormData);
            }
            setActivityErrors([]);
        }
    }, [open, mode, initialData]);

    const validateActivities = () => {
        const errors = [];
        
        formData.activities.forEach((activity, index) => {
            const activityErrors = [];
            
            if (!activity.topic?.trim()) {
                activityErrors.push('Topic is required');
            }
            
            if (!activity.dayOfWeek) {
                activityErrors.push('Day of Week is required');
            }
            
            if (!activity.startTime) {
                activityErrors.push('Start Time is required');
            }
            
            if (!activity.endTime) {
                activityErrors.push('End Time is required');
            }
            
            if (activity.startTime && activity.endTime && activity.startTime >= activity.endTime) {
                activityErrors.push('End Time must be after Start Time');
            }
            
            if (activityErrors.length > 0) {
                errors[index] = activityErrors;
            }
        });
        
        return errors;
    };

    const addActivity = () => {
        setFormData({
            ...formData,
            activities: [
                ...formData.activities,
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

    const removeActivity = (index) => {
        const newActivities = formData.activities.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            activities: newActivities
        });
        
        // Remove errors for this activity
        const newErrors = [...activityErrors];
        newErrors.splice(index, 1);
        setActivityErrors(newErrors);
    };

    const updateActivity = (index, field, value) => {
        const newActivities = [...formData.activities];
        newActivities[index][field] = value;
        setFormData({
            ...formData,
            activities: newActivities
        });
        
        // Clear errors for this field
        if (activityErrors[index]) {
            const newErrors = [...activityErrors];
            if (newErrors[index]) {
                newErrors[index] = newErrors[index].filter(error => {
                    if (field === 'topic' && error.includes('Topic')) return false;
                    if (field === 'dayOfWeek' && error.includes('Day of Week')) return false;
                    if (field === 'startTime' && error.includes('Start Time')) return false;
                    if (field === 'endTime' && error.includes('End Time')) return false;
                    return true;
                });
                setActivityErrors(newErrors);
            }
        }
    };

    const handleSubmit = async () => {
        // Validate activities for both create and edit modes
        const validationErrors = validateActivities();
        if (validationErrors.length > 0) {
            setActivityErrors(validationErrors);
            return;
        }

        // Call the onSubmit prop with form data
        await onSubmit(formData);
    };

    const handleClose = () => {
        setActivityErrors([]);
        onClose();
    };

    return (
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
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Week Number"
                        type="number"
                        value={formData.weekNumber}
                        onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
                        inputProps={{ min: 1 }}
                        required
                        helperText="Enter the week number for this schedule (e.g., 1, 2, 3...)"
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={formData.classId}
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Add any notes about this schedule (optional)..."
                        helperText="You can add location, special instructions, or any other relevant information"
                    />

                    {/* Activities Section - Show for both create and edit modes */}
                    {(mode === 'create' || mode === 'edit') && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="h6" color="primary">
                                    Activities ({formData.activities.length})
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack spacing={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        {mode === 'create'
                                            ? 'Add activities to this schedule. Activities will be created after the schedule is successfully created.'
                                            : 'Modify existing activities or add new ones. Changes will be saved when you update the schedule.'
                                        }
                                    </Typography>

                                    {formData.activities.map((activity, index) => (
                                        <Card key={index} sx={{
                                            p: 2,
                                            border: activity.id ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                            backgroundColor: activity.id ? '#f8fff8' : 'white'
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle1" color="primary">
                                                        Activity {index + 1}
                                                    </Typography>
                                                    {activity.id && (
                                                        <Chip
                                                            label="Existing"
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                    {!activity.id && mode === 'edit' && activity.topic && (
                                                        <Chip
                                                            label="New"
                                                            size="small"
                                                            color="info"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                                {formData.activities.length > 1 && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => removeActivity(index)}
                                                        title={activity.id ? "Delete existing activity" : "Remove new activity"}
                                                    >
                                                        <Remove />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            {activityErrors[index] && (
                                                <Alert severity="error" sx={{ mb: 2 }}>
                                                    {activityErrors[index].join(', ')}
                                                </Alert>
                                            )}

                                            <Stack spacing={2}>
                                                <TextField
                                                    fullWidth
                                                    label="Topic"
                                                    value={activity.topic}
                                                    onChange={(e) => updateActivity(index, 'topic', e.target.value)}
                                                    required
                                                    error={activityErrors[index]?.some(error => error.includes('Topic'))}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="Description"
                                                    multiline
                                                    rows={2}
                                                    value={activity.description}
                                                    onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                                    placeholder="Enter activity description (optional)..."
                                                />

                                                <FormControl fullWidth required>
                                                    <InputLabel>Day of Week</InputLabel>
                                                    <Select
                                                        value={activity.dayOfWeek}
                                                        onChange={(e) => updateActivity(index, 'dayOfWeek', e.target.value)}
                                                        label="Day of Week"
                                                        error={activityErrors[index]?.some(error => error.includes('Day of Week'))}
                                                    >
                                                        {daysOfWeek.map((day) => (
                                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <Box sx={{ display: 'flex', gap: 2 }}>
                                                    <TextField
                                                        fullWidth
                                                        label="Start Time"
                                                        type="time"
                                                        value={activity.startTime}
                                                        onChange={(e) => updateActivity(index, 'startTime', e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        required
                                                        error={activityErrors[index]?.some(error => error.includes('Start Time'))}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="End Time"
                                                        type="time"
                                                        value={activity.endTime}
                                                        onChange={(e) => updateActivity(index, 'endTime', e.target.value)}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        required
                                                        error={activityErrors[index]?.some(error => error.includes('End Time'))}
                                                    />
                                                </Box>

                                                <FormControl fullWidth>
                                                    <InputLabel>Lesson (Optional)</InputLabel>
                                                    <Select
                                                        value={activity.lessonId}
                                                        onChange={(e) => updateActivity(index, 'lessonId', e.target.value)}
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
                                            </Stack>
                                        </Card>
                                    ))}

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<Add />}
                                        onClick={addActivity}
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
                            </AccordionDetails>
                        </Accordion>
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
                    {mode === 'create' ? 'Create Schedule & Activities' : 'Update Schedule & Activities'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ScheduleForm;