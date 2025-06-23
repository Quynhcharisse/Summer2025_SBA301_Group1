import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    Divider,
    CircularProgress,
    TextField,
    Grid,
    Avatar,
    Checkbox,
    Paper,
    Stack
} from '@mui/material';
import {
    ArrowBack,
    School,
    Person,
    PersonAdd,
    Group,
    CheckCircle,
    Search,
    FilterList,
    CheckCircleOutline,
    RemoveCircle,
    PersonRemove
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    getAllClasses,
    getAllStudents,
    getStudentsByClassId,
    assignStudentsToClass,
    unassignStudentsFromClass,
    getStudentClassAssignments
} from '../../services/EducationService';
import '../../styles/educationManager/AssignStudentToClass.css';

function AssignStudentToClass() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();    // State
    const [classes, setClasses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState({});
    const [selectedClass, setSelectedClass] = useState('');const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedAssignedStudents, setSelectedAssignedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState('');// Filter options
    const gradeOptions = [
        { value: '', label: 'All Grades' },
        { value: 'SEED', label: 'Seed (Age 3)' },
        { value: 'BUD', label: 'Bud (Age 4)' },
        { value: 'LEAF', label: 'Leaf (Age 5)' }
    ];    // Define callback functions first
    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesResponse, studentsResponse, assignmentsResponse] = await Promise.all([
                getAllClasses(),
                getAllStudents(),
                getStudentClassAssignments()
            ]);

            if (classesResponse && classesResponse.success) {
                setClasses(classesResponse.data || []);
            }

            if (studentsResponse && studentsResponse.success) {
                setAllStudents(studentsResponse.data || []);
            }

            if (assignmentsResponse && assignmentsResponse.success) {
                setStudentAssignments(assignmentsResponse.data || {});
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            enqueueSnackbar('Error loading data', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    const fetchAssignedStudents = useCallback(async () => {
        try {
            const response = await getStudentsByClassId(selectedClass);
            if (response && response.success) {
                setAssignedStudents(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching assigned students:', error);
            enqueueSnackbar('Error loading assigned students', { variant: 'error' });
        }
    }, [selectedClass, enqueueSnackbar]);

    // Effects
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]); useEffect(() => {
        if (selectedClass) {
            fetchAssignedStudents();
        } else {
            setAssignedStudents([]);
            setSelectedStudents([]);
            setSelectedAssignedStudents([]);
        }
    }, [selectedClass, fetchAssignedStudents]);    const getAvailableStudents = () => {
        // Get all students who are assigned to ANY class
        const assignedStudentIds = new Set();
        Object.keys(studentAssignments).forEach(studentIdString => {
            const studentId = parseInt(studentIdString);
            if (studentAssignments[studentIdString] && studentAssignments[studentIdString].length > 0) {
                assignedStudentIds.add(studentId);
            }
        });
        
        // Filter out students who are already assigned to any class
        const availableStudents = allStudents.filter(student => !assignedStudentIds.has(student.id));

        let filtered = availableStudents;

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(student =>
                student.name?.toLowerCase().includes(searchLower) ||
                student.gender?.toLowerCase().includes(searchLower) ||
                student.placeOfBirth?.toLowerCase().includes(searchLower)
            );
        }

        // Apply grade filter based on student age
        if (filterGrade) {
            filtered = filtered.filter(student => {
                if (!student.dateOfBirth) return false;
                const age = calculateAge(student.dateOfBirth);
                switch (filterGrade) {
                    case 'SEED':
                        return age <= 3;
                    case 'BUD':
                        return age === 4;
                    case 'LEAF':
                        return age >= 5;
                    default:
                        return true;
                }
            });
        }

        return filtered;
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            return age - 1;
        }
        return age;
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSelectAll = () => {
        const availableStudents = getAvailableStudents();
        const availableIds = availableStudents.map(s => s.id);

        if (selectedStudents.length === availableIds.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(availableIds);
        }
    };

    const handleAssignStudents = async () => {
        if (!selectedClass || selectedStudents.length === 0) {
            enqueueSnackbar('Please select a class and at least one student', { variant: 'warning' });
            return;
        }

        try {
            setSubmitting(true);
            const assignData = {
                classId: parseInt(selectedClass),
                studentIds: selectedStudents
            };

            const response = await assignStudentsToClass(assignData);            if (response && response.success) {
                enqueueSnackbar(`Successfully assigned ${selectedStudents.length} student(s) to class`, { variant: 'success' });
                setSelectedStudents([]);
                await Promise.all([
                    fetchAssignedStudents(),
                    fetchInitialData() // Refresh student assignments
                ]);
            } else {
                enqueueSnackbar(response?.message || 'Failed to assign students', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error assigning students:', error);
            enqueueSnackbar(error.details || 'Error assigning students to class', { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnassignStudents = async () => {
        if (!selectedClass || selectedAssignedStudents.length === 0) {
            enqueueSnackbar('Please select at least one assigned student to unassign', { variant: 'warning' });
            return;
        }

        try {
            setSubmitting(true);
            const unassignData = {
                classId: parseInt(selectedClass),
                studentIds: selectedAssignedStudents
            };

            const response = await unassignStudentsFromClass(unassignData);            if (response && response.success) {
                enqueueSnackbar(`Successfully unassigned ${selectedAssignedStudents.length} student(s) from class`, { variant: 'success' });
                setSelectedAssignedStudents([]);
                await Promise.all([
                    fetchAssignedStudents(),
                    fetchInitialData() // Refresh student assignments
                ]);
            } else {
                enqueueSnackbar(response?.message || 'Failed to unassign students', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error unassigning students:', error);
            enqueueSnackbar(error.details || 'Error unassigning students from class', { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignedStudentSelection = (studentId) => {
        setSelectedAssignedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleSelectAllAssigned = () => {
        if (selectedAssignedStudents.length === assignedStudents.length) {
            setSelectedAssignedStudents([]);
        } else {
            setSelectedAssignedStudents(assignedStudents.map(s => s.id));
        }
    };

    const selectedClassData = classes.find(c => c.id === parseInt(selectedClass));
    const availableStudents = getAvailableStudents();

    const getStudentClasses = (studentId) => {
        return studentAssignments[studentId] || [];
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    } return (<Stack spacing={3} sx={{ p: { xs: 2, md: 3 }, width: '100%', minHeight: '100vh' }}>
        {/* Header Stack */}
        <Stack
            direction={{ xs: 'column', lg: 'row' }}
            alignItems={{ xs: 'flex-start', lg: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 1 }}
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack color='#1976d2' />}
                    onClick={() => navigate('/education/classes')}
                    sx={{
                        color: '#1976d2',
                        borderColor: '#1976d2'
                    }}
                >
                    Back to Classes
                </Button>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: '#1976d2',
                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                    }}
                >
                    Assign Students to Class
                </Typography>
            </Stack>                {/* Action Buttons in Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ width: { xs: '100%', lg: 'auto' } }}
            >
                <Button
                    variant="outlined"
                    onClick={() => navigate('/education/classes')}
                    size="large"
                    sx={{
                        minHeight: 48,
                        borderColor: 'grey.400',
                        color: 'text.primary'
                    }}
                >
                    Cancel
                </Button>
                {selectedClass && selectedAssignedStudents.length > 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<PersonRemove />}
                        onClick={handleUnassignStudents}
                        disabled={submitting}
                        size="large"
                        sx={{
                            minWidth: { xs: '100%', sm: 200 },
                            minHeight: 48,
                            fontWeight: 'bold'
                        }}
                    >
                        {submitting ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <CircularProgress size={20} color="inherit" />
                                <span>Unassigning...</span>
                            </Stack>
                        ) : (
                            `Unassign ${selectedAssignedStudents.length} Student${selectedAssignedStudents.length !== 1 ? 's' : ''}`
                        )}
                    </Button>
                )}
                <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={handleAssignStudents}
                    disabled={selectedStudents.length === 0 || submitting || !selectedClass}
                    size="large"
                    sx={{
                        bgcolor: '#1976d2',
                        '&:hover': { bgcolor: '#1565c0' },
                        '&:disabled': { bgcolor: 'grey.300' },
                        minWidth: { xs: '100%', sm: 250 },
                        minHeight: 48,
                        fontWeight: 'bold'
                    }}
                >
                    {submitting ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <CircularProgress size={20} color="inherit" />
                            <span>Assigning...</span>
                        </Stack>
                    ) : (
                        `Assign ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
                    )}
                </Button>
            </Stack>
        </Stack>{/* Class Selection Card */}
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <School sx={{ color: '#1976d2', fontSize: 28 }} />
                        <Typography variant="h6" color="primary" fontWeight="bold">
                            Select Class
                        </Typography>
                    </Stack>

                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            label="Class"
                            sx={{ minHeight: 56 }}
                        >
                            <MenuItem value="">
                                <em>Select a class</em>
                            </MenuItem>
                            {classes.map((classItem) => (
                                <MenuItem key={classItem.id} value={classItem.id}>
                                    {classItem.name} - {classItem.grade} ({classItem.numberStudent || 0} students)
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedClassData && (
                        <Paper
                            sx={{
                                p: { xs: 2, md: 3 },
                                bgcolor: 'grey.50',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            <Stack spacing={2}>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    {selectedClassData.name}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Grade
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.grade}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Room
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.roomNumber}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Teacher
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.teacher?.name || 'No teacher assigned'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Current Students
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {assignedStudents.length}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Paper>
                    )}
                </Stack>
            </CardContent>
        </Card>            {selectedClass && (<Grid container spacing={3} sx={{ height: 'fit-content' }}>
            {/* Available Students Section */}
            <Grid item xs={12} lg={8}>
                <Card elevation={2} sx={{ borderRadius: 2, height: 'fit-content' }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack spacing={3}>                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Person sx={{ color: '#1976d2', fontSize: 28 }} />
                                <Stack>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        Available Students ({availableStudents.length})
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Students can only be assigned to one class at a time
                                    </Typography>
                                    {allStudents.length > availableStudents.length && (
                                        <Typography variant="caption" color="warning.main" sx={{ fontWeight: 'medium' }}>
                                            {allStudents.length - availableStudents.length} student(s) already assigned to other classes
                                        </Typography>
                                    )}
                                </Stack>
                            </Stack>

                            {/* Search and Filter Controls Stack */}
                            <Stack spacing={2}>                                        <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={2}
                                alignItems={{ xs: 'stretch', md: 'center' }}
                            >
                                <TextField
                                    placeholder="Search students by name, gender, or place of birth..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                    sx={{ flex: 1 }}
                                    variant="outlined"
                                />

                                <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
                                    <InputLabel>Filter by Age Group</InputLabel>
                                    <Select
                                        value={filterGrade}
                                        onChange={(e) => setFilterGrade(e.target.value)}
                                        label="Filter by Age Group"
                                    >
                                        {gradeOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="outlined"
                                    onClick={handleSelectAll}
                                    disabled={availableStudents.length === 0}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        minWidth: { xs: '100%', md: 140 }
                                    }}
                                >
                                    {selectedStudents.length === availableStudents.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </Stack>

                                {selectedStudents.length > 0 && (
                                    <Alert
                                        severity="info"
                                        sx={{
                                            borderRadius: 2,
                                            '& .MuiAlert-message': {
                                                fontWeight: 'medium'
                                            }
                                        }}
                                    >
                                        {selectedStudents.length} student(s) selected for assignment
                                    </Alert>
                                )}
                            </Stack>                                    {/* Student List */}
                            <Stack spacing={2}>
                                {availableStudents.length === 0 ? (
                                    <Paper
                                        sx={{
                                            p: 4,
                                            textAlign: 'center',
                                            bgcolor: 'grey.50',
                                            borderRadius: 2,
                                            border: '2px dashed',
                                            borderColor: 'grey.300'
                                        }}
                                    >                                        <Stack spacing={2} alignItems="center">
                                            <Group sx={{ fontSize: 64, color: 'text.secondary' }} />
                                            <Typography variant="h6" color="text.secondary" fontWeight="medium">
                                                No available students found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                                {allStudents.length > 0 
                                                    ? "All students are already assigned to classes (one class per student limit)"
                                                    : "No students found or filtered out by current search criteria"
                                                }
                                            </Typography>
                                        </Stack>
                                    </Paper>) : (
                                    <Stack
                                        spacing={2}
                                        sx={{
                                            maxHeight: 'calc(100vh - 400px)',
                                            overflow: 'auto',
                                            pr: 1 // Add padding for scrollbar
                                        }}
                                    >
                                        {availableStudents.map((student) => (
                                            <Paper
                                                key={student.id}
                                                elevation={selectedStudents.includes(student.id) ? 4 : 2}
                                                sx={{
                                                    p: { xs: 2, md: 3 },
                                                    border: '2px solid',
                                                    borderColor: selectedStudents.includes(student.id)
                                                        ? 'primary.main'
                                                        : 'transparent',
                                                    bgcolor: selectedStudents.includes(student.id)
                                                        ? 'primary.50'
                                                        : 'background.paper',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    borderRadius: 2,
                                                    '&:hover': {
                                                        boxShadow: 2,
                                                    }
                                                }}
                                                onClick={() => handleStudentSelection(student.id)}
                                            >
                                                <Stack
                                                    direction={{ xs: 'column', sm: 'row' }}
                                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                                    spacing={3}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={2}
                                                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                                                    >
                                                        <Avatar
                                                            src={student.profileImage}
                                                            sx={{
                                                                bgcolor: 'primary.main',
                                                                width: { xs: 56, md: 64 },
                                                                height: { xs: 56, md: 64 },
                                                                fontSize: { xs: '1.5rem', md: '1.75rem' }
                                                            }}
                                                        >
                                                            {student.name?.charAt(0)?.toUpperCase()}
                                                        </Avatar>

                                                        <Stack spacing={1} sx={{ flex: 1 }}>
                                                            <Stack
                                                                direction={{ xs: 'column', sm: 'row' }}
                                                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                                                spacing={1}
                                                            >
                                                                <Typography
                                                                    variant="h6"
                                                                    fontWeight="bold"
                                                                    sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                                                                >
                                                                    {student.name}
                                                                </Typography>
                                                                <Chip
                                                                    label={`Age ${calculateAge(student.dateOfBirth)}`}
                                                                    size="small"
                                                                    color="secondary"
                                                                    sx={{ fontWeight: 'medium' }}
                                                                />
                                                            </Stack>                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12} sm={4}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Gender:</strong> {student.gender}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Born:</strong> {student.dateOfBirth}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12} sm={4}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        <strong>Place:</strong> {student.placeOfBirth}
                                                                    </Typography>
                                                                </Grid>
                                                                {getStudentClasses(student.id).length > 0 && (
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                            <strong>Currently assigned to:</strong>
                                                                        </Typography>
                                                                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                                                                            {getStudentClasses(student.id).map((classInfo, index) => (
                                                                                <Chip
                                                                                    key={index}
                                                                                    label={`${classInfo.className} (${classInfo.classGrade})`}
                                                                                    size="small"
                                                                                    variant="outlined"
                                                                                    color="info"
                                                                                    sx={{ fontSize: '0.75rem' }}
                                                                                />
                                                                            ))}
                                                                        </Stack>
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                        </Stack>
                                                    </Stack>

                                                    <Checkbox
                                                        icon={<CheckCircleOutline color='primary' />}
                                                        checkedIcon={<CheckCircle color='primary' />}
                                                        color="primary"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            handleStudentSelection(student.id);
                                                        }}
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: { xs: 28, md: 32 }
                                                            }
                                                        }}
                                                    />
                                                </Stack>
                                            </Paper>
                                        ))}
                                    </Stack>
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>                    {/* Currently Assigned Students Section */}
            <Grid item xs={12} lg={4}>
                <Card
                    elevation={2}
                    sx={{
                        height: 'fit-content',
                        borderRadius: 2,
                        position: { lg: 'sticky' },
                        top: { lg: 24 }
                    }}
                >                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack spacing={3}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
                                    <Typography variant="h6" color="success.main" fontWeight="bold">
                                        Assigned ({assignedStudents.length})
                                    </Typography>
                                </Stack>
                                {assignedStudents.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleSelectAllAssigned}
                                        sx={{
                                            fontSize: '0.75rem',
                                            minWidth: 'auto',
                                            px: 1
                                        }}
                                    >
                                        {selectedAssignedStudents.length === assignedStudents.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                )}
                            </Stack>

                            {selectedAssignedStudents.length > 0 && (
                                <Alert
                                    severity="warning"
                                    sx={{
                                        borderRadius: 2,
                                        '& .MuiAlert-message': {
                                            fontWeight: 'medium'
                                        }
                                    }}
                                >
                                    {selectedAssignedStudents.length} student(s) selected for removal
                                </Alert>
                            )}

                            {assignedStudents.length === 0 ? (
                                <Paper
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        border: '2px dashed',
                                        borderColor: 'grey.300'
                                    }}
                                >
                                    <Stack spacing={2} alignItems="center">
                                        <CheckCircle sx={{ fontSize: 48, color: 'text.secondary' }} />
                                        <Typography variant="body1" color="text.secondary" fontWeight="medium">
                                            No students assigned yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Students you assign will appear here
                                        </Typography>
                                    </Stack>
                                </Paper>
                            ) : (<Stack
                                spacing={2}
                                sx={{
                                    maxHeight: 'calc(100vh - 450px)',
                                    overflow: 'auto',
                                    pr: 1
                                }}
                            >
                                {assignedStudents.map((student) => (
                                    <Paper
                                        key={student.id}
                                        elevation={selectedAssignedStudents.includes(student.id) ? 4 : 2}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: selectedAssignedStudents.includes(student.id)
                                                ? 'error.main'
                                                : 'success.200',
                                            bgcolor: selectedAssignedStudents.includes(student.id)
                                                ? 'error.50'
                                                : 'success.50',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: 3,
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                        onClick={() => handleAssignedStudentSelection(student.id)}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar
                                                src={student.profileImage}
                                                sx={{
                                                    bgcolor: selectedAssignedStudents.includes(student.id)
                                                        ? 'error.main'
                                                        : 'success.main',
                                                    width: 48,
                                                    height: 48,
                                                    fontSize: '1.25rem'
                                                }}
                                            >
                                                {student.name?.charAt(0)?.toUpperCase()}
                                            </Avatar>
                                            <Stack spacing={0.5} sx={{ flex: 1 }}>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {student.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Age {calculateAge(student.dateOfBirth)} • {student.gender}
                                                </Typography>
                                            </Stack>
                                            <Checkbox
                                                icon={<CheckCircleOutline color='primary' />}
                                                checkedIcon={<RemoveCircle color='primary' />}
                                                color={selectedAssignedStudents.includes(student.id) ? 'error' : 'success'}
                                                checked={selectedAssignedStudents.includes(student.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleAssignedStudentSelection(student.id);
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: 24
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                            )}                                </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        )}
    </Stack>
    );
}

export default AssignStudentToClass;
