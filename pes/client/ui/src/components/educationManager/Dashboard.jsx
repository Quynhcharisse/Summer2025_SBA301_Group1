import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { School, Event, CalendarToday } from '@mui/icons-material';

function Dashboard() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Education Management Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Welcome to the Education Management System. Use the navigation menu to access different features.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <School color="primary" sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Class Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage student classes, enrollment, and class information.
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Event color="primary" sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Activity Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Organize and manage educational activities and events.
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <CalendarToday color="primary" sx={{ fontSize: 40, mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            Schedule Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Plan and manage class schedules and timetables.
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
