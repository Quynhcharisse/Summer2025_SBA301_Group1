import React from 'react';
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
    const days = [
        { key: 'MONDAY', label: 'Monday', color: '#FF6B6B', lightColor: '#FFE5E5' },
        { key: 'TUESDAY', label: 'Tuesday', color: '#4ECDC4', lightColor: '#E5F9F7' },
        { key: 'WEDNESDAY', label: 'Wednesday', color: '#45B7D1', lightColor: '#E5F4FB' },
        { key: 'THURSDAY', label: 'Thursday', color: '#96CEB4', lightColor: '#F0F9F4' },
        { key: 'FRIDAY', label: 'Friday', color: '#FECA57', lightColor: '#FEF7E5' }
    ];

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
                                    minHeight: '300px',
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
                                        {activitiesByDay[day.key]?.length > 0 ? (
                                            activitiesByDay[day.key].map((activity) => (
                                                <Card
                                                    key={activity.id}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        cursor: 'pointer',
                                                        background: 'rgba(255, 255, 255, 0.8)',
                                                        backdropFilter: 'blur(10px)',
                                                        border: `1px solid ${day.color}30`,
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
                                                        {activity.startTime} - {activity.endTime}
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
                                            <Box sx={{
                                                textAlign: 'center',
                                                py: 2,
                                                color: 'text.secondary',
                                                background: 'rgba(255, 255, 255, 0.6)',
                                                borderRadius: 2,
                                                border: `1px dashed ${day.color}50`
                                            }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                                                    No activities scheduled
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {/* Add Activity Button for each day */}
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Add sx={{ fontSize: '16px' }} />}
                                            onClick={() => onCreateActivity(currentWeekSchedule.id)}
                                            sx={{
                                                mt: 1,
                                                borderStyle: 'dashed',
                                                borderColor: day.color,
                                                color: day.color,
                                                fontSize: '0.75rem',
                                                height: '32px',
                                                minHeight: '32px',
                                                px: 1.5,
                                                borderRadius: 2,
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(10px)',
                                                '&:hover': {
                                                    borderStyle: 'solid',
                                                    bgcolor: `${day.color}10`,
                                                    transform: 'translateY(-1px)',
                                                    boxShadow: `0 4px 12px ${day.color}20`
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            Add Activity
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default WeeklyActivitiesView;