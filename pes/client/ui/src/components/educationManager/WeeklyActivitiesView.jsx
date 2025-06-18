import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Add,
    ChevronLeft,
    ChevronRight,
    Delete,
    Edit
} from '@mui/icons-material';
import ActivityDetailView from './ActivityDetailView';

const WeeklyActivitiesView = ({
    currentWeek,
    weekInput,
    currentWeekSchedule,
    activitiesByDay,
    onPreviousWeek,
    onNextWeek,
    onWeekInputChange,
    onEditSchedule,
    onDeleteSchedule,
    onCreateActivity,
    onEditActivity,
    onDeleteActivity
}) => {
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [detailViewOpen, setDetailViewOpen] = useState(false);

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
        setDetailViewOpen(true);
    };

    const handleDetailViewClose = () => {
        setDetailViewOpen(false);
        setSelectedActivity(null);
    };

    const handleEditFromDetail = (activity) => {
        setDetailViewOpen(false);
        setSelectedActivity(null);
        onEditActivity(activity);
    };

    // Helper function to create slot context for activity creation
    const handleCreateActivityInSlot = (scheduleId, dayKey, slot) => {
        const slotContext = {
            dayOfWeek: dayKey,
            startTime: slot.startTime,
            endTime: slot.endTime
        };
        onCreateActivity(scheduleId, slotContext);
    };
    const days = [
        { key: 'MONDAY', label: 'Monday', color: '#FF6B6B', lightColor: '#FFE5E5' },
        { key: 'TUESDAY', label: 'Tuesday', color: '#4ECDC4', lightColor: '#E5F9F7' },
        { key: 'WEDNESDAY', label: 'Wednesday', color: '#45B7D1', lightColor: '#E5F4FB' },
        { key: 'THURSDAY', label: 'Thursday', color: '#96CEB4', lightColor: '#F0F9F4' },
        { key: 'FRIDAY', label: 'Friday', color: '#FECA57', lightColor: '#FEF7E5' }
    ];

    const timeSlots = [
        { id: 1, label: 'Slot 1', startTime: '08:00', endTime: '09:30', displayTime: '8:00 - 9:30 AM' },
        { id: 2, label: 'Slot 2', startTime: '09:30', endTime: '11:00', displayTime: '9:30 - 11:00 AM' },
        { id: 3, label: 'Slot 3', startTime: '13:00', endTime: '14:30', displayTime: '1:00 - 2:30 PM' },
        { id: 4, label: 'Slot 4', startTime: '14:30', endTime: '16:00', displayTime: '2:30 - 4:00 PM' }
    ];

    // Helper function to check if an activity falls within a time slot
    const isActivityInSlot = (activity, slot) => {
        const activityStart = activity.startTime;
        const slotStart = slot.startTime;
        const slotEnd = slot.endTime;
        
        // Check if activity overlaps with the slot
        return activityStart >= slotStart && activityStart < slotEnd;
    };

    // Helper function to get activities for a specific day and slot
    const getActivitiesForSlot = (dayKey, slot) => {
        const dayActivities = activitiesByDay[dayKey] || [];
        return dayActivities.filter(activity => isActivityInSlot(activity, slot));
    };

    // Helper function to format activity time display
    const formatActivityTime = (activity) => {
        const startTime = new Date(`2000-01-01 ${activity.startTime}`);
        let endTime;
        
        // If activity has an endTime, use it. Otherwise calculate from lesson duration
        if (activity.endTime) {
            endTime = new Date(`2000-01-01 ${activity.endTime}`);
        } else {
            // Use lesson duration or default to 90 minutes
            const durationInMinutes = activity.lesson?.duration || 90;
            endTime = new Date(startTime.getTime() + durationInMinutes * 60000);
        }
        
        const formatTime = (time) => {
            return time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        };
        
        return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Week Navigation Header */}
            <Paper 
                sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <IconButton
                        onClick={onPreviousWeek}
                        disabled={currentWeek <= 1}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                transform: 'scale(1.05)'
                            },
                            '&:disabled': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.5)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" fontWeight="600" sx={{ color: 'white' }}>
                            Week
                        </Typography>
                        <TextField
                            size="small"
                            value={weekInput}
                            onChange={onWeekInputChange}
                            type="number"
                            inputProps={{
                                min: 1,
                                style: { textAlign: 'center', width: '60px' }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    height: '40px',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)'
                                    }
                                },
                                '& input[type=number]::-webkit-outer-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0
                                },
                                '& input[type=number]::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0
                                },
                                '& input[type=number]': {
                                    MozAppearance: 'textfield'
                                }
                            }}
                        />
                    </Box>
                    
                    <IconButton
                        onClick={onNextWeek}
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>
                
                {/* Week info and actions */}
                {currentWeekSchedule && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                                <Typography variant="h5" fontWeight="700" sx={{ color: 'white' }}>
                                    Week {currentWeek}
                                </Typography>
                                {currentWeekSchedule.note && (
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 0.5 }}>
                                        {currentWeekSchedule.note}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit Schedule">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEditSchedule(currentWeekSchedule)}
                                        sx={{
                                            bgcolor: '#4CAF50',
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                                            '&:hover': {
                                                bgcolor: '#45a049',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(76, 175, 80, 0.5)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Schedule">
                                    <IconButton
                                        size="small"
                                        onClick={() => onDeleteSchedule(currentWeekSchedule.id, currentWeekSchedule.weekNumber)}
                                        sx={{
                                            bgcolor: '#f44336',
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
                                            '&:hover': {
                                                bgcolor: '#d32f2f',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.5)'
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Daily Activities Grid */}
            {!currentWeekSchedule ? (
                <Alert 
                    severity="info" 
                    sx={{ 
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: '#E3F2FD',
                        border: '1px solid #BBDEFB',
                        '& .MuiAlert-icon': {
                            color: '#1976d2'
                        }
                    }}
                >
                    No schedule found for this week. Click "Create Schedule" to add one.
                </Alert>
            ) : (
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    {days.map((day) => (
                        <Grid xs={12} md key={day.key} sx={{ flex: 1 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    minHeight: '600px',
                                    borderRadius: 3,
                                    background: `linear-gradient(135deg, ${day.lightColor} 0%, white 50%, ${day.lightColor} 100%)`,
                                    border: `2px solid ${day.color}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 12px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px ${day.color}`
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            p: 1,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${day.color} 0%, ${day.color}dd 100%)`,
                                            color: 'white',
                                            boxShadow: `0 4px 12px ${day.color}40`
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {day.label}
                                        </Typography>
                                    </Box>
                                    
                                    <Stack spacing={1.5}>
                                        {timeSlots.map((slot) => {
                                            const slotActivities = getActivitiesForSlot(day.key, slot);
                                            const hasActivity = slotActivities.length > 0;
                                            
                                            return (
                                                <Box key={slot.id} sx={{ mb: 1 }}>
                                                    {/* Time Slot Header */}
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            color: day.color,
                                                            background: `${day.color}10`,
                                                            padding: '4px 8px',
                                                            borderRadius: 1,
                                                            display: 'inline-block',
                                                            mb: 1
                                                        }}
                                                    >
                                                        {slot.displayTime}
                                                    </Typography>
                                                    
                                                    {hasActivity ? (
                                                        slotActivities.map((activity) => (
                                                            <Card
                                                                key={activity.id}
                                                                variant="outlined"
                                                                onClick={() => handleActivityClick(activity)}
                                                                sx={{
                                                                    p: 1.5,
                                                                    borderRadius: 2,
                                                                    cursor: 'pointer',
                                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                                    backdropFilter: 'blur(10px)',
                                                                    border: `2px solid ${day.color}`,
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        boxShadow: `0 8px 20px ${day.color}20`,
                                                                        transform: 'translateY(-2px)',
                                                                        background: 'rgba(255, 255, 255, 0.95)',
                                                                        borderColor: day.color
                                                                    }
                                                                }}
                                                            >
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: day.color,
                                                                        mb: 0.5,
                                                                        fontSize: '0.9rem',
                                                                        lineHeight: 1.2
                                                                    }}
                                                                >
                                                                    {activity.topic}
                                                                </Typography>
                                                                
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        mb: 0.5,
                                                                        fontWeight: 600,
                                                                        fontSize: '0.75rem',
                                                                        color: '#666',
                                                                        background: `${day.color}15`,
                                                                        padding: '2px 8px',
                                                                        borderRadius: 1,
                                                                        display: 'inline-block'
                                                                    }}
                                                                >
                                                                    {formatActivityTime(activity)}
                                                                </Typography>
                                                                
                                                                {activity.description && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            display: 'block',
                                                                            fontSize: '0.7rem',
                                                                            lineHeight: 1.3,
                                                                            mt: 0.5
                                                                        }}
                                                                    >
                                                                        {activity.description}
                                                                    </Typography>
                                                                )}
                                                                
                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1.5 }}>
                                                                    <Tooltip title="Edit Activity">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onEditActivity(activity);
                                                                            }}
                                                                            sx={{
                                                                                width: 28,
                                                                                height: 28,
                                                                                bgcolor: '#4CAF50',
                                                                                color: 'white',
                                                                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                                                                                '&:hover': {
                                                                                    bgcolor: '#45a049',
                                                                                    transform: 'scale(1.1)',
                                                                                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
                                                                                },
                                                                                transition: 'all 0.2s ease'
                                                                            }}
                                                                        >
                                                                            <Edit sx={{ fontSize: 16 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Delete Activity">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onDeleteActivity(activity.id, activity.topic);
                                                                            }}
                                                                            sx={{
                                                                                width: 28,
                                                                                height: 28,
                                                                                bgcolor: '#f44336',
                                                                                color: 'white',
                                                                                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
                                                                                '&:hover': {
                                                                                    bgcolor: '#d32f2f',
                                                                                    transform: 'scale(1.1)',
                                                                                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)'
                                                                                },
                                                                                transition: 'all 0.2s ease'
                                                                            }}
                                                                        >
                                                                            <Delete sx={{ fontSize: 16 }} />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Card>
                                                        ))
                                                    ) : (
                                                        <Card
                                                            variant="outlined"
                                                            sx={{
                                                                p: 1.5,
                                                                borderRadius: 2,
                                                                cursor: 'pointer',
                                                                background: 'rgba(255, 255, 255, 0.5)',
                                                                backdropFilter: 'blur(10px)',
                                                                border: `2px dashed ${day.color}60`,
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    borderStyle: 'solid',
                                                                    bgcolor: `${day.color}05`,
                                                                    transform: 'translateY(-1px)',
                                                                    boxShadow: `0 4px 12px ${day.color}20`
                                                                },
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minHeight: '60px'
                                                            }}
                                                            onClick={() => handleCreateActivityInSlot(currentWeekSchedule.id, day.key, slot)}
                                                        >
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <IconButton
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: `${day.color}20`,
                                                                        color: day.color,
                                                                        '&:hover': {
                                                                            bgcolor: `${day.color}30`,
                                                                        }
                                                                    }}
                                                                >
                                                                    <Add sx={{ fontSize: 18 }} />
                                                                </IconButton>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: day.color,
                                                                        fontWeight: 500,
                                                                        fontSize: '0.8rem'
                                                                    }}
                                                                >
                                                                    Add Activity
                                                                </Typography>
                                                            </Box>
                                                        </Card>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Activity Detail View Dialog */}
            <ActivityDetailView
                activity={selectedActivity}
                open={detailViewOpen}
                onClose={handleDetailViewClose}
                onEdit={handleEditFromDetail}
            />
        </Box>
    );
};

export default WeeklyActivitiesView;