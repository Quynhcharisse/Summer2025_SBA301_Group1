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
    Divider,
    Stack
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
    getAllClasses
} from '../../services/EducationService.jsx';
import { enqueueSnackbar } from 'notistack';

function ScheduleManagement() {
    const [schedules, setSchedules] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [weeklySchedule, setWeeklySchedule] = useState([]);
    
    const [modal, setModal] = useState({
        isOpen: false,
        type: '' // 'create', 'edit', 'view', 'weekly'
    });

    const [formData, setFormData] = useState({
        weekNumber: 1,
        note: '',
        classId: ''
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
            weekNumber: 1,
            note: '',
            classId: ''
        });
        setModal({ isOpen: true, type: 'create' });
    };

    const handleEditSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setFormData({
            weekNumber: schedule.weekNumber || 1,
            note: schedule.note || '',
            classId: schedule.classes?.id || ''
        });
        
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
                weekNumber: formData.weekNumber,
                note: formData.note,
                classId: parseInt(formData.classId)
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
        setWeeklySchedule([]);
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
            field: 'weekNumber',
            headerName: 'Week',
            width: 80,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'note',
            headerName: 'Note',
            width: 200,
            headerAlign: 'center'
        },
        {
            field: 'className',
            headerName: 'Class',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => (
                params.row.classes?.className || '-'
            )
        },
        {
            field: 'grade',
            headerName: 'Grade',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.row.classes?.grade || '-'
            )
        },
        {
            field: 'activitiesCount',
            headerName: 'Activities',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                params.row.activities?.length || 0
            )
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
                        onClick={() => handleViewWeeklySchedule(params.row.classes?.id, params.row.weekNumber)}
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
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Week Number"
                        type="number"
                        value={formData.weekNumber}
                        onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
                        inputProps={{ min: 1 }}
                        required
                        helperText="Enter the week number for this schedule (e.g., 1, 2, 3...)"
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={formData.classId}
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                            label="Class"
                        >
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.className} (Grade {cls.grade})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Note"
                        multiline
                        rows={4}
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        placeholder="Add any notes about this schedule (optional)..."
                        helperText="You can add location, special instructions, or any other relevant information"
                    />
                </Stack>
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
                                                <Typography variant="subtitle1">
                                                    Week {schedule.weekNumber} - {schedule.classes?.className || 'Unknown Class'}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2">
                                                    Note: {schedule.note || 'No notes'}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Activities: {schedule.activities?.length || 0}
                                                </Typography>
                                                {schedule.activities && schedule.activities.length > 0 && (
                                                    <Box sx={{ mt: 1 }}>
                                                        {schedule.activities.map((activity, actIndex) => (
                                                            <Chip
                                                                key={actIndex}
                                                                label={`${activity.topic} (${activity.dayOfWeek})`}
                                                                size="small"
                                                                sx={{ mr: 1, mb: 1 }}
                                                            />
                                                        ))}
                                                    </Box>
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