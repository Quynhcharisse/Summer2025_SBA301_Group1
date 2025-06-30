import React, {useCallback, useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {
    ArrowBack,
    CheckCircle,
    Group,
    Person,
    PersonAdd,
    PersonRemove,
    RemoveCircle,
    School,
    Search
} from '@mui/icons-material';
import StudentCard from './StudentCard';
import {useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {
    assignStudentsToClass,
    getAllClasses,
    getAllStudents,
    getStudentClassAssignments,
    getStudentsByClassId,
    unassignStudentsFromClass
} from '../../services/EducationService';
import '../../styles/educationManager/AssignStudentToClass.css';

function AssignStudentToClass() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();    // State
    const [classes, setClasses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState({});
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedAssignedStudents, setSelectedAssignedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [assignedSearchTerm, setAssignedSearchTerm] = useState('');
    const [assignedFilterGrade, setAssignedFilterGrade] = useState('');// Filter options
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
    }, [selectedClass, fetchAssignedStudents]);
    const getAvailableStudents = () => {
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

    const getFilteredAssignedStudents = () => {
        let filtered = assignedStudents;

        // Apply search filter
        if (assignedSearchTerm) {
            const searchLower = assignedSearchTerm.toLowerCase();
            filtered = filtered.filter(student =>
                student.name?.toLowerCase().includes(searchLower) ||
                student.gender?.toLowerCase().includes(searchLower) ||
                student.placeOfBirth?.toLowerCase().includes(searchLower)
            );
        }

        // Apply grade filter based on student age
        if (assignedFilterGrade) {
            filtered = filtered.filter(student => {
                if (!student.dateOfBirth) return false;
                const age = calculateAge(student.dateOfBirth);
                switch (assignedFilterGrade) {
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

        // Check class capacity
        const classData = classes.find(c => c.id === parseInt(selectedClass));
        if (classData && classData.numberStudent) {
            const availableSpots = classData.numberStudent - assignedStudents.length;
            if (selectedStudents.length > availableSpots) {
                enqueueSnackbar(
                    `Cannot assign ${selectedStudents.length} students. Only ${availableSpots} spots available in this class.`,
                    {variant: 'error'}
                );
                return;
            }
        }

        try {
            setSubmitting(true);
            const assignData = {
                classId: parseInt(selectedClass),
                studentIds: selectedStudents
            };

            const response = await assignStudentsToClass(assignData);
            if (response && response.success) {
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

            const response = await unassignStudentsFromClass(unassignData);
            if (response && response.success) {
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

    const selectedClassData = selectedClass ? classes.find(c =>
        c.id === selectedClass || c.id === parseInt(selectedClass) || c.id === String(selectedClass)
    ) : null;
    const availableStudents = getAvailableStudents();
    const filteredAssignedStudents = getFilteredAssignedStudents();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }
    return (<Stack spacing={3} sx={{p: {xs: 2, md: 3}}}>
        {/* Header Stack */}
            <Stack>
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
            </Stack>
            </Stack>
            {/* Class Selection Card */}
            <Card sx={{borderRadius: 2}}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={2}>
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
                            sx={{
                                minHeight: 56,
                                mb: 2 // Add margin bottom to prevent overlap with content below
                            }}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>Select a class</em>;
                                }
                                const selectedClassItem = classes.find(c => c.id === selected);
                                return selectedClassItem ? `${selectedClassItem.name} - ${selectedClassItem.grade}` : selected;
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        maxHeight: 300,
                                        zIndex: 1300,
                                        mt: 1, // Add margin top to create space
                                        '& .MuiMenuItem-root': {
                                            whiteSpace: 'normal',
                                            height: 'auto',
                                            minHeight: 48,
                                            py: 1.5
                                        }
                                    }
                                },
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left'
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>Select a class</em>
                            </MenuItem>
                            {classes.map((classItem) => (
                                <MenuItem key={classItem.id} value={classItem.id}>
                                    <Box>
                                        <Typography variant="body1" fontWeight="medium">
                                            {classItem.name} - {classItem.grade}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Capacity: {classItem.numberStudent || 'No limit'} |
                                            Room: {classItem.roomNumber} |
                                            Teacher: {classItem.teacher?.name || 'Not assigned'}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Show class details after selection */}
                    {selectedClassData && (
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, md: 3 },
                                bgcolor: 'primary.50',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'primary.main',
                                mt: 2,
                                mb: 2 // Add margin bottom to create space after the details box
                            }}
                        >
                            <Stack spacing={2}>
                                <Stack direction="row" alignItems="center" spacing={1}
                                       sx={{minHeight: '36px', flexWrap: 'wrap'}}>
                                    <School sx={{color: 'primary.main', fontSize: 24}}/>
                                    <Typography variant="h6" fontWeight="bold" color="primary.main"
                                                sx={{lineHeight: 1.5}}>
                                        Class Details: {selectedClassData.name}
                                    </Typography>
                                </Stack>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    spacing={2}
                                    sx={{flexWrap: 'wrap', mt: 1}}
                                >
                                    <Box sx={{flex: 1, minWidth: '120px'}}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Grade
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.grade}
                                        </Typography>
                                    </Box>
                                    <Box sx={{flex: 1, minWidth: '120px'}}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Room
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.roomNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{flex: 1, minWidth: '120px'}}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Teacher
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.teacher?.name || 'No teacher assigned'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{flex: 1, minWidth: '120px'}}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Current Students
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {assignedStudents.length}
                                        </Typography>
                                    </Box>
                                    <Box sx={{flex: 1, minWidth: '120px'}}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Class Capacity
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {selectedClassData.numberStudent || 'No limit'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{flex: 1, minWidth: '120px'}}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Available Spots
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            fontWeight="medium"
                                            color={
                                                selectedClassData.numberStudent && assignedStudents.length >= selectedClassData.numberStudent
                                                    ? 'error.main'
                                                    : 'success.main'
                                            }
                                        >
                                            {selectedClassData.numberStudent
                                                ? Math.max(0, selectedClassData.numberStudent - assignedStudents.length)
                                                : 'Unlimited'
                                            }
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Class Capacity Warning */}
                                {selectedClassData.numberStudent && assignedStudents.length >= selectedClassData.numberStudent && (
                                    <Alert
                                        severity="warning"
                                        sx={{
                                            borderRadius: 2,
                                            '& .MuiAlert-message': {
                                                fontWeight: 'medium'
                                            }
                                        }}
                                    >
                                        This class is at maximum capacity ({selectedClassData.numberStudent} students).
                                        You must unassign students before adding new ones.
                                    </Alert>
                                )}
                            </Stack>
                        </Paper>
                    )}
                    {!selectedClassData && selectedClass && (
                        <Alert severity="warning" sx={{mt: 2}}>
                            Class data not found. Please try selecting the class again.
                        </Alert>
                    )}
                </Stack>
            </CardContent>
            </Card> {selectedClass && (
            <Stack
                direction={{xs: 'column', md: 'row'}}
                spacing={3}

            >
                {/* Available Students Section */}
                <Box sx={{flex: 1}}>
                    <Card elevation={2}
                          sx={{borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardContent sx={{p: {xs: 2, md: 3}, flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Stack spacing={3}>
                                <Stack spacing={2}>
                                    <Stack spacing={2}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Person sx={{color: '#1976d2', fontSize: 28}}/>
                                            <Typography variant="h6" color="primary" fontWeight="bold">
                                                Available Students ({availableStudents.length})
                                            </Typography>
                                        </Stack>
                                        <Stack sx={{ml: 4}}>
                                            <Typography variant="caption" color="text.secondary">
                                                Students can only be assigned to one class at a time
                                            </Typography>
                                            {(allStudents.length > availableStudents.length) && (
                                                <Typography variant="caption" color="warning.main"
                                                            sx={{fontWeight: 'medium'}}>
                                                    {Math.max(0, allStudents.length - availableStudents.length - assignedStudents.length) > 0 &&
                                                        `${allStudents.length - availableStudents.length - assignedStudents.length} student(s) already assigned to other classes`}
                                                    {Math.max(0, allStudents.length - availableStudents.length - assignedStudents.length) > 0 &&
                                                        assignedStudents.length > 0 && ` • `}
                                                    {assignedStudents.length > 0 && `${assignedStudents.length} student(s) in current class`}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>


                                    {/* Select All/Deselect All Button removed from here - moved to student list header */}
                                </Stack>

                                {/* Search and Filter Controls Stack */}
                                <Stack spacing={2}>
                                    <Stack
                                        direction={{xs: 'column', md: 'row'}}
                                        spacing={2}
                                        alignItems={{xs: 'stretch', md: 'center'}}
                                    >
                                        <TextField
                                            placeholder="Search students by name, gender, or place of birth..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: <Search sx={{mr: 1, color: 'text.secondary'}}/>
                                            }}
                                            sx={{flex: 1}}
                                            variant="outlined"
                                        />

                                        <FormControl sx={{minWidth: {xs: '100%', md: 200}}}>
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
                                    </Stack>

                                    {/* Selection information moved to the student count display */}

                                    {/* Warning when too many students selected */}
                                    {selectedStudents.length > 0 && selectedClassData?.numberStudent &&
                                        selectedStudents.length > (selectedClassData.numberStudent - assignedStudents.length) && (
                                            <Alert
                                                severity="warning"
                                                sx={{
                                                    borderRadius: 2,
                                                    '& .MuiAlert-message': {
                                                        fontWeight: 'medium'
                                                    }
                                                }}
                                            >
                                                You've selected {selectedStudents.length} students but
                                                only {Math.max(0, selectedClassData.numberStudent - assignedStudents.length)} spots
                                                available.
                                                Please
                                                deselect {selectedStudents.length - (selectedClassData.numberStudent - assignedStudents.length)} student(s).
                                            </Alert>
                                        )}
                                </Stack>

                                {/* Student List */}
                                <Box sx={{flex: 1, minHeight: 0}}>
                                    {availableStudents.length === 0 ? (
                                        <Paper
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                bgcolor: 'grey.50',
                                                borderRadius: 2,
                                                border: '2px dashed',
                                                borderColor: 'grey.300',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Stack spacing={2} alignItems="center">
                                                <Group sx={{fontSize: 64, color: 'text.secondary'}}/>
                                                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                                                    No available students found
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary"
                                                            sx={{textAlign: 'center'}}>
                                                    {allStudents.length > 0
                                                        ? "All students are already assigned to classes (one class per student limit)"
                                                        : "No students found or filtered out by current search criteria"
                                                    }
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    ) : (
                                        <Stack spacing={2} sx={{height: '100%'}}>
                                            {/* Select All/Deselect All Button - moved here to be with student list */}
                                            {availableStudents.length > 0 && (
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    py: 1,
                                                    px: 1,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}>
                                                    <Typography variant="body2" fontWeight="medium" sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: selectedStudents.length > 0 ? (
                                                            selectedClassData?.numberStudent &&
                                                            selectedStudents.length > (selectedClassData.numberStudent - assignedStudents.length)
                                                                ? 'warning.main'
                                                                : 'primary.main'
                                                        ) : 'text.secondary'
                                                    }}>
                                                        {availableStudents.length} student{availableStudents.length !== 1 ? 's' : ''} available
                                                        {selectedStudents.length > 0 && (
                                                            <Chip
                                                                label={`${selectedStudents.length} selected`}
                                                                size="small"
                                                                color={
                                                                    selectedClassData?.numberStudent &&
                                                                    selectedStudents.length > (selectedClassData.numberStudent - assignedStudents.length)
                                                                        ? 'warning'
                                                                        : 'primary'
                                                                }
                                                                sx={{ml: 1, fontWeight: 'medium'}}
                                                            />
                                                        )}
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={handleSelectAll}
                                                        startIcon={selectedStudents.length === availableStudents.length ?
                                                            <RemoveCircle/> : <CheckCircle/>}
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            minWidth: 'auto',
                                                            px: 2
                                                        }}
                                                    >
                                                        {selectedStudents.length === availableStudents.length ? 'Deselect All' : 'Select All'}
                                                    </Button>
                                                </Box>
                                            )}

                                            <Stack
                                                spacing={2}
                                                sx={{
                                                    flex: 1,
                                                    pr: 1
                                                }}
                                            >
                                                {availableStudents.map((student) => (
                                                    <StudentCard 
                                                        key={student.id}
                                                        student={student}
                                                        isSelected={selectedStudents.includes(student.id)}
                                                        onClick={() => handleStudentSelection(student.id)}
                                                        onCheckboxChange={handleStudentSelection}
                                                        variant="available"
                                                        calculateAge={calculateAge}
                                                    />
                                                ))}
                                            </Stack>
                                        </Stack>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>

                        {/* Card Footer with Assign Button */}
                        <Box sx={{
                            p: {xs: 2, md: 3},
                            pt: 0,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'grey.50'
                        }}>
                            <Button
                                variant="contained"
                                startIcon={<PersonAdd/>}
                                onClick={handleAssignStudents}
                                disabled={
                                    selectedStudents.length === 0 ||
                                    submitting ||
                                    !selectedClass ||
                                    (selectedClassData && selectedClassData.numberStudent && (
                                        assignedStudents.length >= selectedClassData.numberStudent ||
                                        selectedStudents.length > (selectedClassData.numberStudent - assignedStudents.length)
                                    ))
                                }
                                size="large"
                                fullWidth
                                sx={{
                                    bgcolor: '#1976d2',
                                    '&:hover': {bgcolor: '#1565c0'},
                                    '&:disabled': {bgcolor: 'grey.300'},
                                    minHeight: 48,
                                    fontWeight: 'bold'
                                }}
                            >
                                {submitting ? (
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CircularProgress size={20} color="inherit"/>
                                        <span>Assigning...</span>
                                    </Stack>
                                ) : (
                                    `Assign ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
                                )}
                            </Button>
                        </Box>
                    </Card>
                </Box>
                {/* Currently Assigned Students Section */}
                <Box sx={{flex: 1}}>
                    <Card elevation={2}
                          sx={{borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <CardContent sx={{p: {xs: 2, md: 3}, flex: 1, display: 'flex', flexDirection: 'column'}}>
                            <Stack spacing={3} sx={{height: '100%'}}>
                                <Stack spacing={2}>
                                    <Stack spacing={2}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <CheckCircle sx={{color: 'success.main', fontSize: 28}}/>
                                            <Typography variant="h6" color="success.main" fontWeight="bold">
                                                Assigned
                                                ({filteredAssignedStudents.length}{assignedSearchTerm || assignedFilterGrade ? ` of ${assignedStudents.length}` : ''})
                                            </Typography>
                                        </Stack>
                                        <Stack sx={{ml: 4}}>
                                            <Typography variant="caption" color="text.secondary">
                                                Click on a student to select or deselect for removal
                                            </Typography>
                                            {(allStudents.length > assignedStudents.length) && (
                                                <Typography variant="caption" color="warning.main"
                                                            sx={{fontWeight: 'medium'}}>
                                                    {Math.max(0, allStudents.length - assignedStudents.length - availableStudents.length) > 0 &&
                                                        `${allStudents.length - assignedStudents.length - availableStudents.length} student(s) already assigned to other classes`}
                                                    {Math.max(0, allStudents.length - assignedStudents.length - availableStudents.length) > 0 &&
                                                        assignedStudents.length > 0 && ` • `}
                                                    {availableStudents.length > 0 && `${availableStudents.length} student(s) available for assignment`}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>

                                    {/* Select All/Deselect All Button removed from here - moved to student list header */}
                                </Stack>

                                {/* Search and Filter Controls for Assigned Students */}
                                <Stack spacing={2}>
                                    <Stack
                                        direction={{xs: 'column', md: 'row'}}
                                        spacing={2}
                                        alignItems={{xs: 'stretch', md: 'center'}}
                                    >
                                        <TextField
                                            placeholder="Search assigned students..."
                                            value={assignedSearchTerm}
                                            onChange={(e) => setAssignedSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: <Search sx={{mr: 1, color: 'text.secondary'}}/>
                                            }}
                                            sx={{flex: 1}}
                                            variant="outlined"
                                        />

                                        <FormControl sx={{minWidth: {xs: '100%', md: 200}}}>
                                            <InputLabel>Filter by Age Group</InputLabel>
                                            <Select
                                                value={assignedFilterGrade}
                                                onChange={(e) => setAssignedFilterGrade(e.target.value)}
                                                label="Filter by Age Group"
                                            >
                                                {gradeOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>

                                    {/* Selection information moved to the student count display */}
                                </Stack>

                                <Box sx={{flex: 1, minHeight: 0}}>
                                    {assignedStudents.length === 0 ? (
                                        <Paper
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                bgcolor: 'grey.50',
                                                borderRadius: 2,
                                                border: '2px dashed',
                                                borderColor: 'grey.300',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Stack spacing={2} alignItems="center">
                                                <CheckCircle sx={{fontSize: 48, color: 'text.secondary'}}/>
                                                <Typography variant="body1" color="text.secondary" fontWeight="medium">
                                                    No students assigned yet
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Students you assign will appear here
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    ) : (
                                        <Stack spacing={2} sx={{height: '100%'}}>
                                            {/* Select All/Deselect All Button - moved here to be with student list */}
                                            {assignedStudents.length > 0 && (
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    py: 1,
                                                    px: 1,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}>
                                                    <Typography variant="body2" fontWeight="medium" sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: selectedAssignedStudents.length > 0 ? 'error.main' : 'text.secondary'
                                                    }}>
                                                        {assignedStudents.length} student{assignedStudents.length !== 1 ? 's' : ''} assigned
                                                        {selectedAssignedStudents.length > 0 && (
                                                            <Chip
                                                                label={`${selectedAssignedStudents.length} selected`}
                                                                size="small"
                                                                color="error"
                                                                sx={{ml: 1, fontWeight: 'medium'}}
                                                            />
                                                        )}
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={handleSelectAllAssigned}
                                                        startIcon={selectedAssignedStudents.length === assignedStudents.length ?
                                                            <RemoveCircle/> : <CheckCircle/>}
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            minWidth: 'auto',
                                                            px: 2
                                                        }}
                                                    >
                                                        {selectedAssignedStudents.length === assignedStudents.length ? 'Deselect All' : 'Select All'}
                                                    </Button>
                                                </Box>
                                            )}

                                            <Stack
                                                spacing={2}
                                                sx={{
                                                    flex: 1,
                                                    pr: 1
                                                }}
                                            >
                                                {assignedStudents.map((student) => (
                                                    <StudentCard
                                                        key={student.id}
                                                        student={student}
                                                        isSelected={selectedAssignedStudents.includes(student.id)}
                                                        onClick={() => handleAssignedStudentSelection(student.id)}
                                                        onCheckboxChange={handleAssignedStudentSelection}
                                                        variant="assigned"
                                                        calculateAge={calculateAge}
                                                    />
                                                ))}
                                            </Stack>
                                        </Stack>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>

                        {/* Card Footer with Unassign Button */}
                        {selectedClass && (
                            <Box sx={{
                                p: {xs: 2, md: 3},
                                pt: 0,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                bgcolor: selectedAssignedStudents.length > 0 ? 'error.50' : 'grey.50'
                            }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<PersonRemove/>}
                                    onClick={handleUnassignStudents}
                                    disabled={selectedAssignedStudents.length === 0 || submitting}
                                    size="large"
                                    fullWidth
                                    sx={{
                                        minHeight: 48,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {submitting ? (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <CircularProgress size={20} color="inherit"/>
                                            <span>Unassigning...</span>
                                        </Stack>
                                    ) : selectedAssignedStudents.length > 0 ? (
                                        `Unassign ${selectedAssignedStudents.length} Student${selectedAssignedStudents.length !== 1 ? 's' : ''}`
                                    ) : (
                                        'Select students to unassign'
                                    )}
                                </Button>
                            </Box>
                        )}
                    </Card>
                </Box>
            </Stack>
        )}
    </Stack>
    );
}

export default AssignStudentToClass;
