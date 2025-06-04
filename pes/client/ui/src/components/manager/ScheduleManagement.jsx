import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Visibility, Schedule as ScheduleIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import {
    getAllSchedules,
    getSchedulesByClassId,
    getWeeklySchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getAllClasses,
    getActivitiesByClassId
} from '../../services/ManagerService.jsx';
import { enqueueSnackbar } from 'notistack';

function ScheduleManagement() {
    const [schedules, setSchedules] = useState([]);
    const [classes, setClasses] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    
    const [modal, setModal] = useState({
        isOpen: false,
        type: '' // 'create', 'edit', 'view', 'weekly'
    });

    const [formData, setFormData] = useState({
        classId: '',
        activityId: '',
        dayOfWeek: '',
        startTime: null,
        endTime: null,
        weekNumber: 1,
        location: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [schedulesResponse, classesResponse] = await Promise.all([
                getAllSchedules(),
                getAllClasses()
            ]);

            if (schedulesResponse && schedulesResponse.success) {
                setSchedules(schedulesResponse.data || []);
            }

            if (classesResponse && classesResponse.success) {
                setClasses(classesResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Error fetching data', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchActivitiesByClass = async (classId) => {
        try {
            const response = await getActivitiesByClassId(classId);
            if (response && response.success) {
                setActivities(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            enqueueSnackbar('Error fetching activities', { variant: 'error' });
        }
    };

    const handleViewWeeklySchedule = async (classId, weekNumber = 1) => {
        try {
            const response = await getWeeklySchedule(classId, weekNumber);
            if (response && response.success) {
                setWeeklySchedule(response.data || []);
                setModal({ isOpen: true, type: 'weekly' });
            } else {
                enqueueSnackbar('Failed to fetch weekly schedule', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error fetching weekly schedule:', error);
            enqueueSnackbar('Error fetching weekly schedule', { variant: 'error' });
        }
    };

    const handleCreateSchedule = () => {
        setFormData({
            classId: '',
            activityId: '',
            dayOfWeek: '',
            startTime: null,
            endTime: null,
            weekNumber: 1,
            location: ''
        });
        setModal({ isOpen: true, type: 'create' });
    };

    const handleEditSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setFormData({
            classId: schedule.classId || '',
            activityId: schedule.activityId || '',
            dayOfWeek: schedule.dayOfWeek || '',
            startTime: schedule.startTime ? dayjs(schedule.startTime) : null,
            endTime: schedule.endTime ? dayjs(schedule.endTime) : null,
            weekNumber: schedule.weekNumber || 1,
            location: schedule.location || ''
        });
        
        if (schedule.classId) {
            fetchActivitiesByClass(schedule.classId);
        }
        
        setModal({ isOpen: true, type: 'edit' });
    };

    const handleDeleteSchedule = async (scheduleId) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                const response = await deleteSchedule(scheduleId);
                if (response && response.success) {
                    enqueueSnackbar('Schedule deleted successfully', { variant: 'success' });
                    fetchInitialData();
                } else {
                    enqueueSnackbar('Failed to delete schedule', { variant: 'error' });
                }
            } catch (error) {
                console.error('Error deleting schedule:', error);
                enqueueSnackbar('Error deleting schedule', { variant: 'error' });
            }
        }
    };

    const handleFormSubmit = async () => {
        try {
            const scheduleData = {
                classId: parseInt(formData.classId),
                activityId: parseInt(formData.activityId),
                dayOfWeek: formData.dayOfWeek,
                startTime: formData.startTime ? formData.startTime.toISOString() : null,
                endTime: formData.endTime ? formData.endTime.toISOString() : null,
                weekNumber: formData.weekNumber,
                location: formData.location
            };

            let response;
            if (modal.type === 'create') {
                response = await createSchedule(scheduleData);
            } else if (modal.type === 'edit') {
                response = await updateSchedule(selectedSchedule.id, scheduleData);
            }

            if (response && response.success) {
                enqueueSnackbar(
                    `Schedule ${modal.type === 'create' ? 'created' : 'updated'} successfully`,
                    { variant: 'success' }
                );
                handleCloseModal();
                fetchInitialData();
            } else {
                enqueueSnackbar(
                    `Failed to ${modal.type} schedule`,
                    { variant: 'error' }
                );
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            enqueueSnackbar(`Error ${modal.type === 'create' ? 'creating' : 'updating'} schedule`, { variant: 'error' });
        }
    };

    const handleCloseModal = () => {
        setModal({ isOpen: false, type: '' });
        setSelectedSchedule(null);
        setActivities([]);
        setWeeklySchedule([]);
    };

    const handleClassChange = (classId) => {
        setFormData({ ...formData, classId, activityId: '' });
        if (classId) {
            fetchActivitiesByClass(classId);
        } else {
            setActivities([]);
        }
    };

    const getDayColor = (day) => {
        const colors = {
            'MONDAY': 'primary',
            'TUESDAY': 'secondary',
            'WEDNESDAY': 'success',
            'THURSDAY': 'warning',
            'FRIDAY': 'error',
            'SATURDAY': 'info',
            'SUNDAY': 'default'
        };
        return colors[day] || 'default';
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'classId',
            headerName: 'Class ID',
            width: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'activityId',
            headerName: 'Activity ID',
            width: 100,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'dayOfWeek',
            headerName: 'Day',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    color={getDayColor(params.value)}
                    size="small"
                />
            )
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.value ? dayjs(params.value).format('MMM DD, HH:mm') : '-'
            )
        },
        {
            field: 'endTime',
            headerName: 'End Time',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.value ? dayjs(params.value).format('MMM DD, HH:mm') : '-'
            )
        },
        {
            field: 'weekNumber',
            headerName: 'Week',
            width: 80,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 120,
            headerAlign: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEditSchedule(params.row)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteSchedule(params.row.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        onClick={() => handleViewWeeklySchedule(params.row.classId, params.row.weekNumber)}
                    >
                        Week View
                    </Button>
                </Box>
            )
        }
    ];

    const renderFormModal = () => (
        <>
            <DialogTitle>
                {modal.type === 'create' ? 'Create New Schedule' : 'Edit Schedule'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={formData.classId}
                                onChange={(e) => handleClassChange(e.target.value)}
                                label="Class"
                            >
                                {classes.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>
                                        {cls.className} (Grade {cls.grade})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Activity</InputLabel>
                            <Select
                                value={formData.activityId}
                                onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
                                label="Activity"
                                disabled={!formData.classId}
                            >
                                {activities.map((activity) => (
                                    <MenuItem key={activity.id} value={activity.id}>
                                        {activity.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Day of Week</InputLabel>
                            <Select
                                value={formData.dayOfWeek}
                                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                                label="Day of Week"
                            >
                                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Week Number"
                            type="number"
                            value={formData.weekNumber}
                            onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="Start Time"
                            value={formData.startTime}
                            onChange={(newValue) => setFormData({ ...formData, startTime: newValue })}
                            slotProps={{
                                textField: { fullWidth: true }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <DateTimePicker
                            label="End Time"
                            value={formData.endTime}
                            onChange={(newValue) => setFormData({ ...formData, endTime: newValue })}
                            slotProps={{
                                textField: { fullWidth: true }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleFormSubmit} variant="contained">
                    {modal.type === 'create' ? 'Create' : 'Update'}
                </Button>
            </DialogActions>
        </>
    );

    const renderWeeklyModal = () => (
        <>
            <DialogTitle>Weekly Schedule View</DialogTitle>
            <DialogContent>
                {weeklySchedule.length > 0 ? (
                    <List>
                        {weeklySchedule.map((schedule, index) => (
                            <React.Fragment key={schedule.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Chip 
                                                    label={schedule.dayOfWeek} 
                                                    color={getDayColor(schedule.dayOfWeek)}
                                                    size="small"
                                                />
                                                <Typography variant="subtitle1">
                                                    Activity ID: {schedule.activityId}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2">
                                                    Time: {dayjs(schedule.startTime).format('HH:mm')} - {dayjs(schedule.endTime).format('HH:mm')}
                                                </Typography>
                                                {schedule.location && (
                                                    <Typography variant="body2">
                                                        Location: {schedule.location}
                                                    </Typography>
                                                )}
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < weeklySchedule.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Alert severity="info">No schedules found for this week</Alert>
                )}
            </DialogContent>
        </>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Schedule Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateSchedule}
                >
                    Create Schedule
                </Button>
            </Box>

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={schedules}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    loading={loading}
                    disableSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-header': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Paper>

            <Dialog
                open={modal.isOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                {modal.type === 'weekly' ? renderWeeklyModal() : renderFormModal()}
                {modal.type === 'weekly' && (
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </DialogActions>
                )}
            </Dialog>
        </Box>
    );
}

export default ScheduleManagement;