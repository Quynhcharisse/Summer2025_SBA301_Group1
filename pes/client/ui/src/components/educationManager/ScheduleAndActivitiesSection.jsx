import React from 'react';
import {
    Box,
    Button,
    Stack,
    Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';
import WeeklyActivitiesView from './WeeklyActivitiesView.jsx';

const ScheduleAndActivitiesSection = ({
    currentWeek,
    weekInput,
    currentWeekSchedule,
    activitiesByDay,
    onPreviousWeek,
    onNextWeek,
    onWeekInputChange,
    onCreateSchedule,
    onEditSchedule,
    onDeleteSchedule,
    onCreateActivity,
    onEditActivity,
    onDeleteActivity
}) => {
    return (
        <Stack spacing={3}>
            {/* Header with navigation controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" color="primary">
                    Weekly Schedule & Activities
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add/>}
                    onClick={onCreateSchedule}
                    size="small"
                >
                    Create Schedule
                </Button>
            </Box>

            {/* Merged Week Navigation and Daily Activities */}
            <WeeklyActivitiesView
                currentWeek={currentWeek}
                weekInput={weekInput}
                currentWeekSchedule={currentWeekSchedule}
                activitiesByDay={activitiesByDay}
                onPreviousWeek={onPreviousWeek}
                onNextWeek={onNextWeek}
                onWeekInputChange={onWeekInputChange}
                onEditSchedule={onEditSchedule}
                onDeleteSchedule={onDeleteSchedule}
                onCreateActivity={onCreateActivity}
                onEditActivity={onEditActivity}
                onDeleteActivity={onDeleteActivity}
            />
        </Stack>
    );
};

export default ScheduleAndActivitiesSection;