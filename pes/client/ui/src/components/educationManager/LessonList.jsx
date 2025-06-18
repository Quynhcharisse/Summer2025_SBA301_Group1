import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import {enqueueSnackbar} from 'notistack';
import {useForm} from 'react-hook-form';
import {DataGrid} from '@mui/x-data-grid';
import {createLesson, getAllLessons, removeLesson, updateLesson} from "../../services/EducationService.jsx";

export default function LessonList() {
    const [lessons, setLessons] = useState([]);
    const [show, setShow] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const {register, handleSubmit, reset, setValue, formState: {errors}} = useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getAllLessons();
            const data = response.data;
            if (!Array.isArray(data)) {
                enqueueSnackbar('Unexpected response from server', {variant: 'error'});
                setLessons([]);
                return;
            }
            setLessons(data.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
        } catch (error) {
            enqueueSnackbar('Error fetching lessons: ' + (error?.response?.data?.message || error.message || error), {variant: 'error'});
            setLessons([]);
        }
    };

    const handleDelete = async (id) => {
        try {
            await removeLesson(id);
            enqueueSnackbar("Lesson deleted successfully!", {variant: 'success'});
            fetchData();
        } catch (error) {
            enqueueSnackbar("Lesson deletion failed: " + (error?.response?.data?.message || error.message || error), {variant: 'error'});
            console.log('Error delete lessons:', error);
        }
    };

    const onSubmit = async (formData) => {
        try {
            if (editMode && editId) {
                await updateLesson(editId, formData);
                enqueueSnackbar("Lesson updated successfully!", {variant: 'success'});
            } else {
                const exists = lessons.find(l => l.topic.toLowerCase() === formData.topic.toLowerCase());
                if (exists) {
                    enqueueSnackbar("Lesson with this topic already exists!", {variant: 'error'});
                    return;
                }
                await createLesson(formData);
                enqueueSnackbar("Lesson added successfully!", {variant: 'success'});
            }
            reset();
            setEditMode(false);
            setEditId(null);
            setShow(false);
            fetchData();
        } catch (error) {
            enqueueSnackbar("An error occurred: " + (error?.response?.data?.message || error.message || error), {variant: 'error'});
            console.log("An error occurred!", error);
        }
    };

    const handleEdit = (lesson) => {
        setEditMode(true);
        setEditId(lesson.id);
        setValue('topic', lesson.topic);
        setValue('description', lesson.description);
        setValue('duration', lesson.duration);
        setValue('materials', lesson.materials);
        setShow(true);
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center'},
        {field: 'topic', headerName: 'Topic', width: 180, headerAlign: 'center'},
        {field: 'description', headerName: 'Description', width: 250, headerAlign: 'center'},
        {field: 'duration', headerName: 'Duration (hrs)', width: 120, headerAlign: 'center', align: 'center'},
        {field: 'materials', headerName: 'Materials', width: 180, headerAlign: 'center'},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton color="info" onClick={() => handleEdit(params.row)}>
                        <Edit color="info"/>
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this lesson?")) {
                                handleDelete(params.row.id);
                            }
                        }}
                    >
                        <Delete color="error"/>
                    </IconButton>
                </Stack>
            )
        }
    ];

    return (
        <Box sx={{p: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h5" fontWeight="bold">
                    Manage Lessons
                </Typography>
                <Button
                    startIcon={<Add/>}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setEditMode(false);
                        setEditId(null);
                        reset({topic: '', description: '', duration: '', materials: ''});
                        setShow(true);
                    }}
                >
                    Add new lesson
                </Button>
            </Box>
            <Paper sx={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={lessons}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    getRowId={(row) => row?.id || Math.random()}
                    sx={{
                        '& .MuiDataGrid-header': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }}
                />
            </Paper>

            <Dialog open={show} onClose={() => setShow(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Lesson' : 'Add New Lesson'}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                        <TextField
                            label="Lesson Topic"
                            fullWidth
                            margin="normal"
                            error={!!errors.topic}
                            helperText={errors.topic ? "Topic is required" : ""}
                            {...register("topic", {required: true})}
                            autoFocus
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            error={!!errors.description}
                            helperText={errors.description ? "Description is required" : ""}
                            {...register("description", {required: true})}
                        />
                        <TextField
                            label="Duration (hours)"
                            fullWidth
                            margin="normal"
                            type="number"
                            inputProps={{min: 0, step: 0.5}}
                            error={!!errors.duration}
                            helperText={errors.duration ?
                                errors.duration.type === "required" ? "Duration is required" :
                                    errors.duration.type === "min" ? "Duration cannot be negative" :
                                        errors.duration.type === "pattern" ? "Please enter a valid number" :
                                            "Duration is required" : "Enter lesson duration in hours"}
                            {...register("duration", {
                                required: true,
                                min: 0,
                                pattern: /^[0-9]*\.?[0-9]+$/
                            })}
                        />
                        <TextField
                            label="Materials"
                            fullWidth
                            margin="normal"
                            error={!!errors.materials}
                            helperText={errors.materials ? "Materials are required" : ""}
                            {...register("materials", {required: true})}
                        />

                        <DialogActions>
                            <Button onClick={() => setShow(false)} color="secondary">
                                Close
                            </Button>
                            <Button type="submit" variant="contained" color="success">
                                {editMode ? 'Save Changes' : 'Add Lesson'}
                            </Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}