import React, { useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';

const LessonForm = ({
    open,
    onClose,
    onSubmit,
    mode = 'create',
    initialData = null,
    loading = false
}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            topic: '',
            description: '',
            duration: '',
            materials: ''
        }
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset({
                topic: initialData.topic || '',
                description: initialData.description || '',
                duration: initialData.duration || '',
                materials: initialData.materials || ''
            });
        } else if (mode === 'create') {
            reset({
                topic: '',
                description: '',
                duration: '',
                materials: ''
            });
        }
    }, [mode, initialData, reset, open]);

    const handleFormSubmit = async (formData) => {
        try {
            await onSubmit(formData);
            if (mode === 'create') {
                reset();
            }
        } catch (error) {
            // Error handling is done in the parent component
            console.error('Form submission error:', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {mode === 'edit' ? 'Edit Lesson' : 'Add New Lesson'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 1 }}>
                    <TextField
                        label="Lesson Topic"
                        fullWidth
                        margin="normal"
                        error={!!errors.topic}
                        helperText={errors.topic ? "Topic is required" : ""}
                        {...register("topic", { required: true })}
                        autoFocus
                        disabled={loading}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description ? "Description is required" : ""}
                        {...register("description", { required: true })}
                        disabled={loading}
                    />
                    <TextField
                        label="Duration (minutes)"
                        fullWidth
                        margin="normal"
                        type="number"
                        inputProps={{ min: 0, step: 1 }}
                        error={!!errors.duration}
                        helperText={errors.duration ?
                            errors.duration.type === "required" ? "Duration is required" :
                                errors.duration.type === "min" ? "Duration cannot be negative" :
                                    errors.duration.type === "pattern" ? "Please enter a valid number" :
                                        "Duration is required" : "Enter lesson duration in minutes"}
                        {...register("duration", {
                            required: true,
                            min: 0,
                            pattern: /^[0-9]+$/
                        })}
                        disabled={loading}
                    />
                    <TextField
                        label="Materials"
                        fullWidth
                        margin="normal"
                        error={!!errors.materials}
                        helperText={errors.materials ? "Materials are required" : ""}
                        {...register("materials", { required: true })}
                        disabled={loading}
                    />

                    <DialogActions sx={{ px: 0, pb: 0 }}>
                        <Button 
                            onClick={handleClose} 
                            color="secondary"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Saving...' : (mode === 'edit' ? 'Save Changes' : 'Add Lesson')}
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LessonForm;
