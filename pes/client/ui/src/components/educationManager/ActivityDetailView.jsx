import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    AccessTime,
    CalendarToday,
    Class,
    Close,
    Description,
    Edit,
    LocationOn,
    MenuBook,
    Schedule,
    School,
    Topic
} from '@mui/icons-material';
import { getActivityById } from '../../services/EducationService';

const ActivityDetailView = ({
    activity,
    open,
    onClose,
    onEdit,
    fetchDetailedInfo = false
}) => {
    const [detailedActivity, setDetailedActivity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch detailed activity information if requested
    useEffect(() => {
        const fetchDetailedActivity = async () => {
            if (!open || !activity?.id || !fetchDetailedInfo) {
                setDetailedActivity(null);
                setError(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getActivityById(activity.id);
                if (response?.success) {
                    setDetailedActivity(response.data);
                } else {
                    setError('Failed to load detailed activity information');
                }
            } catch (err) {
                console.error('Error fetching detailed activity:', err);
                setError('Failed to load detailed activity information');
            } finally {
                setLoading(false);
            }
        };

        fetchDetailedActivity();
    }, [open, activity?.id, fetchDetailedInfo]);

    // Use detailed activity data if available, otherwise use the provided activity
    const displayActivity = detailedActivity || activity;

    if (!displayActivity) return null;

    // Helper function to format time display
    const formatTime = (timeString) => {
        if (!timeString) return 'Not specified';
        const time = new Date(`2000-01-01 ${timeString}`);
        return time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Helper function to calculate duration
    const calculateDuration = () => {
        if (!displayActivity.startTime) return 'Not specified';
        
        let endTime;
        if (displayActivity.endTime) {
            endTime = new Date(`2000-01-01 ${displayActivity.endTime}`);
        } else if (displayActivity.lesson?.duration) {
            const startTime = new Date(`2000-01-01 ${displayActivity.startTime}`);
            endTime = new Date(startTime.getTime() + displayActivity.lesson.duration * 60000);
        } else {
            // Default to 90 minutes
            const startTime = new Date(`2000-01-01 ${displayActivity.startTime}`);
            endTime = new Date(startTime.getTime() + 90 * 60000);
        }
        
        const startTime = new Date(`2000-01-01 ${displayActivity.startTime}`);
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationMinutes = Math.round(durationMs / 60000);
        
        if (durationMinutes >= 60) {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        }
        return `${durationMinutes}m`;
    };

    // Helper function to get day color
    const getDayColor = (dayOfWeek) => {
        const dayColors = {
            'MONDAY': '#FF6B6B',
            'TUESDAY': '#4ECDC4',
            'WEDNESDAY': '#45B7D1',
            'THURSDAY': '#96CEB4',
            'FRIDAY': '#FECA57',
            'SATURDAY': '#A8E6CF',
            'SUNDAY': '#FFD93D'
        };
        return dayColors[dayOfWeek?.toUpperCase()] || '#6C757D';
    };

    const dayColor = getDayColor(displayActivity.dayOfWeek);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '80vh',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                }
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, ${dayColor} 0%, ${dayColor}dd 100%)`,
                    color: 'white',
                    p: 3,
                    position: 'relative'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                            Activity Details
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {displayActivity.dayOfWeek?.charAt(0) + displayActivity.dayOfWeek?.slice(1).toLowerCase()} • Week {displayActivity.schedule?.weekNumber}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <CircularProgress sx={{ color: dayColor }} />
                        <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                            Loading detailed information...
                        </Typography>
                    </Box>
                )}
                
                {error && (
                    <Box sx={{ p: 3 }}>
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                            {error}. Showing basic information.
                        </Alert>
                    </Box>
                )}
                
                <Box sx={{ p: 3 }}>
                    {/* Main Activity Information */}
                    <Card
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            border: `2px solid ${dayColor}40`,
                            boxShadow: `0 8px 24px ${dayColor}20`
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${dayColor} 0%, ${dayColor}dd 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}
                                >
                                    <Topic />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight="700" sx={{ color: dayColor, mb: 1 }}>
                                        {displayActivity.topic || 'Untitled Activity'}
                                    </Typography>
                                    {displayActivity.description && (
                                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            {displayActivity.description}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* Time and Duration Information */}
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${dayColor}10`,
                                            border: `1px solid ${dayColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <AccessTime sx={{ color: dayColor, mb: 1 }} />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Start Time
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {formatTime(displayActivity.startTime)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${dayColor}10`,
                                            border: `1px solid ${dayColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <Schedule sx={{ color: dayColor, mb: 1 }} />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            End Time
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {formatTime(displayActivity.endTime) !== 'Not specified'
                                                ? formatTime(displayActivity.endTime)
                                                : 'Calculated'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${dayColor}10`,
                                            border: `1px solid ${dayColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <CalendarToday sx={{ color: dayColor, mb: 1 }} />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Duration
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {calculateDuration()}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${dayColor}10`,
                                            border: `1px solid ${dayColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <Chip
                                            label={displayActivity.dayOfWeek?.charAt(0) + displayActivity.dayOfWeek?.slice(1).toLowerCase()}
                                            sx={{
                                                bgcolor: dayColor,
                                                color: 'white',
                                                fontWeight: 600,
                                                width: '100%'
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Associated Lesson Information */}
                    {displayActivity.lesson && (
                        <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <MenuBook sx={{ color: '#2196f3' }} />
                                    <Typography variant="h6" fontWeight="600" color="#2196f3">
                                        Associated Lesson
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Lesson Topic
                                        </Typography>
                                        <Typography variant="body1" fontWeight="500">
                                            {displayActivity.lesson.topic || 'Not specified'}
                                        </Typography>
                                    </Box>
                                    {displayActivity.lesson.description && (
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Lesson Description
                                            </Typography>
                                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                                {displayActivity.lesson.description}
                                            </Typography>
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Schedule and Class Information */}
                    {displayActivity.schedule && (
                        <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Class sx={{ color: '#ff9800' }} />
                                    <Typography variant="h6" fontWeight="600" color="#ff9800">
                                        Schedule & Class Information
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Week Number
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500">
                                                    Week {displayActivity.schedule.weekNumber}
                                                </Typography>
                                            </Box>
                                            {displayActivity.schedule.note && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Schedule Note
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                                        {displayActivity.schedule.note}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>
                                    {displayActivity.schedule.classes && (
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={2}>
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Class Name
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <School sx={{ color: '#4caf50', fontSize: 20 }} />
                                                        <Typography variant="body1" fontWeight="500">
                                                            {displayActivity.schedule.classes.name || 'Not specified'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                {displayActivity.schedule.classes.roomNumber && (
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Room Number
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <LocationOn sx={{ color: '#f44336', fontSize: 20 }} />
                                                            <Typography variant="body1" fontWeight="500">
                                                                {displayActivity.schedule.classes.roomNumber}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                )}
                                                {displayActivity.schedule.classes.grade && (
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Grade
                                                        </Typography>
                                                        <Chip
                                                            label={displayActivity.schedule.classes.grade}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#e3f2fd',
                                                                color: '#1976d2',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Activity Metadata */}
                    <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Description sx={{ color: '#9c27b0' }} />
                                <Typography variant="h6" fontWeight="600" color="#9c27b0">
                                    Activity Metadata
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Activity ID
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500">
                                        #{displayActivity.id}
                                    </Typography>
                                </Grid>
                                {displayActivity.schedule && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">
                                            Schedule ID
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            #{displayActivity.schedule.id}
                                        </Typography>
                                    </Grid>
                                )}
                                {displayActivity.lesson && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">
                                            Lesson ID
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            #{displayActivity.lesson.id}
                                        </Typography>
                                    </Grid>
                                )}
                                {displayActivity.schedule?.classes && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">
                                            Class Status
                                        </Typography>
                                        <Chip
                                            label={displayActivity.schedule.classes.status || 'Unknown'}
                                            size="small"
                                            sx={{
                                                bgcolor: displayActivity.schedule.classes.status === 'ACTIVE' ? '#e8f5e8' : '#ffeaa7',
                                                color: displayActivity.schedule.classes.status === 'ACTIVE' ? '#2e7d32' : '#e17055',
                                                fontWeight: 600,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Close
                </Button>
                {onEdit && (
                    <Button
                        onClick={() => onEdit(displayActivity)}
                        variant="contained"
                        startIcon={<Edit />}
                        disabled={loading}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            bgcolor: dayColor,
                            '&:hover': {
                                bgcolor: `${dayColor}dd`
                            }
                        }}
                    >
                        Edit Activity
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ActivityDetailView;