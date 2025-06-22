import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Stack,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    Assignment,
    CalendarToday,
    Person,
    School,
    Edit,
    Save,
    Cancel
} from '@mui/icons-material';

const ClassInformation = ({
    classData,
    syllabus,
    classLessons,
    onTeacherClick,
    teachers = [],
    syllabi = [],
    onUpdateClass
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [errors, setErrors] = useState([]);

    const initializeEditData = () => {
        setEditData({
            name: classData?.name || '',
            teacherId: classData?.teacher?.id || '',
            syllabusId: classData?.syllabus?.id || '',
            numberStudent: classData?.numberStudent || 1,
            roomNumber: classData?.roomNumber || '',
            startDate: classData?.startDate || '',
            endDate: classData?.endDate || '',
            status: classData?.status || 'active',
            grade: classData?.grade || ''
        });
    };

    const validateForm = () => {
        const validationErrors = [];
        
        if (!editData.name?.trim()) {
            validationErrors.push('Class name is required');
        }
        
        if (!editData.teacherId) {
            validationErrors.push('Teacher is required');
        }
        
        if (!editData.syllabusId) {
            validationErrors.push('Syllabus is required');
        }
        
        if (!editData.grade) {
            validationErrors.push('Grade is required');
        }
        
        if (!editData.roomNumber?.trim()) {
            validationErrors.push('Room number is required');
        }
        
        if (!editData.startDate) {
            validationErrors.push('Start date is required');
        }
        
        if (!editData.endDate) {
            validationErrors.push('End date is required');
        }
        
        if (editData.numberStudent <= 0) {
            validationErrors.push('Number of students must be greater than 0');
        }
        
        if (editData.startDate && editData.endDate && new Date(editData.startDate) >= new Date(editData.endDate)) {
            validationErrors.push('End date must be after start date');
        }
        
        if (editData.startDate) {
            const today = new Date();
            const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const startDate = new Date(editData.startDate);
            
            if (startDate < oneWeekFromNow) {
                validationErrors.push('Start date must be at least 1 week from now');
            }
        }
        
        return validationErrors;
    };

    const handleEdit = () => {
        initializeEditData();
        setIsEditing(true);
        setErrors([]);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({});
        setErrors([]);
    };

    const handleSave = async () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await onUpdateClass(classData.id, editData);
            setIsEditing(false);
            setErrors([]);
        } catch (error) {
            console.error('Error updating class:', error);
            setErrors(['Failed to update class']);
        }
    };

    const handleFieldChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
        
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
        { value: 'pending', label: 'Pending' }
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {/* Error display */}
            {errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.join(', ')}
                </Alert>
            )}

            <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                gap: 3
            }}>
                <Box sx={{flex: 1}}>
                    <Stack spacing={2}>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <School sx={{color: '#1976d2'}}/>
                                <Typography variant="h6" color="primary">
                                    Basic Information
                                </Typography>
                            </Box>
                            {/* Edit button positioned inline with Basic Information heading */}
                            {!isEditing ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<Edit sx={{ color: '#1976d2' }} />}
                                    onClick={handleEdit}
                                    size="small"
                                    sx={{
                                        borderColor: '#1976d2',
                                        color: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            borderColor: '#1976d2'
                                        }
                                    }}
                                >
                                    Edit Class
                                </Button>
                            ) : (
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        startIcon={<Save sx={{ color: 'white' }} />}
                                        onClick={handleSave}
                                        size="small"
                                        color="primary"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel sx={{ color: '#666' }} />}
                                        onClick={handleCancel}
                                        size="small"
                                        sx={{
                                            borderColor: '#666',
                                            color: '#666',
                                            '&:hover': {
                                                backgroundColor: 'rgba(102, 102, 102, 0.08)',
                                                borderColor: '#666'
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Class Name</Typography>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    value={editData.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    size="small"
                                    error={errors.some(error => error.includes('Class name'))}
                                />
                            ) : (
                                <Typography variant="h6">{classData?.name || 'Unknown'}</Typography>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Grade</Typography>
                            {isEditing ? (
                                <FormControl size="small" fullWidth>
                                    <Select
                                        value={editData.grade}
                                        onChange={(e) => handleFieldChange('grade', e.target.value)}
                                        error={errors.some(error => error.includes('Grade'))}
                                    >
                                        {gradeOptions.map((grade) => (
                                            <MenuItem key={grade.value} value={grade.value}>
                                                {grade.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Chip label={classData?.grade || 'Not specified'} color="primary" size="small"/>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Status</Typography>
                            {isEditing ? (
                                <FormControl size="small" fullWidth>
                                    <Select
                                        value={editData.status}
                                        onChange={(e) => handleFieldChange('status', e.target.value)}
                                    >
                                        {statusOptions.map((status) => (
                                            <MenuItem key={status.value} value={status.value}>
                                                {status.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Chip
                                    label={classData?.status || 'Unknown'}
                                    color={getStatusColor(classData?.status)}
                                    size="small"
                                />
                            )}
                        </Box>
                    </Stack>
                </Box>
                <Box sx={{flex: 1}}>
                    <Stack spacing={2}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Person sx={{color: '#1976d2'}}/>
                            <Typography variant="h6" color="primary">
                                Details
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Teacher</Typography>
                            {isEditing ? (
                                <FormControl size="small" fullWidth>
                                    <Select
                                        value={editData.teacherId}
                                        onChange={(e) => handleFieldChange('teacherId', e.target.value)}
                                        error={errors.some(error => error.includes('Teacher'))}
                                    >
                                        {teachers && teachers
                                            .sort((a, b) => {
                                                if (a.isOccupied === b.isOccupied) return 0;
                                                return a.isOccupied ? 1 : -1;
                                            })
                                            .map((teacher) => {
                                                const isCurrentTeacher = teacher.id === classData?.teacher?.id;
                                                const isDisabled = teacher.isOccupied && !isCurrentTeacher;
                                                const showOccupied = teacher.isOccupied && !isCurrentTeacher;
                                                
                                                return (
                                                    <MenuItem
                                                        key={teacher.id}
                                                        value={teacher.id}
                                                        disabled={isDisabled}
                                                        sx={{
                                                            color: isDisabled ? 'text.disabled' : 'text.primary',
                                                            opacity: isDisabled ? 0.6 : 1
                                                        }}
                                                    >
                                                        {teacher.name || teacher.firstName || teacher.email}
                                                        {showOccupied && ' (occupied)'}
                                                    </MenuItem>
                                                );
                                            })}
                                    </Select>
                                </FormControl>
                            ) : (
                                classData?.teacher ? (
                                    <Button
                                        variant="text"
                                        onClick={() => onTeacherClick && onTeacherClick(classData.teacher)}
                                        sx={{
                                            textTransform: 'none',
                                            color: '#1976d2',
                                            p: 0,
                                            minWidth: 'auto',
                                            justifyContent: 'flex-start',
                                            '&:hover': {
                                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {classData.teacher.name || 'Unknown Teacher'}
                                        </Typography>
                                    </Button>
                                ) : (
                                    <Typography variant="body1" color="text.secondary">
                                        Not assigned
                                    </Typography>
                                )
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Room Number</Typography>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={editData.roomNumber}
                                    onChange={(e) => handleFieldChange('roomNumber', e.target.value)}
                                    error={errors.some(error => error.includes('Room number'))}
                                />
                            ) : (
                                <Typography variant="body1">{classData?.roomNumber || 'Not assigned'}</Typography>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Number of Students</Typography>
                            {isEditing ? (
                                <TextField
                                    type="number"
                                    size="small"
                                    value={editData.numberStudent}
                                    onChange={(e) => handleFieldChange('numberStudent', e.target.value)}
                                    inputProps={{ min: 1 }}
                                    error={errors.some(error => error.includes('Number of students'))}
                                    helperText="Must be greater than 0"
                                />
                            ) : (
                                <Typography variant="body1">{classData?.numberStudent || 0} students</Typography>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Box>
                <Divider sx={{my: 2}}/>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                    <CalendarToday sx={{color: '#1976d2'}}/>
                    <Typography variant="h6" color="primary">
                        Schedule Period
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Box sx={{flex: 1}}>
                        <Typography variant="body2" color="text.secondary">Start Date</Typography>
                        {isEditing ? (
                            <TextField
                                type="date"
                                size="small"
                                fullWidth
                                value={editData.startDate}
                                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                error={errors.some(error => error.includes('Start date'))}
                            />
                        ) : (
                            <Typography variant="body1">{formatDate(classData?.startDate)}</Typography>
                        )}
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                        {isEditing ? (
                            <TextField
                                type="date"
                                size="small"
                                fullWidth
                                value={editData.endDate}
                                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                error={errors.some(error => error.includes('End date'))}
                            />
                        ) : (
                            <Typography variant="body1">{formatDate(classData?.endDate)}</Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Syllabus Section */}
            <Box>
                <Divider sx={{my: 2}}/>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                    <Assignment sx={{color: '#1976d2'}}/>
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
                        {classLessons.length > 0 && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                    Associated Lessons ({classLessons.length})
                                </Typography>
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
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
};

export default ClassInformation;