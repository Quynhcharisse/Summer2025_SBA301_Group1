import React, { useState, useCallback, useEffect } from 'react';
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
    MenuItem} from '@mui/material';
import {
    Assignment,
    CalendarToday,
    Person,
    School,
    Edit,
    Save,
    Cancel,
    PersonAdd
} from '@mui/icons-material';
import { getRoomAvailability } from '../../services/EducationService.jsx';
import { useNavigate } from 'react-router-dom';

const ClassInformation = ({
    classData,
    syllabus,
    classLessons,
    onTeacherClick,
    teachers = [],
    syllabi,
    onUpdateClass,
    isCreateMode
}) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(isCreateMode);
    const [showAllLessons, setShowAllLessons] = useState(false);
    const [editData, setEditData] = useState({});
    const [errors, setErrors] = useState([]);
    const [roomAvailability, setRoomAvailability] = useState([]);

    const initializeEditData = useCallback(() => {
        setEditData({
            name: classData?.name || '',
            teacherId: classData?.teacher?.id || null,
            syllabusId: classData?.syllabus?.id || null,
            numberStudent: classData?.numberStudent || 1,
            roomNumber: classData?.roomNumber || null,
            startDate: classData?.startDate ? new Date(classData.startDate).getFullYear().toString() : '',
            status: classData?.status?.toUpperCase() || '',
            grade: classData?.grade || ''
        });
    }, [classData]);

    useEffect(() => {
        if (isCreateMode || classData) {
            initializeEditData();
        }
    }, [isCreateMode, classData, initializeEditData]);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const data = await getRoomAvailability();
                setRoomAvailability(data);
            } catch (error) {
                console.error('Failed to fetch room availability:', error);
                setErrors(prev => [...prev, 'Failed to load room availability.']);
            }
        };

        if (isEditing) {
            fetchRoomData();
        }
    }, [isEditing]);

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
        
        if (editData.roomNumber === null || editData.roomNumber === undefined || isNaN(editData.roomNumber)) {
            validationErrors.push('Room number is required');
        }
        
        if (!editData.startDate) {
            validationErrors.push('Start date is required');
        }
        
        if (editData.numberStudent <= 0) {
            validationErrors.push('Number of students must be greater than 0');
        }
        
        if (editData.startDate) {
            const currentYear = new Date().getFullYear();
            const startYear = parseInt(editData.startDate);
            if (startYear < currentYear) {
                validationErrors.push('Start year cannot be in the past');
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
            const updatedClassData = { ...editData };
            if (updatedClassData.startDate) {
                updatedClassData.startDate = `${updatedClassData.startDate}-09-01`;
            }
            updatedClassData.endDate = `${parseInt(updatedClassData.startDate) + 1}-05-31`;

            if (isCreateMode) {
                await onUpdateClass(updatedClassData);
            } else {
                await onUpdateClass(classData.id, updatedClassData);
            }
            
            setIsEditing(false);
            setErrors([]);
        } catch (error) {
            console.error('Error updating class:', error);
            setErrors(['Failed to update class']);
        }
    };

    const handleFieldChange = (field, value) => {
        setEditData(prev => {
            let processedValue = value;
            if (field === 'roomNumber') {
                processedValue = parseInt(value, 10);
                if (isNaN(processedValue)) {
                    processedValue = ''; // Handle invalid input, e.g., empty string
                }
            }
            const newState = {
                ...prev,
                [field]: processedValue
            };

            if (field === 'startDate' && value) {
                const startYear = parseInt(value);
                if (!isNaN(startYear)) {
                    newState.endDate = (startYear + 1).toString();
                }
            }
            return newState;
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
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'DRAFT', label: 'Draft' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatSchoolYear = (startDateString, endDateString) => {
        if (!startDateString || !endDateString) return 'Not set';
        const startYear = new Date(startDateString).getFullYear();
        const endYear = new Date(endDateString).getFullYear();
        return `${startYear} - ${endYear}`;
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
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <School sx={{color: '#1976d2'}}/>
                            <Typography variant="h6" color="primary">
                                Basic Information
                            </Typography>
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
                                    {!isEditing && <InputLabel shrink={false}>Status</InputLabel>}
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
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                <Person sx={{color: '#1976d2'}}/>
                                <Typography variant="h6" color="primary">
                                    Details
                                </Typography>
                            </Box>
                            {/* Edit button positioned to the right of Details heading */}
                            {isCreateMode ? (
                                <Button
                                    variant="contained"
                                    startIcon={<Save sx={{ color: 'white' }} />}
                                    onClick={handleSave}
                                    size="small"
                                    color="primary"
                                >
                                    Create
                                </Button>
                            ) : (
                                !isEditing ? (
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
                                )
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Teacher</Typography>
                            {isEditing ? (
                                <FormControl size="small" fullWidth>
                                    {!isEditing && <InputLabel shrink={false}>Teacher</InputLabel>}
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
                                <FormControl size="small" fullWidth error={errors.some(error => error.includes('Room number'))}>
                                    <Select
                                        value={editData.roomNumber}
                                        onChange={(e) => handleFieldChange('roomNumber', e.target.value)}
                                        displayEmpty // Allows displaying the placeholder when value is null/undefined
                                        renderValue={(selected) => {
                                            if (selected === null || selected === '') {
                                                return <em>Room Number</em>; // Placeholder text
                                                }
                                                return selected;
                                            }}
                                    >
                                        {roomAvailability
                                            .sort((a, b) => {
                                                if (a.occupied === b.occupied) return 0;
                                                return a.occupied ? 1 : -1;
                                            })
                                            .map((room) => {
                                                const isCurrentRoom = room.roomNumber.toString() === classData?.roomNumber?.toString();
                                                const isDisabled = room.occupied && !isCurrentRoom;
                                                const showOccupied = room.occupied && !isCurrentRoom;

                                            return (
                                                <MenuItem
                                                    key={room.roomNumber}
                                                    value={room.roomNumber}
                                                    disabled={isDisabled}
                                                    sx={{
                                                        color: isDisabled ? 'text.disabled' : 'text.primary',
                                                        opacity: isDisabled ? 0.6 : 1
                                                    }}
                                                >
                                                    {`${room.roomNumber}`}
                                                    {showOccupied && ' (occupied)'}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Typography variant="body1">{classData?.roomNumber ? classData.roomNumber : 'Not assigned'}</Typography>
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body1">{classData?.numberOfStudents || 0} / {classData?.numberStudent || 'N/A'}</Typography>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<PersonAdd sx={{ color: 'white' }} />}
                                        onClick={() => navigate('/education/assign-students', { state: { classId: classData.id } })}
                                        sx={{
                                            backgroundColor: '#4caf50',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#388e3c',
                                            },
                                        }}
                                    >
                                        Assign
                                    </Button>
                                </Box>
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
                        Class Period
                    </Typography>
                </Box>
                <Box sx={{display: 'flex', gap: 2}}>
                    <Box sx={{flex: 1}}>
                        {isEditing ? (
                            <TextField
                                type="number"
                                size="small"
                                sx={{ width: '120px' }}
                                label="Start Year"
                                value={editData.startDate}
                                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                error={errors.some(error => error.includes('Start date'))}
                                inputProps={{ min: 1900, max: 2100 }}
                            />
                        ) : (
                            <Box>
                                <Typography variant="body2" color="text.secondary">School Year</Typography>
                                <Typography variant="body1">{formatSchoolYear(classData?.startDate, classData?.endDate)}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Syllabus Section */}
            <Box>
                <Divider sx={{my: 2}}/>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Assignment sx={{ color: '#1976d2' }} />
                    <Typography variant="h6" color="primary">
                        Syllabus Information
                    </Typography>
                </Box>
                {isEditing ? (
                    <FormControl size="small" fullWidth>
                        <InputLabel>Syllabus</InputLabel>
                        <Select
                            value={editData.syllabusId}
                            onChange={(e) => handleFieldChange('syllabusId', e.target.value)}
                            label="Syllabus"
                            error={errors.some(error => error.includes('Syllabus'))}
                        >
                            {syllabi && syllabi.map((syl) => (
                                <MenuItem key={syl.id} value={syl.id}>
                                    {syl.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    syllabus ? (
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
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Associated Lessons ({classLessons.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {(showAllLessons ? classLessons : classLessons.slice(0, 5)).map((lesson) => (
                                            <Chip
                                                key={lesson.id}
                                                label={lesson.topic}
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => navigate(`/education/lessons/${lesson.id}`, { state: { from: `/education/classes/${classData.id}` } })}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        ))}
                                        {!showAllLessons && classLessons.length > 5 && (
                                            <Chip
                                                label={`+${classLessons.length - 5} more`}
                                                size="small"
                                                variant="outlined"
                                                onClick={() => setShowAllLessons(true)}
                                                sx={{ cursor: 'pointer' }}
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
                    )
                )}
            </Box>
        </Box>
    );
};

export default ClassInformation;