import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
    Button
} from '@mui/material';
import {
    Description,
    Assignment,
    School,
    Topic,
    MenuBook,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';

const SyllabusDetailView = ({
    syllabus,
    lessons = [],
    classes = []
}) => {
    const [showAllLessons, setShowAllLessons] = useState(false);

    if (!syllabus) return null;

    const getTopicColor = () => '#9c27b0';
    const topicColor = getTopicColor();

    const handleToggleLessons = () => {
        setShowAllLessons(!showAllLessons);
    };

    const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 5);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {/* Main Syllabus Information */}
            <Card
                sx={{
                    borderRadius: 3,
                    border: `2px solid ${topicColor}40`,
                    boxShadow: `0 8px 24px ${topicColor}20`
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${topicColor} 0%, ${topicColor}dd 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                flexShrink: 0
                            }}
                        >
                            <Assignment />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="700" sx={{ color: topicColor, mb: 1 }}>
                                {syllabus.title || 'Untitled Syllabus'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Syllabus ID: #{syllabus.id}
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    background: `${topicColor}10`,
                                    border: `1px solid ${topicColor}30`,
                                    borderRadius: 2
                                }}
                            >
                                <MenuBook sx={{ color: topicColor, mb: 1 }} />
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Lessons
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {lessons.length} lessons
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    background: `${topicColor}10`,
                                    border: `1px solid ${topicColor}30`,
                                    borderRadius: 2
                                }}
                            >
                                <School sx={{ color: topicColor, mb: 1 }} />
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Classes
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {classes.length} assigned
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Syllabus Description */}
            <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Description sx={{ color: '#ff9800' }} />
                        <Typography variant="h6" fontWeight="600" color="#ff9800">
                            Syllabus Content
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                            {syllabus.description || 'No description provided'}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Associated Lessons */}
            {lessons.length > 0 && (
                <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <MenuBook sx={{ color: '#2196f3' }} />
                            <Typography variant="h6" fontWeight="600" color="#2196f3">
                                Associated Lessons ({lessons.length})
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            {displayedLessons.map((lesson) => (
                                <Box
                                    key={lesson.id}
                                    sx={{
                                        p: 2,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        bgcolor: '#f8f9fa'
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="600">
                                        {lesson.topic}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Duration: {lesson.duration ? `${lesson.duration} minutes` : 'Not specified'}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                        {lessons.length > 5 && (
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button
                                    variant="text"
                                    onClick={handleToggleLessons}
                                    startIcon={showAllLessons ? <ExpandLess /> : <ExpandMore />}
                                    sx={{
                                        color: '#2196f3',
                                        '&:hover': {
                                            backgroundColor: 'rgba(33, 150, 243, 0.04)'
                                        }
                                    }}
                                >
                                    {showAllLessons 
                                        ? 'Show Less' 
                                        : `Show ${lessons.length - 5} More Lessons`
                                    }
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Assigned Classes */}
            {classes.length > 0 && (
                <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <School sx={{ color: '#4caf50' }} />
                            <Typography variant="h6" fontWeight="600" color="#4caf50">
                                Assigned Classes ({classes.length})
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {classes.map((classItem) => (
                                <Chip
                                    key={classItem.id}
                                    label={classItem.name || `Class #${classItem.id}`}
                                    variant="outlined"
                                    color="success"
                                    sx={{
                                        bgcolor: '#e8f5e8',
                                        borderColor: '#4caf50',
                                        color: '#4caf50',
                                        fontWeight: 500
                                    }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Syllabus Metadata */}
            <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Topic sx={{ color: '#607d8b' }} />
                        <Typography variant="h6" fontWeight="600" color="#607d8b">
                            Syllabus Information
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Syllabus ID
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                #{syllabus.id}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Title
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {syllabus.title || 'Not specified'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Total Lessons
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {lessons.length}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Usage
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {classes.length} classes
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SyllabusDetailView;
