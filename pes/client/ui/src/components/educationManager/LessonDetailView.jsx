import React from 'react';
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
    AccessTime,
    Assignment,
    School,
    Topic,
    MenuBook,
    Edit
} from '@mui/icons-material';

const LessonDetailView = ({
    lesson,
    syllabi = [],
    activities = [],
    onEdit
}) => {
    if (!lesson) return null;

    const formatDuration = (duration) => {
        if (!duration) return 'Not specified';
        if (duration >= 60) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        }
        return `${duration} minutes`;
    };

    const getTopicColor = () => '#2196f3';
    const topicColor = getTopicColor();

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {/* Main Lesson Information */}
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
                            <MenuBook />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight="700" sx={{ color: topicColor, mb: 1 }}>
                                {lesson.topic || 'Untitled Lesson'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lesson ID: #{lesson.id}
                            </Typography>
                            {onEdit && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => onEdit(lesson)}
                                    sx={{
                                        mt: 1,
                                        borderColor: topicColor,
                                        color: topicColor,
                                        '&:hover': {
                                            backgroundColor: `${topicColor}10`,
                                            borderColor: topicColor
                                        }
                                    }}
                                >
                                    Edit Lesson
                                </Button>
                            )}
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
                                <AccessTime sx={{ color: topicColor, mb: 1 }} />
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Duration
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {formatDuration(lesson.duration)}
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
                                <Assignment sx={{ color: topicColor, mb: 1 }} />
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Syllabi
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {syllabi.length} assigned
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
                                    Activities
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {activities.length} created
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Lesson Description */}
            <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Description sx={{ color: '#ff9800' }} />
                        <Typography variant="h6" fontWeight="600" color="#ff9800">
                            Lesson Content
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Description
                                </Typography>
                                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                    {lesson.description || 'No description provided'}
                                </Typography>
                            </Box>
                        </Grid>
                        {lesson.materials && (
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Required Materials
                                    </Typography>
                                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                                        {lesson.materials}
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {/* Associated Syllabi */}
            {syllabi.length > 0 && (
                <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Assignment sx={{ color: '#9c27b0' }} />
                            <Typography variant="h6" fontWeight="600" color="#9c27b0">
                                Associated Syllabi ({syllabi.length})
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {syllabi.map((syllabus) => (
                                <Chip
                                    key={syllabus.id}
                                    label={syllabus.title || `Syllabus #${syllabus.id}`}
                                    variant="outlined"
                                    color="secondary"
                                    sx={{
                                        bgcolor: '#f3e5f5',
                                        borderColor: '#9c27b0',
                                        color: '#9c27b0',
                                        fontWeight: 500
                                    }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Activities Created */}
            {activities.length > 0 && (
                <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <School sx={{ color: '#4caf50' }} />
                            <Typography variant="h6" fontWeight="600" color="#4caf50">
                                Activities Created ({activities.length})
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1}>
                            {activities.slice(0, 5).map((activity) => (
                                <Box
                                    key={activity.id}
                                    sx={{
                                        p: 2,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        bgcolor: '#f8f9fa'
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="600">
                                        {activity.topic}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {activity.dayOfWeek} • {activity.startTime || 'Time TBD'}
                                    </Typography>
                                </Box>
                            ))}
                            {activities.length > 5 && (
                                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                                    +{activities.length - 5} more activities
                                </Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Lesson Metadata */}
            <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Topic sx={{ color: '#607d8b' }} />
                        <Typography variant="h6" fontWeight="600" color="#607d8b">
                            Lesson Information
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Lesson ID
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                #{lesson.id}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Topic
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {lesson.topic || 'Not specified'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Duration (min)
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {lesson.duration || 'Not specified'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary">
                                Usage
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                                {syllabi.length} syllabi, {activities.length} activities
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LessonDetailView;
