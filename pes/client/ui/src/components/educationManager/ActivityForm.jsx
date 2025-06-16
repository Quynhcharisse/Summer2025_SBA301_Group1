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
    scheduleId
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

    const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    // Initialize form data when dialog opens or initialData changes
    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                setFormData({
                    topic: '',
                    description: '',
                    dayOfWeek: '',
                    startTime: '',
                    endTime: '',
                    lessonId: '',
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
                    lessonId: initialData.lessonId || (initialData.lesson?.id) || '',
                    scheduleId: initialData.scheduleId || scheduleId || ''
                });
            }
            setErrors([]);
        }
    }, [open, mode, initialData, scheduleId]);

    const validateActivity = () => {
        const validationErrors = [];
        
        if (!formData.topic?.trim()) {
            validationErrors.push('Topic is required');
        }
        
        if (!formData.dayOfWeek) {
            validationErrors.push('Day of Week is required');
        }
        
        if (!formData.startTime) {
            validationErrors.push('Start Time is required');
        }
        
        if (!formData.endTime) {
            validationErrors.push('End Time is required');
        }
        
        if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
            validationErrors.push('End Time must be after Start Time');
        }
        
        return validationErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateActivity();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Call the onSubmit prop with form data
        await onSubmit(formData);
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
            if (field === 'dayOfWeek' && errors.some(error => error.includes('Day of Week'))) {
                updatedErrors = updatedErrors.filter(error => !error.includes('Day of Week'));
            }
            if (field === 'startTime' && errors.some(error => error.includes('Start Time'))) {
                updatedErrors = updatedErrors.filter(error => !error.includes('Start Time'));
            }
            if (field === 'endTime' && errors.some(error => error.includes('End Time'))) {
                updatedErrors = updatedErrors.filter(error => !error.includes('End Time'));
            }
            setErrors(updatedErrors);
        }
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

                    <FormControl fullWidth required>
                        <InputLabel>Day of Week</InputLabel>
                        <Select
                            value={formData.dayOfWeek}
                            onChange={(e) => handleFieldChange('dayOfWeek', e.target.value)}
                            label="Day of Week"
                            error={errors.some(error => error.includes('Day of Week'))}
                        >
                            {daysOfWeek.map((day) => (
                                <MenuItem key={day} value={day}>
                                    {day.charAt(0) + day.slice(1).toLowerCase()}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Start Time"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => handleFieldChange('startTime', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            error={errors.some(error => error.includes('Start Time'))}
                        />
                        <TextField
                            fullWidth
                            label="End Time"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => handleFieldChange('endTime', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            error={errors.some(error => error.includes('End Time'))}
                        />
                    </Box>

                    <FormControl fullWidth>
                        <InputLabel>Lesson (Optional)</InputLabel>
                        <Select
                            value={formData.lessonId}
                            onChange={(e) => handleFieldChange('lessonId', e.target.value)}
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