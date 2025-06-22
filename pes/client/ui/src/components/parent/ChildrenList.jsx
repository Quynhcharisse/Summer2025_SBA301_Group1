import React, {useEffect, useState} from "react";
import {addChild, getChildrenList, updateChild} from "../../services/ParentService";
import {
    Alert,
    AppBar,
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    FormHelperText,
    Grid,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import axios from "axios";

const ChildrenList = () => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(5);
    // const [remainingUpdates, setRemainingUpdates] = useState(5);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Dialog state
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        id: "",
        name: "",
        gender: "",
        dateOfBirth: "",
        placeOfBirth: "",
        profileImage: "",
        birthCertificateImg: "",
        householdRegistrationImg: "",
    });
    const [editId, setEditId] = useState(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});

    // Add state for file uploads
    const [uploadedFiles, setUploadedFiles] = useState({
        profile: null,
        birth: null,
        household: null,
    });

    // Add state for upload loading
    const [uploadingFiles, setUploadingFiles] = useState({
        profile: false,
        birth: false,
        household: false
    });

    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageZoom, setImageZoom] = useState(1);

    // Format date to YYYY-MM-DD for form input
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
            // First try parsing as ISO string
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateString);
                return "";
            }
            // Format as YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    // Format date to display format (DD/MM/YYYY)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "";
        try {
            // First try parsing as ISO string
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.error("Invalid date:", dateString);
                return "Invalid Date";
            }
            return date.toLocaleDateString('en-GB');
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    const add = async (child) => {
        try {
            setSaving(true);
            const response = await addChild(child);
            if (response?.success) {
                setSnackbar({
                    open: true,
                    message: "Child added successfully",
                    severity: "success"
                });
                await fetchChildren();
                handleClose();
            } else {
                throw new Error(response?.message || "Failed to add child");
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || error.message,
                severity: "error"
            });
        } finally {
            setSaving(false);
        }
    };

    const update = async (child) => {
        try {
            setSaving(true);
            const response = await updateChild(child);
            if (response?.success) {
                setSnackbar({
                    open: true,
                    message: response.message || "Child updated successfully",
                    severity: "success"
                });
                await fetchChildren();
                handleClose();
            } else {
                throw new Error(response?.message || "Failed to update child");
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || error.message,
                severity: "error"
            });
        } finally {
            setSaving(false);
        }
    };

    const handleOpen = () => {
        setEditId(null);
        setForm({
            name: "",
            gender: "",
            dateOfBirth: "",
            placeOfBirth: "",
            profileImage: "",
            birthCertificateImg: "",
            householdRegistrationImg: "",
        });
        setUploadedFiles({
            profile: null,
            birth: null,
            household: null,
        });
        setErrors({});
        setOpen(true);
    };

    const handleEditOpen = (child) => {
        console.log("Opening edit dialog for child:", child);
        
        // Check if child object exists
        if (!child) {
            showSnackbar("Invalid child data", "error");
            return;
        }

        if (child.isStudent) {
            showSnackbar("Cannot edit enrolled student", "error");
            return;
        }

        if (child.updateCount >= 5) {
            showSnackbar("You have reached the maximum number of updates allowed", "error");
            return;
        }

        // Format date properly
        const formattedDate = child.dateOfBirth ? formatDateForInput(child.dateOfBirth) : '';
        
        // Capitalize gender
        const formattedGender = child.gender 
            ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1).toLowerCase() 
            : '';

        console.log("Formatted date:", formattedDate);
        console.log("Formatted gender:", formattedGender);

        setEditId(child.id);
        setForm({
            id: child.id,
            name: child.name || '',
            gender: formattedGender,
            dateOfBirth: formattedDate,
            placeOfBirth: child.placeOfBirth || '',
            profileImage: child.profileImage || '',
            birthCertificateImg: child.birthCertificateImg || '',
            householdRegistrationImg: child.householdRegistrationImg || '',
        });

        // Set uploaded files for preview
        setUploadedFiles({
            profile: child.profileImage || null,
            birth: child.birthCertificateImg || null,
            household: child.householdRegistrationImg || null,
        });
        
        console.log("Setting form data:", form);
        setErrors({});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm({
            name: "",
            gender: "",
            dateOfBirth: "",
            placeOfBirth: "",
            profileImage: "",
            birthCertificateImg: "",
            householdRegistrationImg: "",
        });
        setEditId(null);
        setErrors({});
    };

    const handleSnackbarClose = () => {
        setSnackbar({...snackbar, open: false});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error for the field being changed
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));

        if (name === 'gender') {
            setForm(prev => ({
                ...prev,
                gender: value.charAt(0).toUpperCase() + value.slice(1)
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle file upload
    const handleFileUpload = async (file, field) => {
        if (!file) return;

        // Set loading state for the specific field
        setUploadingFiles(prev => ({
            ...prev,
            [field]: true
        }));

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "pes_swd");
            formData.append("api_key", "837117616828593");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload",
                formData,
                {
                    headers: {"Content-Type": "multipart/form-data"}
                }
            );

            if (response.status === 200) {
                const imageUrl = response.data.url;

                // Map field names for form update
                const formFieldMap = {
                    'profile': 'profileImage',
                    'birth': 'birthCertificateImg',
                    'household': 'householdRegistrationImg'
                };

                // Update form with the URL
                setForm(prev => ({
                    ...prev,
                    [formFieldMap[field]]: imageUrl
                }));

                // Update uploadedFiles with the URL
                setUploadedFiles(prev => ({
                    ...prev,
                    [field]: imageUrl
                }));

                // Show success message
                setSnackbar({
                    open: true,
                    message: "File uploaded successfully",
                    severity: "success"
                });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Failed to upload file. Please try again.",
                severity: "error"
            });

            // Reset the UI state on error
            setUploadedFiles(prev => ({
                ...prev,
                [field]: null
            }));
        } finally {
            // Reset loading state
            setUploadingFiles(prev => ({
                ...prev,
                [field]: false
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!form.name?.trim()) {
            errors.name = "Name is required";
        } else if (form.name.length < 2 || form.name.length > 50) {
            errors.name = "Name must be between 2 and 50 characters";
        }

        // Gender validation
        if (!form.gender) {
            errors.gender = "Gender is required";
        } else if (!['Male', 'Female'].includes(form.gender)) {
            errors.gender = "Gender must be Male or Female";
        }

        // Date of birth validation
        if (!form.dateOfBirth) {
            errors.dateOfBirth = "Date of birth is required";
        } else {
            const dob = new Date(form.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            
            if (age < 3 || age > 5) {
                errors.dateOfBirth = "Child must be between 3-5 years old";
            }
        }

        // Place of birth validation
        if (!form.placeOfBirth?.trim()) {
            errors.placeOfBirth = "Place of birth is required";
        } else if (form.placeOfBirth.length > 100) {
            errors.placeOfBirth = "Place of birth must not exceed 100 characters";
        }

        // Image validations
        if (!form.profileImage && !uploadedFiles.profile) {
            errors.profileImage = "Profile image is required";
        }
        if (!form.birthCertificateImg && !uploadedFiles.birth) {
            errors.birthCertificate = "Birth certificate image is required";
        }
        if (!form.householdRegistrationImg && !uploadedFiles.household) {
            errors.householdRegistration = "Household registration image is required";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            // Show all errors in a list
            const errorMessages = Object.values(errors);
            setSnackbar({
                open: true,
                message: (
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                ),
                severity: "error"
            });
            return;
        }

        try {
            // Format date to match backend requirements
            const formattedData = {
                ...form,
                dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : null,
                gender: form.gender // Already properly formatted in handleChange
            };

            if (editId) {
                await update(formattedData);
            } else {
                await add(formattedData);
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || "Operation failed",
                severity: "error"
            });
        }
    };

    // Helper function to show snackbar
    const showSnackbar = (message, severity) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Function to fetch children data
    const fetchChildren = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getChildrenList();

            if (!response || !response.success) {
                throw new Error(response?.message || "Failed to fetch children data");
            }

            const childrenData = response.data || [];
            console.log("Children data:", childrenData);
            console.log("Date format example:", childrenData[0]?.dateOfBirth);
            setChildren(childrenData);
        } catch (err) {
            console.error("Error fetching children:", err);
            setError(err.message || "Failed to fetch children data");
            setChildren([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };
    //
    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };
    //
    // const safeChildren = Array.isArray(children) ? children : [];

    const handleViewOpen = (child) => {
        setSelectedChild(child);
        setViewDialogOpen(true);
    };

    const handleViewClose = () => {
        setViewDialogOpen(false);
        setSelectedChild(null);
    };

    // Function to handle image click
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageZoom(1);
    };

    // Function to handle zoom in/out
    const handleZoom = (zoomIn) => {
        setImageZoom(prev => {
            const newZoom = zoomIn ? prev + 0.5 : prev - 0.5;
            return Math.min(Math.max(0.5, newZoom), 3); // Limit zoom between 0.5x and 3x
        });
    };

    // Add UploadBox component
    const UploadBox = ({ label, hasFile, onUpload, children }) => {
        if (hasFile) {
            return children;
        }

        return (
            <Box
                sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                    },
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                component="label"
            >
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => onUpload(e.target.files[0])}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="subtitle1" color="textSecondary">
                    {label}
                </Typography>
            </Box>
        );
    };

    // Add ImagePreview component
    const ImagePreview = ({ url, label, onDelete, onView }) => {
        if (!url) return null;

        const handleViewClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onView();
        };

        const handleDeleteClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
        };

        return (
            <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {label}
                    <Chip
                        label="Current File"
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Typography>
                <Card sx={{ maxWidth: 200, mt: 1, position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={url}
                        alt={label}
                        sx={{ objectFit: "contain" }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        display: 'flex',
                        gap: 0.5,
                        p: 0.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    }}>
                        <IconButton
                            size="small"
                            onClick={handleViewClick}
                            sx={{
                                backgroundColor: 'white',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleDeleteClick}
                            sx={{
                                backgroundColor: 'white',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Card>
            </Box>
        );
    };

    // Add function to handle image deletion
    const handleDeleteImage = (field) => {
        setForm(prev => ({
            ...prev,
            [field]: ''
        }));
        setUploadedFiles(prev => ({
            ...prev,
            [field === 'profileImage' ? 'profile' :
                field === 'birthCertificateImg' ? 'birth' : 'household']: null
        }));
    };

    // Add function to handle full image view
    const handleViewImage = (url) => {
        setSelectedImage(url);
        setViewDialogOpen(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    console.log(form)
    return (
        <Box sx={{p: 3, maxWidth: '1400px', mx: 'auto'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                mt: 2
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        flex: 1,
                        textAlign: 'center',
                        color: 'rgb(51, 62, 77)',
                        fontWeight: 'bold',
                        fontSize: '32px',
                        mb: 1
                    }}
                >
                    Children List
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                        bgcolor: 'rgb(51, 62, 77)',
                        '&:hover': {
                            bgcolor: 'rgb(41, 52, 67)'
                        },
                        position: 'absolute',
                        right: '24px'
                    }}
                >
                    ADD CHILD
                </Button>
            </Box>

            <Box sx={{
                maxWidth: '1200px',
                mx: 'auto',
                mt: 4
            }}>
                <TableContainer component={Paper} sx={{
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: 'rgb(51, 62, 77)',
                                '& th': {
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    padding: '16px'
                                }
                            }}>
                                <TableCell sx={{color: 'white'}}>Name</TableCell>
                                <TableCell sx={{color: 'white'}}>Gender</TableCell>
                                <TableCell sx={{color: 'white'}}>Date of Birth</TableCell>
                                <TableCell sx={{color: 'white'}}>Place of Birth</TableCell>
                                <TableCell sx={{color: 'white'}}>Update Count</TableCell>
                                <TableCell sx={{color: 'white'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {children.length > 0 ? (
                                children.map((child) => {
                                    console.log("Child data:", {
                                        id: child.id,
                                        name: child.name,
                                        isStudent: child.isStudent,
                                        updateCount: child.updateCount
                                    });
                                    return (
                                        <TableRow
                                            key={child.id}
                                            sx={{
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                '& td': {
                                                    padding: '16px',
                                                    fontSize: '14px'
                                                }
                                            }}
                                        >
                                            <TableCell>{child.name}</TableCell>
                                            <TableCell>
                                                {child.gender 
                                                    ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1).toLowerCase() 
                                                    : ''}
                                            </TableCell>
                                            <TableCell>{formatDateForDisplay(child.dateOfBirth)}</TableCell>
                                            <TableCell>{child.placeOfBirth}</TableCell>
                                            <TableCell>
                                                <Box sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <Typography>
                                                        {child.updateCount || 0}/5
                                                    </Typography>
                                                    {child.isStudent && (
                                                        <Typography variant="caption"
                                                                    color="success.main">(Enrolled)</Typography>
                                                    )}
                                                    {child.hadForm && (
                                                        <Typography variant="caption" color="warning.main">(Form
                                                            Submitted)</Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <IconButton
                                                        onClick={() => handleViewOpen(child)}
                                                        sx={{
                                                            color: '#1976d2',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                            }
                                                        }}
                                                    >
                                                        <VisibilityIcon color={"primary"}/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            console.log("Edit button clicked for child:", {
                                                                id: child.id,
                                                                name: child.name,
                                                                isStudent: child.isStudent,
                                                                updateCount: child.updateCount
                                                            });
                                                            handleEditOpen(child);
                                                        }}
                                                        disabled={child.isStudent || child.updateCount >= 5}
                                                        title={
                                                            child.isStudent ? "Cannot edit enrolled student" :
                                                                child.updateCount >= 5 ? "Maximum updates reached" :
                                                                    `${5 - (child.updateCount || 0)} updates remaining`
                                                        }
                                                        sx={{
                                                            color: (child.isStudent || child.updateCount >= 5) ?
                                                                'grey.400' : '#1976d2',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <EditIcon color={"primary"}/>
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{
                                            py: 8,
                                            fontSize: '15px',
                                            color: 'text.secondary',
                                            bgcolor: 'rgba(0, 0, 0, 0.02)'
                                        }}
                                    >
                                        <Typography variant="body1">
                                            No children found. Click "ADD CHILD" to add one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6">
                            {editId ? "Edit Child Information" : "Add New Child"}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <form onSubmit={handleSubmit}>
                    <DialogContent sx={{
                        p: 4,
                        maxWidth: '1200px',
                        mx: 'auto',
                        height: 'calc(100% - 140px)',
                        overflow: 'auto'
                    }}>
                        {/* Basic Information Section */}
                        <Typography variant="h5" sx={{
                            mb: 3,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: '28px',
                            color: 'rgb(51, 62, 77)'
                        }}>
                            Basic Information
                        </Typography>
                        <Stack spacing={3} sx={{mb: 6}}>
                            <TextField
                                label="Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                fullWidth
                                variant="outlined"
                                size="medium"
                                error={Boolean(errors.name)}
                                helperText={errors.name || ''}
                            />
                            <FormControl component="fieldset" required error={Boolean(errors.gender)}>
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={form.gender?.toLowerCase() || ""}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel
                                        value="male"
                                        control={<Radio color="primary"/>}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        value="female"
                                        control={<Radio color="primary"/>}
                                        label="Female"
                                    />
                                </RadioGroup>
                                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                            </FormControl>
                            <TextField
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                                InputLabelProps={{shrink: true}}
                                required
                                fullWidth
                                size="medium"
                                error={Boolean(errors.dateOfBirth)}
                                helperText={errors.dateOfBirth || 'Child must be between 3-5 years old'}
                            />
                            <TextField
                                label="Place of Birth"
                                name="placeOfBirth"
                                value={form.placeOfBirth}
                                onChange={handleChange}
                                required
                                fullWidth
                                size="medium"
                                error={Boolean(errors.placeOfBirth)}
                                helperText={errors.placeOfBirth || ''}
                            />
                        </Stack>

                        <Divider sx={{my: 4}}/>

                        {/* Documents Section */}
                        <Typography variant="h5" sx={{
                            mb: 3,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: '28px',
                            color: 'rgb(51, 62, 77)'
                        }}>
                            Required Documents
                        </Typography>

                        {/* File Upload Section */}
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <UploadBox
                                        label="Upload Profile Image"
                                        hasFile={Boolean(uploadedFiles.profile)}
                                        onUpload={(file) => handleFileUpload(file, 'profile')}
                                    >
                                        <ImagePreview
                                            url={uploadedFiles.profile}
                                            label="Profile Image"
                                            onDelete={() => handleDeleteImage('profileImage')}
                                            onView={() => handleViewImage(uploadedFiles.profile)}
                                        />
                                    </UploadBox>
                                    {errors.profileImage && (
                                        <FormHelperText error>{errors.profileImage}</FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <UploadBox
                                        label="Upload Birth Certificate"
                                        hasFile={Boolean(uploadedFiles.birth)}
                                        onUpload={(file) => handleFileUpload(file, 'birth')}
                                    >
                                        <ImagePreview
                                            url={uploadedFiles.birth}
                                            label="Birth Certificate"
                                            onDelete={() => handleDeleteImage('birthCertificateImg')}
                                            onView={() => handleViewImage(uploadedFiles.birth)}
                                        />
                                    </UploadBox>
                                    {errors.birthCertificate && (
                                        <FormHelperText error>{errors.birthCertificate}</FormHelperText>
                                    )}
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <UploadBox
                                        label="Upload Household Registration"
                                        hasFile={Boolean(uploadedFiles.household)}
                                        onUpload={(file) => handleFileUpload(file, 'household')}
                                    >
                                        <ImagePreview
                                            url={uploadedFiles.household}
                                            label="Household Registration"
                                            onDelete={() => handleDeleteImage('householdRegistrationImg')}
                                            onView={() => handleViewImage(uploadedFiles.household)}
                                        />
                                    </UploadBox>
                                    {errors.householdRegistration && (
                                        <FormHelperText error>{errors.householdRegistration}</FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </Stack>
                    </DialogContent>

                    <Box sx={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        width: '100%',
                        bgcolor: 'background.paper',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        p: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        zIndex: 1,
                    }}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                minWidth: 120,
                                bgcolor: 'rgb(51, 62, 77)',
                                '&:hover': {
                                    bgcolor: 'rgb(41, 52, 67)'
                                }
                            }}
                        >
                            SAVE
                        </Button>
                    </Box>
                </form>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{width: "100%"}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Add View Details Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogContent sx={{ p: 0 }}>
                    {selectedChild && (
                        <Box>
                            <Tabs
                                value={activeTab}
                                onChange={(e, newValue) => setActiveTab(newValue)}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    bgcolor: 'background.paper'
                                }}
                            >
                                <Tab
                                    label="Basic Information"
                                    sx={{
                                        fontWeight: 'bold',
                                        '&.Mui-selected': { color: 'rgb(51, 62, 77)' }
                                    }}
                                />
                                <Tab
                                    label="Documents"
                                    sx={{
                                        fontWeight: 'bold',
                                        '&.Mui-selected': { color: 'rgb(51, 62, 77)' }
                                    }}
                                />
                            </Tabs>

                            <Box sx={{ p: 3 }}>
                                {activeTab === 0 ? (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Name
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                                                                {selectedChild.name}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Gender
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                                                                {selectedChild.gender}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Date of Birth
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                                                                {formatDateForDisplay(selectedChild.dateOfBirth)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Place of Birth
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                                                                {selectedChild.placeOfBirth}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="subtitle2" color="text.secondary">
                                                                Status
                                                            </Typography>
                                                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                                    {`Updates: ${selectedChild.updateCount || 0}/5`}
                                                                </Typography>
                                                                {selectedChild.isStudent && (
                                                                    <Chip
                                                                        label="Enrolled"
                                                                        size="small"
                                                                        color="success"
                                                                        sx={{ ml: 1 }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container spacing={3}>
                                        {selectedChild.profileImage && (
                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: 'grey.50',
                                                        borderRadius: 2,
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Profile Image
                                                    </Typography>
                                                    <Card
                                                        sx={{
                                                            mt: 1,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                opacity: 0.9,
                                                                boxShadow: 3
                                                            }
                                                        }}
                                                        onClick={() => handleImageClick(selectedChild.profileImage)}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={selectedChild.profileImage}
                                                            alt="Profile"
                                                            sx={{
                                                                objectFit: 'cover',
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    </Card>
                                                </Paper>
                                            </Grid>
                                        )}
                                        {selectedChild.birthCertificateImg && (
                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: 'grey.50',
                                                        borderRadius: 2,
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Birth Certificate
                                                    </Typography>
                                                    <Card
                                                        sx={{
                                                            mt: 1,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                opacity: 0.9,
                                                                boxShadow: 3
                                                            }
                                                        }}
                                                        onClick={() => handleImageClick(selectedChild.birthCertificateImg)}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={selectedChild.birthCertificateImg}
                                                            alt="Birth Certificate"
                                                            sx={{
                                                                objectFit: 'cover',
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    </Card>
                                                </Paper>
                                            </Grid>
                                        )}
                                        {selectedChild.householdRegistrationImg && (
                                            <Grid item xs={12} md={4}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        bgcolor: 'grey.50',
                                                        borderRadius: 2,
                                                        height: '100%'
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Household Registration
                                                    </Typography>
                                                    <Card
                                                        sx={{
                                                            mt: 1,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                opacity: 0.9,
                                                                boxShadow: 3
                                                            }
                                                        }}
                                                        onClick={() => handleImageClick(selectedChild.householdRegistrationImg)}
                                                    >
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={selectedChild.householdRegistrationImg}
                                                            alt="Household Registration"
                                                            sx={{
                                                                objectFit: 'cover',
                                                                borderRadius: 1
                                                            }}
                                                        />
                                                    </Card>
                                                </Paper>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Image Zoom Dialog */}
            <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                maxWidth="xl"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        maxHeight: '90vh',
                        m: 2
                    }
                }}
            >
                <DialogTitle sx={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    p: 1
                }}>
                    <Stack direction="row" spacing={1}>
                        <IconButton
                            onClick={() => handleZoom(false)}
                            disabled={imageZoom <= 0.5}
                            sx={{ color: 'white' }}
                        >
                            <ZoomOutIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleZoom(true)}
                            disabled={imageZoom >= 3}
                            sx={{ color: 'white' }}
                        >
                            <ZoomInIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => setSelectedImage(null)}
                            sx={{ color: 'white' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 0,
                    overflow: 'hidden'
                }}>
                    <img
                        src={selectedImage}
                        alt="Zoomed"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            transform: `scale(${imageZoom})`,
                            transition: 'transform 0.3s ease'
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ChildrenList;



