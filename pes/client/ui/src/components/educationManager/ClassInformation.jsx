import React from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Stack,
    Typography
} from '@mui/material';
import {
    Assignment,
    CalendarToday,
    Person,
    School
} from '@mui/icons-material';

const ClassInformation = ({ classData, syllabus, classLessons, onTeacherClick }) => {
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
                            <Typography variant="h6">{classData?.name || 'Unknown'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Grade</Typography>
                            <Chip label={classData?.grade || 'Not specified'} color="primary" size="small"/>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Status</Typography>
                            <Chip
                                label={classData?.status || 'Unknown'}
                                color={getStatusColor(classData?.status)}
                                size="small"
                            />
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
                            {classData?.teacher ? (
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
                            )}
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Room Number</Typography>
                            <Typography variant="body1">{classData?.roomNumber || 'Not assigned'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Number of Students</Typography>
                            <Typography variant="body1">{classData?.numberStudent || 0} students</Typography>
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
                        <Typography variant="body1">{formatDate(classData?.startDate)}</Typography>
                    </Box>
                    <Box sx={{flex: 1}}>
                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1">{formatDate(classData?.endDate)}</Typography>
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