import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    Typography,
    Skeleton
} from '@mui/material';
import {Add, Delete, Edit, Info} from '@mui/icons-material';
import {enqueueSnackbar} from 'notistack';
import {DataGrid} from '@mui/x-data-grid';
import {createLesson, getAllLessons, removeLesson, updateLesson} from "../../services/EducationService.jsx";
import LessonForm from './LessonForm.jsx';
import { useNavigate } from 'react-router-dom';

export default function LessonList() {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
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

    const handleViewDetails = (lesson) => {
        navigate(`/education/lessons/${lesson.id}`);
    };

    const handleEdit = (lesson) => {
        setSelectedLesson(lesson);
        setEditMode(true);
        setFormOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedLesson(null);
        setEditMode(false);
        setFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            setLoading(true);
            if (editMode && selectedLesson) {
                await updateLesson(selectedLesson.id, formData);
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
            setFormOpen(false);
            setSelectedLesson(null);
            setEditMode(false);
            fetchData();
        } catch (error) {
            enqueueSnackbar("An error occurred: " + (error?.response?.data?.message || error.message || error), {variant: 'error'});
            console.log("An error occurred!", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center'},
        {field: 'topic', headerName: 'Topic', flex: 1, minWidth: 150, headerAlign: 'center'},
        {field: 'description', headerName: 'Description', flex: 2, minWidth: 200, headerAlign: 'center'},
        {field: 'duration', headerName: 'Duration (min)', width: 120, headerAlign: 'center', align: 'center'},
        {field: 'materials', headerName: 'Materials', flex: 1, minWidth: 150, headerAlign: 'center'},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => {
                // Show skeleton for loading rows
                if (params.row.id && params.row.id.toString().startsWith('skeleton-')) {
                    return <Skeleton variant="rectangular" width={150} height={32} />;
                }
                
                return (
                    <Stack direction="row" spacing={1}>
                        <IconButton 
                            color="primary" 
                            onClick={() => handleViewDetails(params.row)}
                            title="View Details"
                        >
                            <Info color="primary"/>
                        </IconButton>
                        <IconButton 
                            color="info" 
                            onClick={() => handleEdit(params.row)}
                            title="Edit Lesson"
                        >
                            <Edit color="info"/>
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this lesson?")) {
                                    handleDelete(params.row.id);
                                }
                            }}
                            title="Delete Lesson"
                        >
                            <Delete color="error"/>
                        </IconButton>
                    </Stack>
                );
            }
        }
    ];

    // Create skeleton data for loading state
    const createSkeletonRows = () => {
        return Array(5).fill(0).map((_, index) => ({
            id: `skeleton-${index}`,
            topic: `Loading...`,
            description: `Loading lesson description...`,
            duration: `--`,
            materials: `Loading materials...`
        }));
    };

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
                    onClick={handleCreateNew}
                >
                    Add new lesson
                </Button>
            </Box>
            <Paper sx={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={loading ? createSkeletonRows() : lessons}
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
                        },
                        '& .MuiDataGrid-row': {
                            '&:has([data-id^="skeleton-"])': {
                                '& .MuiDataGrid-cell': {
                                    color: '#999',
                                    fontStyle: 'italic'
                                }
                            }
                        }
                    }}
                />
            </Paper>

            <LessonForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setSelectedLesson(null);
                    setEditMode(false);
                }}
                onSubmit={handleFormSubmit}
                mode={editMode ? 'edit' : 'create'}
                initialData={selectedLesson}
                loading={loading}
            />
        </Box>
    );
}