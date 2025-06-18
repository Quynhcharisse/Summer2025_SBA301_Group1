import React from 'react';
import {
    Box,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Delete,
    Edit
} from '@mui/icons-material';

const WeekNavigationControls = ({
    currentWeek,
    weekInput,
    currentWeekSchedule,
    onPreviousWeek,
    onNextWeek,
    onWeekInputChange,
    onEditSchedule,
    onDeleteSchedule
}) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <IconButton
                    onClick={onPreviousWeek}
                    disabled={currentWeek <= 1}
                    sx={{
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                            bgcolor: '#f5f5f5'
                        },
                        '&:disabled': {
                            bgcolor: '#fafafa',
                            color: '#ccc'
                        }
                    }}
                >
                    <ChevronLeft />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" fontWeight="500">
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
                                bgcolor: 'white',
                                height: '40px'
                            }
                        }}
                    />
                </Box>
                
                <IconButton
                    onClick={onNextWeek}
                    sx={{
                        bgcolor: 'white',
                        border: '1px solid #e0e0e0',
                        '&:hover': {
                            bgcolor: '#f5f5f5'
                        }
                    }}
                >
                    <ChevronRight />
                </IconButton>
            </Box>
            
            {/* Week info and actions */}
            {currentWeekSchedule && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Box>
                            <Typography variant="subtitle1" fontWeight="600">
                                Week {currentWeek}
                            </Typography>
                            {currentWeekSchedule.note && (
                                <Typography variant="body2" color="text.secondary">
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
                                        bgcolor: '#1976d2',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: '#1565c0'
                                        }
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
                                        '&:hover': {
                                            bgcolor: '#d32f2f'
                                        }
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
    );
};

export default WeekNavigationControls;