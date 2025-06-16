import React from 'react';
import {Avatar, Box, Card, CardContent, Chip, Container, Grid, Paper, Typography} from '@mui/material';
import {Assignment, CalendarToday, Dashboard, Event, School, TrendingUp} from '@mui/icons-material';

function EducationDashboard() {
    const features = [
        {
            title: 'Class Management',
            description: 'Manage student classes, enrollment, and class information with comprehensive tools.',
            icon: <School/>,
            color: '#1976d2',
            stats: 'Active Classes'
        },
        {
            title: 'Activity Management',
            description: 'Organize and manage educational activities, events, and extracurricular programs.',
            icon: <Event/>,
            color: '#9c27b0',
            stats: 'Upcoming Activities'
        },
        {
            title: 'Schedule Management',
            description: 'Plan and manage class schedules, timetables, and academic calendar efficiently.',
            icon: <CalendarToday/>,
            color: '#f57c00',
            stats: 'Scheduled Sessions'
        },
        {
            title: 'Syllabus Management',
            description: 'Create and manage syllabi for different classes and subjects.',
            icon: <Assignment/>,
            color: '#4caf50',
            stats: 'Active Syllabi'
        },
        {
            title: 'Lessons Management',
            description: 'Plan, organize, and manage lessons effectively.',
            icon: <Dashboard/>,
            color: '#3f51b5',
            stats: 'Total Lessons'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            {/* Header Section */}
            <Box sx={{mb: 4}}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            mr: 2,
                            width: 48,
                            height: 48
                        }}
                    >
                        <Dashboard/>
                    </Avatar>
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            fontWeight="bold"
                            color="primary.main"
                            gutterBottom
                        >
                            Education Management Dashboard
                        </Typography>
                        <Chip
                            icon={<TrendingUp sx={{color: '#666'}}/>}
                            label="Management Portal"
                            color="primary"
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{maxWidth: 600}}
                >
                    Welcome to the Education Management System. Access powerful tools to manage
                    classes, activities, and schedules from your centralized dashboard.
                </Typography>
            </Box>

            {/* Quick Stats Banner */}
            <Paper
                elevation={2}
                sx={{
                    mb: 4,
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            System Overview
                        </Typography>
                        <Typography variant="body1" sx={{opacity: 0.9}}>
                            Monitor and manage all educational activities from this central hub.
                            Navigate using the sidebar to access specific management tools.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{textAlign: 'center'}}>
                        <Assignment sx={{fontSize: 60, opacity: 0.8}}/>
                    </Grid>
                </Grid>
            </Paper>

            {/* Feature Cards */}
            <Typography
                variant="h5"
                component="h2"
                fontWeight="600"
                gutterBottom
                sx={{mb: 3}}
            >
                Management Features
            </Typography>

            <Grid container spacing={3}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            elevation={3}
                            sx={{
                                height: '100%',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <Avatar
                                        sx={{
                                            bgcolor: feature.color,
                                            mr: 2,
                                            width: 40,
                                            height: 40
                                        }}
                                    >
                                        {feature.icon}
                                    </Avatar>
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        fontWeight="600"
                                        color="text.primary"
                                    >
                                        {feature.title}
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{mb: 2, lineHeight: 1.6}}
                                >
                                    {feature.description}
                                </Typography>

                                <Chip
                                    label={feature.stats}
                                    size="small"
                                    sx={{
                                        bgcolor: `${feature.color}15`,
                                        color: feature.color,
                                        fontWeight: 500
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Additional Info Section */}
            <Box sx={{mt: 4}}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 3,
                        borderLeft: 4,
                        borderLeftColor: 'primary.main',
                        bgcolor: 'grey.50'
                    }}
                >
                    <Typography variant="h6" gutterBottom color="primary.main">
                        Getting Started
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Use the navigation menu on the left to access different management tools.
                        Each section provides comprehensive functionality for managing your educational institution's
                        operations.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default EducationDashboard;