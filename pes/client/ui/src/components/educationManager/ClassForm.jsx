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
    Alert,
    Box
} from '@mui/material';

function ClassForm({
    open,
    onClose,
    onSubmit,
    teachers,
    syllabi,
    loading
}) {
    const [formData, setFormData] = useState({
        name: '',
        teacherId: null,
        syllabusId: '',
        numberStudent: 1,
        roomNumber: '',
        startDate: '',
        endDate: '',
        status: 'ACTIVE_TERM',
        grade: ''
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (open) {
            setFormData({
                name: '',
                teacherId: null,
                syllabusId: '',
                numberStudent: 1,
                roomNumber: '',
                startDate: '',
                endDate: '',
                status: 'ACTIVE_TERM',
                grade: ''
            });
            setErrors([]);
        }
    }, [open]);

    const validateForm = () => {
        const validationErrors = [];
        
        if (!formData.name?.trim()) {
            validationErrors.push('Class name is required');
        }
        
        if (!formData.teacherId) {
            validationErrors.push('Teacher is required');
        }
        
        if (!formData.syllabusId) {
            validationErrors.push('Syllabus is required');
        }
        
        if (!formData.grade) {
            validationErrors.push('Grade is required');
        }
        
        if (!formData.roomNumber?.trim()) {
            validationErrors.push('Room number is required');
        }
        
        if (!formData.startDate) {
            validationErrors.push('Start date is required');
        }
        
        if (!formData.endDate) {
            validationErrors.push('End date is required');
        }
        
        if (formData.numberStudent <= 0) {
            validationErrors.push('Number of students must be greater than 0');
        }
        
        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
            validationErrors.push('End date must be after start date');
        }
        
        if (formData.startDate) {
            const today = new Date();
            const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const startDate = new Date(formData.startDate);
            
            if (startDate < oneWeekFromNow) {
                validationErrors.push('Start date must be at least 1 week from now');
            }
        }
        
        return validationErrors;
    };

    const handleSubmit = async () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const submissionData = {
            name: formData.name,
            teacherId: parseInt(formData.teacherId),
            syllabusId: parseInt(formData.syllabusId),
            numberStudent: parseInt(formData.numberStudent),
            roomNumber: formData.roomNumber,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status,
            grade: formData.grade
        };

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
        
        if (errors.length > 0) {
            setErrors(errors.filter(error => !error.toLowerCase().includes(field.toLowerCase())));
        }
    };

    const gradeOptions = [
        { value: 'SEED', label: 'Seed (Age 3)' },
        { value: 'BUD', label: 'Bud (Age 4)' },
        { value: 'LEAF', label: 'Leaf (Age 5)' }
    ];

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
        { value: 'DRAFT', label: 'Draft' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'ACTIVE_TERM', label: 'Active Term' },
        { value: 'INACTIVE_TERM', label: 'Inactive Term' },
        { value: 'LOCKED_TERM', label: 'Locked Term' }
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                Create New Class
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
                        label="Class Name"
                        value={formData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        required
                        error={errors.some(error => error.includes('Class name'))}
                        helperText="Enter the name for this class"
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Teacher</InputLabel>
                            <Select
                                value={formData.teacherId}
                                onChange={(e) => handleFieldChange('teacherId', e.target.value)}
                                label="Teacher"
                                error={errors.some(error => error.includes('Teacher'))}
                            >
                                {teachers && teachers
                                    .sort((a, b) => {
                                        if (a.isOccupied === b.isOccupied) return 0;
                                        return a.isOccupied ? 1 : -1;
                                    })
                                    .map((teacher) => (
                                        <MenuItem
                                            key={teacher.id}
                                            value={teacher.id}
                                            disabled={teacher.isOccupied}
                                            sx={{
                                                color: teacher.isOccupied ? 'text.disabled' : 'text.primary',
                                                opacity: teacher.isOccupied ? 0.6 : 1
                                            }}
                                        >
                                            {teacher.name || teacher.firstName || teacher.email}
                                            {teacher.isOccupied && ' (occupied)'}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Grade</InputLabel>
                            <Select
                                value={formData.grade}
                                onChange={(e) => handleFieldChange('grade', e.target.value)}
                                label="Grade"
                                error={errors.some(error => error.includes('Grade'))}
                            >
                                {gradeOptions.map((grade) => (
                                    <MenuItem key={grade.value} value={grade.value}>
                                        {grade.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <FormControl fullWidth required>
                        <InputLabel>Syllabus</InputLabel>
                        <Select
                            value={formData.syllabusId}
                            onChange={(e) => handleFieldChange('syllabusId', e.target.value)}
                            label="Syllabus"
                            error={errors.some(error => error.includes('Syllabus'))}
                        >
                            {syllabi && syllabi.map((syllabus) => (
                                <MenuItem key={syllabus.id} value={syllabus.id}>
                                    {syllabus.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Room Number"
                            value={formData.roomNumber}
                            onChange={(e) => handleFieldChange('roomNumber', e.target.value)}
                            required
                            error={errors.some(error => error.includes('Room number'))}
                            helperText="Enter the room number for this class"
                        />

                        <TextField
                            label="Number of Students"
                            type="number"
                            value={formData.numberStudent}
                            onChange={(e) => handleFieldChange('numberStudent', e.target.value)}
                            inputProps={{ min: 1 }}
                            error={errors.some(error => error.includes('Number of students'))}
                            helperText="Maximum capacity for this class (must be greater than 0)"
                        />

                        <FormControl>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => handleFieldChange('status', e.target.value)}
                                label="Status"
                                sx={{ minWidth: 120 }}
                            >
                                {statusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleFieldChange('startDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                            error={errors.some(error => error.includes('Start date'))}
                        />

                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleFieldChange('endDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            required
                            error={errors.some(error => error.includes('End date'))}
                        />
                    </Box>
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
                    Create Class
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ClassForm;