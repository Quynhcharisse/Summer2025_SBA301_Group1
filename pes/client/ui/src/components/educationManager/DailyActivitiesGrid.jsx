import React from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Add,
    Delete,
    Edit
} from '@mui/icons-material';

const DailyActivitiesGrid = ({
    currentWeekSchedule,
    activitiesByDay,
    onCreateActivity,
    onEditActivity,
    onDeleteActivity
}) => {
    const days = [
        { key: 'MONDAY', label: 'Monday' },
        { key: 'TUESDAY', label: 'Tuesday' },
        { key: 'WEDNESDAY', label: 'Wednesday' },
        { key: 'THURSDAY', label: 'Thursday' },
        { key: 'FRIDAY', label: 'Friday' }
    ];

    if (!currentWeekSchedule) {
        return (
            <Alert severity="info" sx={{ textAlign: 'center' }}>
                No schedule found for this week. Click "Create Schedule" to add one.
            </Alert>
        );
    }

    return (
        <Grid container spacing={2}>
            {days.map((day) => (
                <Grid item xs={12} sm={6} md={2} lg={2.4} key={day.key}>
                    <Card sx={{ height: '100%', minHeight: '300px' }}>
                        <CardContent sx={{ p: 2 }}>
                            <Typography
                                variant="h6"
                                color="primary"
                                sx={{
                                    mb: 2,
                                    textAlign: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                {day.label}
                            </Typography>
                            
                            <Stack spacing={1}>
                                {activitiesByDay[day.key]?.length > 0 ? (
                                    activitiesByDay[day.key].map((activity) => (
                                        <Card
                                            key={activity.id}
                                            variant="outlined"
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: 2,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: '#1976d2',
                                                    mb: 0.5
                                                }}
                                            >
                                                {activity.topic}
                                            </Typography>
                                            
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: 'block',
                                                    mb: 0.5,
                                                    fontWeight: 500
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
                                                        lineHeight: 1.2
                                                    }}
                                                >
                                                    {activity.description}
                                                </Typography>
                                            )}
                                            
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                                                <Tooltip title="Edit Activity">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditActivity(activity);
                                                        }}
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            bgcolor: '#1976d2',
                                                            color: 'white',
                                                            '&:hover': {
                                                                bgcolor: '#1565c0'
                                                            }
                                                        }}
                                                    >
                                                        <Edit sx={{ fontSize: 14 }} />
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
                                                            width: 24,
                                                            height: 24,
                                                            bgcolor: '#f44336',
                                                            color: 'white',
                                                            '&:hover': {
                                                                bgcolor: '#d32f2f'
                                                            }
                                                        }}
                                                    >
                                                        <Delete sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Card>
                                    ))
                                ) : (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 3,
                                        color: 'text.secondary'
                                    }}>
                                        <Typography variant="caption">
                                            No activities
                                        </Typography>
                                    </Box>
                                )}
                                
                                {/* Add Activity Button for each day */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Add />}
                                    onClick={() => onCreateActivity(currentWeekSchedule.id)}
                                    sx={{
                                        mt: 1,
                                        borderStyle: 'dashed',
                                        fontSize: '0.7rem',
                                        '&:hover': {
                                            borderStyle: 'solid'
                                        }
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
    );
};

export default DailyActivitiesGrid;