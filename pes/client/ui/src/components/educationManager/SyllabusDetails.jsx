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
import { useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import {
    getSyllabusById,
    getLessonsBySyllabusId,
    updateSyllabus,
    getAllClasses
} from '../../services/EducationService.jsx';
import SyllabusDetailView from './SyllabusDetailView.jsx';
import SyllabusForm from './SyllabusForm.jsx';

function SyllabusDetails() {
    const { id: syllabusId } = useParams();
    const navigate = useNavigate();
    const [syllabus, setSyllabus] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editFormOpen, setEditFormOpen] = useState(false);

    const fetchSyllabusDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [
                syllabusResponse,
                lessonsResponse,
                classesResponse
            ] = await Promise.all([
                getSyllabusById(syllabusId),
                getLessonsBySyllabusId(syllabusId),
                getAllClasses()
            ]);

            if (syllabusResponse && syllabusResponse.success) {
                setSyllabus(syllabusResponse.data);
            } else {
                setError('Failed to load syllabus information');
            }

            if (lessonsResponse && lessonsResponse.success) {
                setLessons(lessonsResponse.data || []);
            }

            // Filter classes that use this syllabus
            if (classesResponse && classesResponse.success) {
                const allClasses = classesResponse.data || [];
                const syllabusClasses = allClasses.filter(cls => 
                    cls.syllabus && cls.syllabus.id === parseInt(syllabusId)
                );
                setClasses(syllabusClasses);
            }

        } catch (error) {
            console.error('Error fetching syllabus details:', error);
            setError('Failed to load syllabus details');
            enqueueSnackbar('Failed to load syllabus details', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [syllabusId]);

    useEffect(() => {
        if (syllabusId) {
            fetchSyllabusDetails();
        }
    }, [syllabusId, fetchSyllabusDetails]);

    const handleBackToSyllabi = () => {
        navigate('/education/syllabus');
    };

    const handleEditSyllabus = () => {
        setEditFormOpen(true);
    };

    const handleUpdateSyllabus = async (syllabusData) => {
        try {
            const response = await updateSyllabus(syllabus.id, syllabusData);
            if (response && response.success) {
                enqueueSnackbar('Syllabus updated successfully', { variant: 'success' });
                setEditFormOpen(false);
                await fetchSyllabusDetails();
            } else {
                enqueueSnackbar('Failed to update syllabus', { variant: 'error' });
                throw new Error('Failed to update syllabus');
            }
        } catch (error) {
            console.error('Error updating syllabus:', error);
            enqueueSnackbar('Error updating syllabus', { variant: 'error' });
            throw error;
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress sx={{ mr: 2 }} />
                    <Typography>Loading syllabus details...</Typography>
                </Box>
            </Box>
        );
    }

    if (error || !syllabus) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack sx={{ color: '#1976d2' }} />}
                        onClick={handleBackToSyllabi}
                        sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                borderColor: '#1976d2'
                            }
                        }}
                    >
                        Back to Syllabi
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Syllabus Details
                    </Typography>
                </Box>
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error || 'Syllabus not found'}
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
                    onClick={handleBackToSyllabi}
                    sx={{
                        borderColor: '#1976d2',
                        color: '#1976d2',
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            borderColor: '#1976d2'
                        }
                    }}
                >
                    Back to Syllabi
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 'bold', flex: 1 }}>
                    Syllabus Details: {syllabus.title || 'Loading...'}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEditSyllabus}
                    sx={{
                        backgroundColor: '#9c27b0',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#7b1fa2',
                        }
                    }}
                >
                    Edit Syllabus
                </Button>
            </Box>

            <Stack spacing={3}>
                <Card>
                    <CardContent>
                        <SyllabusDetailView
                            syllabus={syllabus}
                            lessons={lessons}
                            classes={classes}
                        />
                    </CardContent>
                </Card>
            </Stack>

            {syllabus && (
                <SyllabusForm
                    open={editFormOpen}
                    onClose={() => setEditFormOpen(false)}
                    onSubmit={handleUpdateSyllabus}
                    syllabus={syllabus}
                    isEdit={true}
                />
            )}
        </Box>
    );
}

export default SyllabusDetails;
