import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Stack,
    Divider,
    Grid,
    RadioGroup,
    FormControlLabel,
    Radio,
    Alert,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    IconButton
} from "@mui/material";
import { viewParentProfile, updateParentProfile } from "../../services/ParentService";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parse } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfileParent = () => {
    const [parent, setParent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchParentProfile();
    }, []);

    const fetchParentProfile = async () => {
        try {
            setLoading(true);
            const response = await viewParentProfile();
            if (response.success) {
                setParent(response.data);
                setForm(response.data);
            } else {
                showSnackbar(response.message, 'error');
            }
        } catch (error) {
            showSnackbar('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        
        // Convert gender to lowercase when saving to match backend validation
        if (name === 'gender') {
            processedValue = value.toLowerCase();
        }
        
        setForm({ ...form, [name]: processedValue });
    };

    const handleDateChange = (date) => {
        setForm({ ...form, dayOfBirth: format(date, 'yyyy-MM-dd') });
    };

    const handleOpen = () => {
        setForm(parent);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Remove identityNumber and email from form data before sending
            const { identityNumber, email, ...updateData } = form;
            const response = await updateParentProfile(updateData);
            if (response.success) {
                showSnackbar('Profile updated successfully');
                await fetchParentProfile();
                setOpen(false);
            } else {
                showSnackbar(response.message, 'error');
            }
        } catch (error) {
            showSnackbar('Failed to update profile: ' + error.response.data.message, 'error');
        }
        setSaving(false);
    };

    if (loading) return <Typography align="center">Loading...</Typography>;
    if (!parent) return <Typography align="center">Profile not found.</Typography>;

    return (
        <>
            <Card
                sx={{
                    mb: 3,
                    p: 3,
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px 0 rgba(60,72,88,0.12)',
                    border: '1px solid #e3e8ee',
                    maxWidth: 800,
                    width: '100%',
                    mx: 'auto',
                    my: 4
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Profile
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <CardContent>
                    <Grid container spacing={2} justifyContent={'space-around'}>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={2}>
                                <Typography><strong>Name:</strong> {parent.name}</Typography>
                                <Typography><strong>Email:</strong> {parent.email}</Typography>
                                <Typography><strong>Phone:</strong> {parent.phone}</Typography>
                                <Typography><strong>Address:</strong> {parent.address}</Typography>
                                <Typography><strong>Date of Birth:</strong> {parent.dayOfBirth}</Typography>
                            </Stack>
                        </Grid>
                        <Divider orientation="vertical" flexItem />
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={2}>
                                <Typography><strong>Gender:</strong> {parent.gender}</Typography>
                                <Typography><strong>Identity Number:</strong> {parent.identityNumber}</Typography>
                                <Typography><strong>Job:</strong> {parent.job}</Typography>
                                <Typography><strong>Relationship to Child:</strong> {parent.relationshipToChild}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>

                <CardActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={handleOpen}
                    >
                        Update Profile
                    </Button>
                </CardActions>
            </Card>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        m: 2
                    }
                }}
            >
                <DialogTitle sx={{ 
                    p: 3,
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccountCircleIcon color="primary" sx={{ fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>Update Profile</Typography>
                    </Box>
                    <IconButton 
                        onClick={handleClose} 
                        size="small"
                        sx={{ 
                            '&:hover': { 
                                bgcolor: 'rgba(0, 0, 0, 0.04)' 
                            } 
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Personal Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={form.name || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        size="small"
                                        sx={{ bgcolor: 'white' }}
                                    />
                                    
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={form.phone || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        size="small"
                                        sx={{ bgcolor: 'white' }}
                                    />
                                    
                                    <TextField
                                        label="Identity Number"
                                        name="identityNumber"
                                        value={form.identityNumber || ''}
                                        fullWidth
                                        size="small"
                                        disabled
                                        sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    
                                    <TextField
                                        label="Address"
                                        name="address"
                                        value={form.address || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        size="small"
                                        multiline
                                        rows={2}
                                        sx={{ bgcolor: 'white' }}
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Additional Information
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                
                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Job"
                                        name="job"
                                        value={form.job || ''}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                        size="small"
                                        sx={{ bgcolor: 'white' }}
                                    />
                                    
                                    <FormControl 
                                        component="fieldset" 
                                        sx={{ 
                                            width: '100%',
                                            p: 1.5,
                                            border: '1px solid rgba(0, 0, 0, 0.23)',
                                            borderRadius: 1,
                                            bgcolor: 'white'
                                        }}
                                    >
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Relationship to Child *
                                        </Typography>
                                        <RadioGroup
                                            name="relationshipToChild"
                                            value={form.relationshipToChild || ''}
                                            onChange={handleChange}
                                            row
                                            required
                                            sx={{ justifyContent: 'flex-start', gap: 4, ml: 1 }}
                                        >
                                            <FormControlLabel value="Mother" control={<Radio size="small" />} label="Mother" />
                                            <FormControlLabel value="Father" control={<Radio size="small" />} label="Father" />
                                        </RadioGroup>
                                    </FormControl>
                                    
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date of Birth"
                                            value={form.dayOfBirth ? parse(form.dayOfBirth, 'yyyy-MM-dd', new Date()) : null}
                                            onChange={handleDateChange}
                                            renderInput={(params) => (
                                                <TextField {...params} fullWidth size="small" required sx={{ bgcolor: 'white' }} />
                                            )}
                                            format="yyyy-MM-dd"
                                        />
                                    </LocalizationProvider>
                                    
                                    <FormControl 
                                        component="fieldset" 
                                        sx={{ 
                                            width: '100%',
                                            p: 1.5,
                                            border: '1px solid rgba(0, 0, 0, 0.23)',
                                            borderRadius: 1,
                                            bgcolor: 'white'
                                        }}
                                    >
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Gender *
                                        </Typography>
                                        <RadioGroup
                                            name="gender"
                                            value={form.gender || parent.gender || ''}
                                            onChange={handleChange}
                                            row
                                            required
                                            sx={{ justifyContent: 'flex-start', gap: 4, ml: 1 }}
                                        >
                                            <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                                            <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                                        </RadioGroup>
                                    </FormControl>
                                </Stack>
                            </Box>
                        </Stack>
                    </form>
                </DialogContent>

                <DialogActions 
                    sx={{ 
                        p: 3, 
                        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        gap: 1
                    }}
                >
                    <Button 
                        onClick={handleClose} 
                        color="inherit" 
                        disabled={saving}
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.08)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={saving}
                        sx={{ 
                            borderRadius: 2,
                            px: 4,
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProfileParent;
