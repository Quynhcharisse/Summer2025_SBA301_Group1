import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Close,
    Person,
    Email,
    Phone,
    Badge,
    School,
    AccountCircle,
    Class,
    CalendarToday,
    LocationOn
} from '@mui/icons-material';

const TeacherDetailView = ({
    teacher,
    open,
    onClose
}) => {
    if (!teacher) return null;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return '#4caf50';
            case 'inactive':
                return '#f44336';
            case 'pending':
                return '#ff9800';
            default:
                return '#6c757d';
        }
    };

    const getGenderColor = (gender) => {
        switch (gender?.toLowerCase()) {
            case 'male':
                return '#2196f3';
            case 'female':
                return '#e91e63';
            default:
                return '#9c27b0';
        }
    };

    const statusColor = getStatusColor(teacher.status);
    const genderColor = getGenderColor(teacher.gender);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '80vh',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                }
            }}
        >
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%)`,
                    color: 'white',
                    p: 3,
                    position: 'relative'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                            Teacher Details
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {teacher.name || teacher.firstName || 'Teacher Information'}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.3)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ p: 3 }}>
                    <Card
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            border: `2px solid ${statusColor}40`,
                            boxShadow: `0 8px 24px ${statusColor}20`
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}
                                >
                                    <Person />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight="700" sx={{ color: statusColor, mb: 1 }}>
                                        {teacher.name || teacher.firstName || 'Unknown Teacher'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Teacher ID: #{teacher.id}
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${statusColor}10`,
                                            border: `1px solid ${statusColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <Email sx={{ color: statusColor, mb: 1 }} />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600" sx={{ wordBreak: 'break-word' }}>
                                            {teacher.email || 'Not provided'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${statusColor}10`,
                                            border: `1px solid ${statusColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <Phone sx={{ color: statusColor, mb: 1 }} />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {teacher.phone || 'Not provided'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${genderColor}10`,
                                            border: `1px solid ${genderColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <AccountCircle sx={{ color: genderColor, mb: 1 }} />
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Gender
                                        </Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {teacher.gender || 'Not specified'}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            background: `${statusColor}10`,
                                            border: `1px solid ${statusColor}30`,
                                            borderRadius: 2
                                        }}
                                    >
                                        <Chip
                                            label={teacher.status || 'Unknown'}
                                            sx={{
                                                bgcolor: statusColor,
                                                color: 'white',
                                                fontWeight: 600,
                                                width: '100%'
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Badge sx={{ color: '#ff9800' }} />
                                <Typography variant="h6" fontWeight="600" color="#ff9800">
                                    Professional Information
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Role
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <School sx={{ color: '#2196f3', fontSize: 20 }} />
                                                <Typography variant="body1" fontWeight="500">
                                                    {teacher.role || 'Teacher'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {teacher.identityNumber && (
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Identity Number
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500">
                                                    {teacher.identityNumber}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2}>
                                        {teacher.createdAt && (
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Joined Date
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday sx={{ color: '#4caf50', fontSize: 20 }} />
                                                    <Typography variant="body1" fontWeight="500">
                                                        {new Date(teacher.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {teacher.classes && (
                        <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Class sx={{ color: '#9c27b0' }} />
                                    <Typography variant="h6" fontWeight="600" color="#9c27b0">
                                        Assigned Class
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Class Name
                                                </Typography>
                                                <Typography variant="body1" fontWeight="500">
                                                    {teacher.classes.name || 'Not specified'}
                                                </Typography>
                                            </Box>
                                            {teacher.classes.grade && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Grade
                                                    </Typography>
                                                    <Chip
                                                        label={teacher.classes.grade}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#e3f2fd',
                                                            color: '#1976d2',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            {teacher.classes.roomNumber && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Room Number
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LocationOn sx={{ color: '#f44336', fontSize: 20 }} />
                                                        <Typography variant="body1" fontWeight="500">
                                                            {teacher.classes.roomNumber}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                            {teacher.classes.numberStudent && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Number of Students
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {teacher.classes.numberStudent}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <AccountCircle sx={{ color: '#607d8b' }} />
                                <Typography variant="h6" fontWeight="600" color="#607d8b">
                                    Account Information
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Teacher ID
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500">
                                        #{teacher.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Account Status
                                    </Typography>
                                    <Chip
                                        label={teacher.status || 'Unknown'}
                                        size="small"
                                        sx={{
                                            bgcolor: teacher.status === 'active' ? '#e8f5e8' : '#ffeaa7',
                                            color: teacher.status === 'active' ? '#2e7d32' : '#e17055',
                                            fontWeight: 600,
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">
                                        Role
                                    </Typography>
                                    <Typography variant="body2" fontWeight="500">
                                        {teacher.role || 'Teacher'}
                                    </Typography>
                                </Grid>
                                {teacher.classes && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">
                                            Class ID
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500">
                                            #{teacher.classes.id}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TeacherDetailView;