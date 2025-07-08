import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import {
    getLessonById,
    getSyllabiByLessonId,
    getActivitiesByLessonId,
    updateLesson
} from '../../services/EducationService.jsx';
import LessonDetailView from './LessonDetailView.jsx';
import LessonForm from './LessonForm.jsx';

function LessonDetails() {
    const { id: lessonId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/education/lessons';
    const [lesson, setLesson] = useState(null);
    const [syllabi, setSyllabi] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editFormOpen, setEditFormOpen] = useState(false);

    const fetchLessonDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                lessonResponse,
                syllabiResponse,
                activitiesResponse
            ] = await Promise.all([
                getLessonById(lessonId),
                getSyllabiByLessonId(lessonId),
                getActivitiesByLessonId(lessonId)
            ]);

            if (lessonResponse && lessonResponse.success) {
                setLesson(lessonResponse.data);
            } else {
                setError('Failed to load lesson information');
            }

            if (syllabiResponse && syllabiResponse.success) {
                setSyllabi(syllabiResponse.data || []);
            }

            if (activitiesResponse && activitiesResponse.success) {
                setActivities(activitiesResponse.data || []);
            }

        } catch (error) {
            console.error('Error fetching lesson details:', error);
            setError('Failed to load lesson details');
            enqueueSnackbar('Failed to load lesson details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        if (lessonId) {
            fetchLessonDetails();
        }
    }, [lessonId, fetchLessonDetails]);

    const handleBackToLessons = () => {
        navigate(from);
    };

    const handleEditLesson = () => {
        setEditFormOpen(true);
    };

    const handleEditFromDetailView = () => {
        setEditFormOpen(true);
    };

    const handleUpdateLesson = async (lessonData) => {
        try {
            const response = await updateLesson(lesson.id, lessonData);
            if (response && response.success) {
                enqueueSnackbar('Lesson updated successfully', { variant: 'success' });
                setEditFormOpen(false);
                await fetchLessonDetails(); // Refresh lesson data
            } else {
                enqueueSnackbar('Failed to update lesson', { variant: 'error' });
                throw new Error('Failed to update lesson');
            }
        } catch (error) {
            console.error('Error updating lesson:', error);
            enqueueSnackbar('Error updating lesson', { variant: 'error' });
            throw error;
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress sx={{ mr: 2 }} />
                    <Typography>Loading lesson details...</Typography>
                </Box>
            </Box>
        );
    }

    if (error || !lesson) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack sx={{ color: '#1976d2' }} />}
                        onClick={handleBackToLessons}
                        sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                borderColor: '#1976d2'
                            }
                        }}
                    >
                        Back to Lessons
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Lesson Details
                    </Typography>
                </Box>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error || 'Lesson not found'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack sx={{ color: '#1976d2' }} />}
                    onClick={handleBackToLessons}
                    sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            borderColor: '#1976d2'
                        }
                    }}
                >
                    {from.includes('/classes/') ? 'Back to Class' : 'Back to Lessons'}
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 'bold', flex: 1 }}>
                    Lesson Details: {lesson.topic || 'Loading...'}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEditLesson}
                    sx={{
                        backgroundColor: '#2196f3',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#1976d2',
                        }
                    }}
                >
                    Edit Lesson
                </Button>
            </Box>

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <LessonDetailView
                            lesson={lesson}
                            syllabi={syllabi}
                            activities={activities}
                            onEdit={handleEditFromDetailView}
                        />
                    </CardContent>
                </Card>
            </Stack>

            {lesson && (
                <LessonForm
                    open={editFormOpen}
                    onClose={() => setEditFormOpen(false)}
                    onSubmit={handleUpdateLesson}
                    mode="edit"
                    initialData={lesson}
                    loading={false}
                />
            )}
        </Box>
    );
}

export default LessonDetails;
