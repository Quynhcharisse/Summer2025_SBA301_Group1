import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    LinearProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Alert,
    Divider
} from '@mui/material';
import {
    TrendingUp,
    Class,
    Assignment,
    Schedule,
    People,
    CheckCircle,
    Warning,
    Error as ErrorIcon
} from '@mui/icons-material';
import {
    getAllClasses,
    getAllActivities,
    getAllSchedules,
    getClassesByStatus
} from '../../services/ManagerService.jsx';
import { enqueueSnackbar } from 'notistack';

function Dashboard() {
    const [stats, setStats] = useState({
        totalClasses: 0,
        totalActivities: 0,
        totalSchedules: 0,
        activeClasses: 0,
        inactiveClasses: 0
    });
    
    const [recentData, setRecentData] = useState({
        classes: [],
        activities: [],
        schedules: []
    });
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            const [
                classesResponse,
                activitiesResponse,
                schedulesResponse,
                activeClassesResponse,
                inactiveClassesResponse
            ] = await Promise.all([
                getAllClasses(),
                getAllActivities(),
                getAllSchedules(),
                getClassesByStatus('ACTIVE'),
                getClassesByStatus('INACTIVE')
            ]);

            // Calculate stats
            const totalClasses = classesResponse?.success ? classesResponse.data.length : 0;
            const totalActivities = activitiesResponse?.success ? activitiesResponse.data.length : 0;
            const totalSchedules = schedulesResponse?.success ? schedulesResponse.data.length : 0;
            const activeClasses = activeClassesResponse?.success ? activeClassesResponse.data.length : 0;
            const inactiveClasses = inactiveClassesResponse?.success ? inactiveClassesResponse.data.length : 0;

            setStats({
                totalClasses,
                totalActivities,
                totalSchedules,
                activeClasses,
                inactiveClasses
            });

            // Set recent data (latest 5 items)
            setRecentData({
                classes: classesResponse?.success ? classesResponse.data.slice(0, 5) : [],
                activities: activitiesResponse?.success ? activitiesResponse.data.slice(0, 5) : [],
                schedules: schedulesResponse?.success ? schedulesResponse.data.slice(0, 5) : []
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            enqueueSnackbar('Error loading dashboard data', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'success';
            case 'medium': return 'warning';
            case 'hard': return 'error';
            default: return 'default';
        }
    };

    const StatCard = ({ title, value, icon, color, progress }) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: color, mr: 2 }}>
                        {icon}
                    </Avatar>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                    {value}
                </Typography>
                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {progress}% of capacity
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    const QuickActionCard = ({ title, description, icon, color, action, buttonText }) => (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: color, mr: 2 }}>
                        {icon}
                    </Avatar>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={action} variant="contained" sx={{ bgcolor: color }}>
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Loading Dashboard...</Typography>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Education Manager Dashboard
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Classes"
                        value={stats.totalClasses}
                        icon={<Class />}
                        color="primary.main"
                        progress={stats.totalClasses > 0 ? (stats.activeClasses / stats.totalClasses) * 100 : 0}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Activities"
                        value={stats.totalActivities}
                        icon={<Assignment />}
                        color="secondary.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Schedules"
                        value={stats.totalSchedules}
                        icon={<Schedule />}
                        color="info.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Classes"
                        value={stats.activeClasses}
                        icon={<CheckCircle />}
                        color="success.main"
                    />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                        title="Manage Classes"
                        description="View and manage all classes, syllabus, and lessons"
                        icon={<Class />}
                        color="primary.main"
                        action={() => window.location.href = '/manager/classes'}
                        buttonText="Go to Classes"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                        title="Create Activities"
                        description="Create new activities or manage existing ones"
                        icon={<Assignment />}
                        color="secondary.main"
                        action={() => window.location.href = '/manager/activities'}
                        buttonText="Manage Activities"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                        title="Schedule Management"
                        description="Create and manage class schedules"
                        icon={<Schedule />}
                        color="info.main"
                        action={() => window.location.href = '/manager/schedules'}
                        buttonText="Manage Schedules"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <QuickActionCard
                        title="View Reports"
                        description="Generate reports and analytics"
                        icon={<TrendingUp />}
                        color="warning.main"
                        action={() => enqueueSnackbar('Reports feature coming soon!', { variant: 'info' })}
                        buttonText="View Reports"
                    />
                </Grid>
            </Grid>

            {/* Recent Data Overview */}
            <Grid container spacing={3}>
                {/* Recent Classes */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Recent Classes
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {recentData.classes.length > 0 ? (
                            <List dense>
                                {recentData.classes.map((cls, index) => (
                                    <ListItem key={cls.id} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        {cls.className}
                                                    </Typography>
                                                    <Chip 
                                                        label={cls.status} 
                                                        size="small"
                                                        color={getStatusColor(cls.status)}
                                                    />
                                                </Box>
                                            }
                                            secondary={`Grade ${cls.grade} • Capacity: ${cls.capacity}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">No classes found</Alert>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Recent Activities
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {recentData.activities.length > 0 ? (
                            <List dense>
                                {recentData.activities.map((activity, index) => (
                                    <ListItem key={activity.id} sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle2">
                                                        {activity.title}
                                                    </Typography>
                                                    <Chip 
                                                        label={activity.difficulty} 
                                                        size="small"
                                                        color={getDifficultyColor(activity.difficulty)}
                                                    />
                                                </Box>
                                            }
                                            secondary={`${activity.activityType} • ${activity.duration} mins`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Alert severity="info">No activities found</Alert>
                        )}
                    </Paper>
                </Grid>

                {/* System Status */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            System Status
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List dense>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle color="success" />
                                            <Typography variant="subtitle2">Database Connection</Typography>
                                        </Box>
                                    }
                                    secondary="All systems operational"
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle color="success" />
                                            <Typography variant="subtitle2">API Services</Typography>
                                        </Box>
                                    }
                                    secondary="All endpoints responding"
                                />
                            </ListItem>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Warning color="warning" />
                                            <Typography variant="subtitle2">Scheduled Maintenance</Typography>
                                        </Box>
                                    }
                                    secondary="Next maintenance: Weekly Sunday 2 AM"
                                />
                            </ListItem>
                        </List>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Class Distribution
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Active Classes</Typography>
                                <Typography variant="body2">{stats.activeClasses}</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={stats.totalClasses > 0 ? (stats.activeClasses / stats.totalClasses) * 100 : 0}
                                color="success"
                                sx={{ mb: 2 }}
                            />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Inactive Classes</Typography>
                                <Typography variant="body2">{stats.inactiveClasses}</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={stats.totalClasses > 0 ? (stats.inactiveClasses / stats.totalClasses) * 100 : 0}
                                color="error"
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;