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
    Snackbar
} from "@mui/material";
import { viewParentProfile, updateParentProfile } from "../../services/ParentService";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parse } from 'date-fns';

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
            showSnackbar('Failed to update profile', 'error');
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

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Update Profile</DialogTitle>
                <DialogContent dividers>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Name"
                                    name="name"
                                    value={form.name || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Phone"
                                    name="phone"
                                    value={form.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Identity Number"
                                    name="identityNumber"
                                    value={form.identityNumber || ''}
                                    fullWidth
                                    size="small"
                                    disabled
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={form.address || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Job"
                                    name="job"
                                    value={form.job || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Relationship to Child"
                                    name="relationshipToChild"
                                    value={form.relationshipToChild || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date of Birth"
                                        value={form.dayOfBirth ? parse(form.dayOfBirth, 'yyyy-MM-dd', new Date()) : null}
                                        onChange={handleDateChange}
                                        renderInput={(params) => (
                                            <TextField {...params} fullWidth size="small" required />
                                        )}
                                        format="yyyy-MM-dd"
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>Gender</Typography>
                                <RadioGroup
                                    name="gender"
                                    value={form.gender || parent.gender || ''}
                                    onChange={handleChange}
                                    row
                                    required
                                >
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit" disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={saving}>
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
