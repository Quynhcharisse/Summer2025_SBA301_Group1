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
    Alert
} from '@mui/material';

function ActivityForm({
    open,
    onClose,
    onSubmit,
    mode, // 'create' or 'edit'
    initialData,
    lessons,
    loading,
    scheduleId,
    slotContext // { dayOfWeek, startTime, endTime } - auto-populated from slot selection
}) {
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        lessonId: '',
        scheduleId: scheduleId || ''
    });

    const [errors, setErrors] = useState([]);

    // Initialize form data when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                setFormData({
                    topic: '',
                    description: '',
                    dayOfWeek: slotContext?.dayOfWeek || '',
                    startTime: slotContext?.startTime || '',
                    endTime: slotContext?.endTime || '',
                    lessonId: null,
                    scheduleId: scheduleId || ''
                });
            } else if (mode === 'edit' && initialData) {
                setFormData({
                    id: initialData.id,
                    topic: initialData.topic || '',
                    description: initialData.description || '',
                    dayOfWeek: initialData.dayOfWeek || '',
                    startTime: initialData.startTime || '',
                    endTime: initialData.endTime || '',
                    lessonId: initialData.lessonId || (initialData.lesson?.id) || null,
                    scheduleId: initialData.scheduleId || scheduleId || ''
                });
            }
            setErrors([]);
        }
    }, [open, mode, initialData, scheduleId, slotContext]);

    const validateActivity = () => {
        const validationErrors = [];
        
        if (!formData.topic?.trim()) {
            validationErrors.push('Topic is required');
        }
        
        // Day, start time, and end time are automatically set from slot context
        // No need to validate them manually as they're pre-determined
        
        return validationErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateActivity();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Prepare the final data with calculated end time if lesson is selected
        const finalFormData = { ...formData };
        
        // If a lesson is selected and has duration, calculate the end time
        if (formData.lessonId && formData.startTime) {
            const selectedLesson = lessons.find(lesson => lesson.id === formData.lessonId);
            if (selectedLesson?.duration) {
                const startTime = new Date(`2000-01-01 ${formData.startTime}`);
                const endTime = new Date(startTime.getTime() + selectedLesson.duration * 60000);
                finalFormData.endTime = endTime.toTimeString().slice(0, 5);
            }
        }

        // Ensure all required backend fields are present
        const submissionData = {
            topic: finalFormData.topic,
            description: finalFormData.description || '',
            dayOfWeek: finalFormData.dayOfWeek,
            startTime: finalFormData.startTime,
            endTime: finalFormData.endTime,
            scheduleId: parseInt(finalFormData.scheduleId),
            lessonId: finalFormData.lessonId ? parseInt(finalFormData.lessonId) : null
        };

        // Call the onSubmit prop with prepared data
        await onSubmit(submissionData);
    };

    const handleClose = () => {
        setErrors([]);
        onClose();
    };

    const handleFieldChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
        
        // Clear specific error when field is updated
        if (errors.length > 0) {
            let updatedErrors = [...errors];
            if (field === 'topic' && errors.some(error => error.includes('Topic'))) {
                updatedErrors = updatedErrors.filter(error => !error.includes('Topic'));
            }
            setErrors(updatedErrors);
        }
    };

    // Calculate end time when lesson is selected (for display purposes)
    const calculateEndTime = () => {
        if (!formData.startTime) return formData.endTime || '';
        
        const selectedLesson = lessons.find(lesson => lesson.id === formData.lessonId);
        if (selectedLesson?.duration) {
            const startTime = new Date(`2000-01-01 ${formData.startTime}`);
            const endTime = new Date(startTime.getTime() + selectedLesson.duration * 60000);
            return endTime.toTimeString().slice(0, 5);
        }
        
        return formData.endTime || '';
    };

    // Update end time when lesson changes
    const handleLessonChange = (lessonId) => {
        const selectedLesson = lessons.find(lesson => lesson.id === lessonId);
        let newEndTime = formData.endTime;
        
        if (selectedLesson?.duration && formData.startTime) {
            const startTime = new Date(`2000-01-01 ${formData.startTime}`);
            const endTime = new Date(startTime.getTime() + selectedLesson.duration * 60000);
            newEndTime = endTime.toTimeString().slice(0, 5);
        } else if (!selectedLesson && slotContext?.endTime) {
            // If no lesson is selected, use the original slot end time
            newEndTime = slotContext.endTime;
        }
        
        setFormData({
            ...formData,
            lessonId: lessonId === '' ? null : lessonId, // Convert empty string to null
            endTime: newEndTime
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {mode === 'create' ? 'Create New Activity' : 'Edit Activity'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    {errors.length > 0 && (
                        <Alert severity="error">
                            {errors.join(', ')}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Topic"
                        value={formData.topic}
                        onChange={(e) => handleFieldChange('topic', e.target.value)}
                        required
                        error={errors.some(error => error.includes('Topic'))}
                        helperText="Enter the main topic or title for this activity"
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Enter activity description (optional)..."
                        helperText="Provide additional details about the activity"
                    />

                    {/* Display slot context information (read-only) */}
                    {(slotContext || mode === 'edit') && (
                        <Box sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Time Slot Information
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    <strong>Day:</strong> {formData.dayOfWeek?.charAt(0) + formData.dayOfWeek?.slice(1).toLowerCase()}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Time:</strong> {formData.startTime} - {calculateEndTime() || formData.endTime}
                                </Typography>
                                {mode === 'create' && (
                                    <Typography variant="caption" color="text.secondary">
                                        Time slot is automatically set based on your selection
                                    </Typography>
                                )}
                            </Stack>
                        </Box>
                    )}

                    <FormControl fullWidth>
                        <InputLabel>Lesson (Optional)</InputLabel>
                        <Select
                            value={formData.lessonId || ""}
                            onChange={(e) => handleLessonChange(e.target.value)}
                            label="Lesson (Optional)"
                        >
                            <MenuItem value="">None</MenuItem>
                            {lessons.map((lesson) => (
                                <MenuItem key={lesson.id} value={lesson.id}>
                                    {lesson.topic}
                                    {lesson.duration && (
                                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            ({lesson.duration} min)
                                        </Typography>
                                    )}
                                </MenuItem>
                            ))}
                        </Select>
                        {formData.lessonId && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                End time will be calculated based on lesson duration
                            </Typography>
                        )}
                    </FormControl>
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
                    {mode === 'create' ? 'Create Activity' : 'Update Activity'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ActivityForm;