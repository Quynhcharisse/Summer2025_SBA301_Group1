import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    addChild,
    getChildrenList,
    getStudentClassDetailsGroupedByWeek,
    updateChild
} from "../../services/ParentService";
import {
    Alert,
    AppBar,
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import axios from "axios";
import ModalImage from "react-modal-image";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UpdateIcon from '@mui/icons-material/Update';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SchoolIcon from '@mui/icons-material/School';

const ChildrenList = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageZoom, setImageZoom] = useState(1);

    // State for class details dialog
    const [classDetailsDialogOpen, setClassDetailsDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classDetailsTab, setClassDetailsTab] = useState(0);
    const [syllabus, setSyllabus] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loadingSyllabus, setLoadingSyllabus] = useState(false);
    const [loadingActivities, setLoadingActivities] = useState(false);

    // State cho weekly details
    const [weeklyDetails, setWeeklyDetails] = useState([]);
    const [weeklyDialogOpen, setWeeklyDialogOpen] = useState(false);
    const [weeklyLoading, setWeeklyLoading] = useState(false);
    const [weeklyError, setWeeklyError] = useState(null);

    // State cho danh sách lớp và dialog chi tiết lớp
    const [studentClasses, setStudentClasses] = useState([]);
    const [classDetailDialogOpen, setClassDetailDialogOpen] = useState(false);
    const [selectedClassDetail, setSelectedClassDetail] = useState(null);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [errorClasses, setErrorClasses] = useState(null);

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
                return "Invalid Date";
            }
            return date.toLocaleDateString('en-GB');
        } catch (error) {
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
        // Check if child object exists
        if (!child) {
            showSnackbar("Invalid child data", "error");
            return;
        }

        if (child.isStudent) {
            showSnackbar("Cannot edit enrolled student", "error");
            return;
        }

        // Show warning if child has submitted form but allow editing
        if (child.hadForm) {
            showSnackbar("⚠️ WARNING: This child has already submitted an admission form. Changing personal information may affect the admission process and require resubmission of documents. Please ensure all information is accurate before saving.", "warning");
        }

        // Format date properly
        const formattedDate = child.dateOfBirth ? formatDateForInput(child.dateOfBirth) : '';

        // Capitalize gender
        const formattedGender = child.gender
            ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1).toLowerCase()
            : '';

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
        const {name, value} = e.target;

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
                    <ul style={{margin: 0, paddingLeft: 20}}>
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
            // Check if editing a child who has submitted form and show warning
            if (editId) {
                const currentChild = children.find(child => child.id === editId);
                if (currentChild?.hadForm) {
                    const confirmed = window.confirm(
                        "⚠️ WARNING: This child has already submitted an admission application!\n\n" +
                        "Changing the information may:\n" +
                        "• Affect the application review process\n" +
                        "• Require resubmission of supporting documents\n" +
                        "• Delay the admission process\n\n" +
                        "Are you sure you want to save these changes?"
                    );
                    
                    if (!confirmed) {
                        return; // Cancel the submit
                    }
                }
            }

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
            setChildren(childrenData);
        } catch (err) {
            setError(err.message || "Failed to fetch children data");
            setChildren([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    // Khi xem detail của bé, nếu là học sinh thì gọi API lấy danh sách lớp
    const handleViewOpen = async (child) => {
        setSelectedChild(child);
        if (child.isStudent) {
            setLoadingClasses(true);
            setErrorClasses(null);
            try {
                const res = await getStudentClassDetailsGroupedByWeek(child.id);
                if (!res || !res.success) throw new Error(res?.message || "Failed to fetch class details");
                setStudentClasses(res.data || []);
            } catch (err) {
                setErrorClasses(err.message || "Failed to fetch class details");
                setStudentClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        }
        setViewDialogOpen(true);
    };

    const handleClassDetailsOpen = (classItem) => {
        setSelectedClass(classItem);
        setClassDetailsDialogOpen(true);
        setClassDetailsTab(0);
        setSyllabus([]);
        setActivities([]);
    };

    const handleClassDetailsClose = () => {
        setClassDetailsDialogOpen(false);
        setSelectedClass(null);
        setClassDetailsTab(0);
        setSyllabus([]);
        setActivities([]);
        setLoadingSyllabus(false);
        setLoadingActivities(false);
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
    const UploadBox = ({label, hasFile, onUpload, children}) => {
        return (
            <Box>
                {/* Always show upload input */}
                <Box
                    sx={{
                        border: hasFile ? '2px solid #2196f3' : '2px dashed #ccc',
                        borderRadius: 2,
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: 'primary.main',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        },
                        minHeight: hasFile ? 'auto' : '200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: hasFile ? 1 : 0
                    }}
                    component="label"
                >
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => onUpload(e.target.files[0])}
                    />
                    <CloudUploadIcon sx={{fontSize: hasFile ? 24 : 40, color: 'primary.main', mb: 1}}/>
                    <Typography variant={hasFile ? "caption" : "subtitle1"} color="textSecondary">
                        {hasFile ? "Click to change" : label}
                    </Typography>
                </Box>
                {/* Show preview if file exists */}
                {hasFile && children}
            </Box>
        );
    };

    // Add ImagePreview component
    const ImagePreview = ({url, label, onDelete, onView}) => {
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
            <Box sx={{mt: 1}}>
                <Typography variant="subtitle2" color="text.secondary"
                            sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    {label}
                    <Chip
                        label="Current File"
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Typography>
                <Card sx={{maxWidth: 200, mt: 1, position: 'relative'}}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={url}
                        alt={label}
                        sx={{objectFit: "contain"}}
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
                                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.9)'}
                            }}
                        >
                            <VisibilityIcon fontSize="small"/>
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleDeleteClick}
                            sx={{
                                backgroundColor: 'white',
                                '&:hover': {backgroundColor: 'rgba(255, 255, 255, 0.9)'}
                            }}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                </Card>
            </Box>
        );
    };

    // Hàm xử lý xem weekly details
    const handleViewWeeklyDetails = async (studentId) => {
        setWeeklyLoading(true);
        setWeeklyError(null);
        try {
            const res = await getStudentClassDetailsGroupedByWeek(studentId);
            if (!res || !res.success) throw new Error(res?.message || "Failed to fetch weekly details");
            setWeeklyDetails(res.data || []);
            setWeeklyDialogOpen(true);
        } catch (err) {
            setWeeklyError(err.message || "Failed to fetch weekly details");
        } finally {
            setWeeklyLoading(false);
        }
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

    return (
        <Box sx={{p: 3, maxWidth: '1400px', mx: 'auto'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4,
                mt: 2,
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
                        backgroundColor: 'rgb(51, 62, 77)',
                        '&:hover': {
                            backgroundColor: 'rgb(41, 52, 67)'
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
                                backgroundColor: 'rgb(51, 62, 77)',
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
                                <TableCell sx={{color: 'white'}}>Status</TableCell>
                                <TableCell sx={{color: 'white'}}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {children.length > 0 ? (
                                children.map((child) => {
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
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 0.5
                                                }}>
                                                    {child.isStudent ? (
                                                        <Chip label="Enrolled" size="small" color="success"/>
                                                    ) : child.hadForm ? (
                                                        <Chip label="Form Submitted" size="small" color="warning"/>
                                                    ) : (
                                                        <Chip label="Editable" size="small" color="primary"/>
                                                    )}
                                                    <Typography variant="caption" sx={{fontSize: '10px', fontStyle: 'italic'}}>
                                                        {child.isStudent ? (
                                                            "Cannot edit - Student enrolled"
                                                        ) : child.hadForm ? (
                                                            "Form has been submitted - Edit carefully"
                                                        ) : (
                                                            "Form has not submitted- Can edit freely"
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <IconButton
                                                        onClick={() => handleViewOpen(child)}
                                                        sx={{
                                                            color: '#353E4C',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                                            }
                                                        }}
                                                    >
                                                        <VisibilityIcon color={"primary"}/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleEditOpen(child);
                                                        }}
                                                        disabled={child.isStudent}
                                                        title={
                                                            child.isStudent ? "Cannot edit enrolled student" : "Edit child information"
                                                        }
                                                        sx={{
                                                            color: (child.isStudent) ?
                                                                'grey.400' : '#353E4C',
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
                                            backgroundColor: 'rgba(0, 0, 0, 0.02)'
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
                        width: '100vw',
                        overflow: 'auto'
                    }}>
                        {/* Basic Information Section */}
                        <Typography variant="h5" sx={{
                            mb: 3,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            fontWeight: 'bold',
                            fontSize: '28px',
                            color: 'rgb(51, 62, 77)'
                        }}>
                            Basic Information
                        </Typography>
                        
                        {/* Warning alert for children who have submitted forms */}
                        {editId && children.find(child => child.id === editId)?.hadForm && (
                            <Alert 
                                severity="warning" 
                                sx={{ 
                                    mb: 3,
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    '& .MuiAlert-message': {
                                        fontWeight: 600
                                    }
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                    ⚠️ IMPORTANT NOTICE
                                </Typography>
                                <Typography variant="body2">
                                    This child has already submitted an admission form. Any changes to personal information may:
                                    <br />• Affect the current admission application status
                                    <br />• Require resubmission of supporting documents 
                                    <br />• Delay the admission review process
                                    <br /><br />
                                    Please double-check all information before saving changes.
                                </Typography>
                            </Alert>
                        )}
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
                            fontSize: '28px',
                            color: 'rgb(51, 62, 77)'
                        }}>
                            Required Documents
                        </Typography>

                        {/* File Upload Section */}
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
                                {[
                                    {
                                        field: 'profile',
                                        label: 'Profile',
                                        value: form.profileImage,
                                        formKey: 'profileImage'
                                    },
                                    {
                                        field: 'birth',
                                        label: 'Birth Certificate',
                                        value: form.birthCertificateImg,
                                        formKey: 'birthCertificateImg'
                                    },
                                    {
                                        field: 'household',
                                        label: 'Household Registration',
                                        value: form.householdRegistrationImg,
                                        formKey: 'householdRegistrationImg'
                                    }
                                ].map(({field, label, value, formKey}) => (
                                    <Grid item xs={12} sm={4} key={field}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                width: 120,
                                                height: 120,
                                                mx: 'auto',
                                                borderRadius: 3,
                                                boxShadow: 2,
                                                backgroundColor: '#f5f7fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                transition: 'box-shadow 0.2s',
                                                '&:hover': {boxShadow: 4}
                                            }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{display: 'none'}}
                                                id={`${field}-upload`}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    handleFileUpload(file, field);
                                                }}
                                            />
                                            {value ? (
                                                <>
                                                    <ModalImage
                                                        small={value}
                                                        large={value}
                                                        alt={label}
                                                    />
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 6,
                                                            right: 6,
                                                            backgroundColor: 'rgba(255,255,255,0.85)',
                                                        }}
                                                        onClick={() => setForm(prev => ({...prev, [formKey]: ""}))}
                                                    >
                                                        <DeleteIcon fontSize="small"/>
                                                    </IconButton>
                                                    <label htmlFor={`${field}-upload`}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                bottom: 6,
                                                                right: 6,
                                                                backgroundColor: 'rgba(255,255,255,0.85)',
                                                            }}
                                                        >
                                                            <CloudUploadIcon fontSize="small"/>
                                                        </IconButton>
                                                    </label>
                                                </>
                                            ) : (
                                                <label htmlFor={`${field}-upload`}
                                                       style={{width: '100%', height: '100%'}}>
                                                    <Button
                                                        variant="outlined"
                                                        component="span"
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: 3,
                                                            fontWeight: 600,
                                                            fontSize: 14,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                        startIcon={<CloudUploadIcon/>}
                                                    >
                                                        Upload {label}
                                                    </Button>
                                                </label>
                                            )}
                                        </Box>
                                        <Typography align="center" variant="body2" sx={{mt: 1, fontWeight: 500}}>
                                            {label}
                                        </Typography>
                                        {errors[formKey] && (
                                            <FormHelperText error>{errors[formKey]}</FormHelperText>
                                        )}
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </DialogContent>

                    <Box sx={{
                        position: 'fixed',
                        bottom: 0,
                        right: 0,
                        width: '100%',
                        backgroundColor: 'background.paper',
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
                                backgroundColor: 'rgb(51, 62, 77)',
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
                        borderRadius: 4,
                        boxShadow: 8,
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.98)'
                    }
                }}
            >
                <DialogTitle sx={{
                    px: 4, py: 3, bgcolor: 'primary.main', color: 'white', fontWeight: 700, fontSize: 22
                }}>
                    Child Details
                    <IconButton
                        onClick={() => setViewDialogOpen(false)}
                        sx={{position: 'absolute', right: 16, top: 16, color: 'white'}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{p: 4}}>
                    {/* BASIC INFO */}
                    <Typography variant="h6" sx={{mb: 2, color: 'primary.main', fontWeight: 600}}>
                        Basic Information
                    </Typography>
                    {selectedChild && (
                        <Grid container spacing={3} sx={{mb: 4}}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2}
                                       sx={{p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                                    <AccountCircleIcon color="primary" sx={{fontSize: 40}}/>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                        <Typography variant="h6" fontWeight={600}>{selectedChild.name}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2}
                                       sx={{p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                                    <WcIcon color="primary" sx={{fontSize: 40}}/>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                        <Typography variant="h6" fontWeight={600}>{selectedChild.gender}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2}
                                       sx={{p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                                    <CakeIcon color="primary" sx={{fontSize: 40}}/>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Date of
                                            Birth</Typography>
                                        <Typography variant="h6"
                                                    fontWeight={600}>{formatDateForDisplay(selectedChild.dateOfBirth)}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2}
                                       sx={{p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                                    <LocationOnIcon color="primary" sx={{fontSize: 40}}/>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Place of
                                            Birth</Typography>
                                        <Typography variant="h6"
                                                    fontWeight={600}>{selectedChild.placeOfBirth}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={2}
                                       sx={{p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2}}>
                                    <UpdateIcon color="primary" sx={{fontSize: 40}}/>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                        <Typography variant="h6" fontWeight={600}>
                                            {selectedChild.isStudent ? (
                                                <Chip label="Enrolled" size="small" color="success"/>
                                            ) : selectedChild.hadForm ? (
                                                <Chip label="Form Submitted" size="small" color="warning"/>
                                            ) : (
                                                <Chip label="Editable" size="small" color="primary"/>
                                            )}
                                        </Typography>
                                        <Typography variant="caption" sx={{mt: 1, display: 'block', fontStyle: 'italic'}}>
                                            {selectedChild.isStudent ? (
                                                "Cannot edit - Student enrolled"
                                            ) : selectedChild.hadForm ? (
                                                "Form has been submitted - Edit carefully"
                                            ) : (
                                                "Form has not submitted- Can edit freely"
                                            )}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                    <Divider sx={{my: 3}}/>
                    {/* DOCUMENTS */}
                    <Typography variant="h6" sx={{mb: 2, color: 'primary.main', fontWeight: 600}}>
                        Documents
                    </Typography>
                    {selectedChild && (
                        <Grid container spacing={3} sx={{mb: 4}}>
                            {[
                                {key: 'profileImage', label: 'Profile'},
                                {key: 'birthCertificateImg', label: 'Birth Certificate'},
                                {key: 'householdRegistrationImg', label: 'Household Registration'}
                            ].map(({key, label}) => (
                                <Grid item xs={12} sm={4} key={key}>
                                    <Paper elevation={2} sx={{
                                        p: 2, borderRadius: 3, textAlign: 'center', position: 'relative', minHeight: 220
                                    }}>
                                        {selectedChild[key] ? (
                                            <>
                                                <img
                                                    src={selectedChild[key]}
                                                    alt={label}
                                                    style={{
                                                        width: '100%',
                                                        height: 160,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                        boxShadow: '0 2px 8px #0001'
                                                    }}
                                                />
                                                <IconButton
                                                    onClick={() => handleImageClick(selectedChild[key])}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        bgcolor: 'white',
                                                        boxShadow: 1
                                                    }}
                                                >
                                                    <ZoomInIcon/>
                                                </IconButton>
                                            </>
                                        ) : (
                                            <Box sx={{
                                                width: '100%',
                                                height: 160,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'grey.100',
                                                borderRadius: 2,
                                                color: 'grey.400'
                                            }}>
                                                <InsertPhotoIcon sx={{fontSize: 48}}/>
                                            </Box>
                                        )}
                                        <Typography variant="subtitle2" sx={{mt: 2}}>
                                            {label}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    <Divider sx={
                        {my: 3}}/>
                    {/* CLASSES */}
                    {selectedChild && selectedChild.isStudent && (
                        <Box sx={{mt: 3}}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 2}}>
                                <SchoolIcon color="primary" sx={{fontSize: 28}}/>
                                <Typography variant="h6" fontWeight={700}>
                                    Classes
                                </Typography>
                            </Stack>
                            <Grid container spacing={2}>
                                {studentClasses.length === 0 ? (
                                    <Grid item xs={12}>
                                        <Typography color="text.secondary" align="center" sx={{py: 2}}>
                                            No classes assigned yet.
                                        </Typography>
                                    </Grid>
                                ) : (
                                    studentClasses.map((cls) => (
                                        <Grid item xs={12} sm={6} md={4} key={cls.classId}>
                                            <Paper
                                                elevation={4}
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 4,
                                                    transition: '0.2s',
                                                    '&:hover': {boxShadow: 8, background: '#f0f7ff'},
                                                    cursor: 'pointer',
                                                    border: '1.5px solid #e3e3e3',
                                                    minHeight: 120,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                                onClick={() => handleClassDetailsOpen(cls)}
                                            >
                                                <SchoolIcon color="primary" sx={{fontSize: 48, mr: 2}}/>
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={700}>
                                                        {cls.className}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Grade: {cls.grade}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Room: {cls.room}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
                            sx={{color: 'white'}}
                        >
                            <ZoomOutIcon/>
                        </IconButton>
                        <IconButton
                            onClick={() => handleZoom(true)}
                            disabled={imageZoom >= 3}
                            sx={{color: 'white'}}
                        >
                            <ZoomInIcon/>
                        </IconButton>
                        <IconButton
                            onClick={() => setSelectedImage(null)}
                            sx={{color: 'white'}}
                        >
                            <CloseIcon/>
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

            {/* Class Details Dialog */}
            <Dialog
                open={classDetailsDialogOpen}
                onClose={handleClassDetailsClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <IconButton onClick={handleClassDetailsClose} sx={{position: 'absolute', right: 16, top: 16}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedClass ? (
                        <Box>
                            {/* Thông tin cơ bản */}
                            <Typography variant="h4" fontWeight={700} sx={{mb: 2, color: 'primary.main'}}>
                                {selectedClass.className}
                            </Typography>
                            <Stack direction="row" spacing={3} sx={{mb: 2}}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    <b>Grade:</b> {selectedClass.grade}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    <b>Room:</b> {selectedClass.room}
                                </Typography>
                            </Stack>
                            {selectedClass.syllabus && (
                                <Paper sx={{p: 2, mb: 3, bgcolor: '#f5faff', borderLeft: '6px solid #1976d2'}}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{mb: 1}}>
                                        Syllabus: {selectedClass.syllabus.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{whiteSpace: 'pre-line'}}>
                                        {selectedClass.syllabus.description}
                                    </Typography>
                                </Paper>
                            )}
                            {/* Weekly Schedules */}
                            <Typography variant="h6" sx={{mt: 2, mb: 1}}>Weekly Schedules</Typography>
                            {selectedClass.schedules && selectedClass.schedules.length > 0 ? (
                                selectedClass.schedules.map((week, idx) => {
                                    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
                                    const allTimes = Array.from(
                                        new Set(
                                            week.activities.map(a => `${a.startTime} - ${a.endTime}`)
                                        )
                                    );
                                    return (
                                        <Box key={idx} sx={{mb: 3}}>
                                            <Typography variant="subtitle1" fontWeight={600}
                                                        sx={{mb: 1, color: '#1976d2'}}>
                                                Week {week.weekNumber} ({week.startDate} - {week.endDate})
                                            </Typography>
                                            <TableContainer component={Paper} sx={{
                                                mb: 1,
                                                bgcolor: '#fffde7',
                                                borderRadius: 2,
                                                boxShadow: 2
                                            }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{bgcolor: '#ffe082'}}>
                                                            <TableCell sx={{fontWeight: 700}}>Time</TableCell>
                                                            {daysOfWeek.map(day => (
                                                                <TableCell key={day} align="center"
                                                                           sx={{fontWeight: 700}}>{day}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allTimes.map(time => (
                                                            <TableRow key={time}>
                                                                <TableCell sx={{
                                                                    fontWeight: 600,
                                                                    bgcolor: '#fffde7'
                                                                }}>{time}</TableCell>
                                                                {daysOfWeek.map(day => (
                                                                    <TableCell key={day} align="center"
                                                                               sx={{p: 0.5, bgcolor: '#e3f2fd'}}>
                                                                        {week.activities
                                                                            .filter(a => `${a.startTime} - ${a.endTime}` === time && a.dayOfWeek === day)
                                                                            .map((a, i) => (
                                                                                <Paper key={i} sx={{
                                                                                    p: 1,
                                                                                    mb: 0.5,
                                                                                    bgcolor: '#b2dfdb',
                                                                                    borderRadius: 2,
                                                                                    boxShadow: 1,
                                                                                    borderLeft: '6px solid #1976d2'
                                                                                }}>
                                                                                    <Typography variant="body2"
                                                                                                fontWeight={600}
                                                                                                color="#00695c">{a.topic}</Typography>
                                                                                    <Typography variant="caption"
                                                                                                color="text.secondary">{a.description}</Typography>
                                                                                </Paper>
                                                                            ))}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            {/* Danh sách lesson của tuần */}
                                            <Typography variant="subtitle2" sx={{mt: 1}}>Lessons this week:</Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {week.lessons && week.lessons.map((lesson, i) => (
                                                    <Chip key={i} label={lesson.topic} variant="outlined"
                                                          sx={{mb: 1, bgcolor: '#fffde7', fontWeight: 600}}/>
                                                ))}
                                            </Stack>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography color="text.secondary">No weekly schedules available.</Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography color="text.secondary">No class selected.</Typography>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog hiển thị weekly details */}
            <Dialog
                open={weeklyDialogOpen}
                onClose={() => setWeeklyDialogOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    Weekly Class Details
                    <IconButton
                        onClick={() => setWeeklyDialogOpen(false)}
                        sx={{position: 'absolute', right: 16, top: 16}}
                    >
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {weeklyLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress/>
                        </Box>
                    ) : weeklyError ? (
                        <Alert severity="error">{weeklyError}</Alert>
                    ) : (
                        weeklyDetails && weeklyDetails.length > 0 ? (
                            weeklyDetails.map((classDetail, idx) => (
                                <Box key={idx} sx={{mb: 4}}>
                                    <Typography variant="h6" sx={{mb: 2}}>
                                        {classDetail.className} (Grade: {classDetail.grade}, Room: {classDetail.room})
                                    </Typography>
                                    {classDetail.schedules.map((week, widx) => (
                                        <Paper key={widx} sx={{mb: 2, p: 2}}>
                                            <Typography variant="subtitle1">
                                                Week {week.weekNumber}: {week.startDate} - {week.endDate}
                                            </Typography>
                                            <Typography variant="body2"
                                                        sx={{mt: 1, fontWeight: 600}}>Lessons:</Typography>
                                            <ul>
                                                {week.lessons && week.lessons.map((lesson, lidx) => (
                                                    <li key={lidx}>
                                                        <b>{lesson.topic}</b>: {lesson.description}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Typography variant="body2"
                                                        sx={{mt: 1, fontWeight: 600}}>Activities:</Typography>
                                            <ul>
                                                {week.activities && week.activities.map((act, aidx) => (
                                                    <li key={aidx}>
                                                        <b>{act.type === "lesson" ? "Lesson" : "Extra"}:</b> {act.topic} ({act.dayOfWeek}, {act.startTime} - {act.endTime})<br/>
                                                        {act.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Paper>
                                    ))}
                                </Box>
                            ))
                        ) : (
                            <Typography>No weekly details available.</Typography>
                        )
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog hiển thị thông tin chi tiết lớp */}
            <Dialog
                open={classDetailDialogOpen}
                onClose={() => setClassDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Class Detail
                    <IconButton onClick={() => setClassDetailDialogOpen(false)}
                                sx={{position: 'absolute', right: 16, top: 16}}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {selectedClassDetail && (
                        <Box>
                            {/* Thông tin cơ bản */}
                            <Typography variant="h5" fontWeight={700} sx={{mb: 2}}>
                                {selectedClassDetail.className}
                            </Typography>
                            <Stack direction="row" spacing={3} sx={{mb: 2}}>
                                <Typography variant="body1"><b>Grade:</b> {selectedClassDetail.grade}</Typography>
                                <Typography variant="body1"><b>Room:</b> {selectedClassDetail.room}</Typography>
                            </Stack>
                            {/* Syllabus */}
                            {selectedClassDetail.syllabus && (
                                <Paper sx={{p: 2, mb: 3, background: '#f5f7fa'}}>
                                    <Typography variant="subtitle1"
                                                fontWeight={600}>Syllabus: {selectedClassDetail.syllabus.title}</Typography>
                                    <Typography variant="body2"
                                                color="text.secondary">{selectedClassDetail.syllabus.description}</Typography>
                                </Paper>
                            )}
                            {/* Schedules (theo tuần) */}
                            <Typography variant="h6" sx={{mb: 1}}>Weekly Schedules</Typography>
                            {selectedClassDetail.schedules && selectedClassDetail.schedules.length > 0 ? (
                                selectedClassDetail.schedules.map((week, idx) => {
                                    // Lấy tất cả các ngày có trong tuần này
                                    const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
                                    // Lấy tất cả các khung giờ unique trong tuần này
                                    const allTimes = Array.from(
                                        new Set(
                                            week.activities.map(a => `${a.startTime} - ${a.endTime}`)
                                        )
                                    );

                                    return (
                                        <Paper key={idx} sx={{
                                            mb: 3,
                                            p: 2,
                                            borderLeft: '4px solid #1976d2',
                                            background: '#f8fafc'
                                        }}>
                                            <Typography variant="subtitle1" fontWeight={600} sx={{mb: 1}}>
                                                Week {week.weekNumber}: {week.startDate} - {week.endDate}
                                            </Typography>
                                            <Table size="small"
                                                   sx={{mb: 2, background: 'white', borderRadius: 2, boxShadow: 1}}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{
                                                            fontWeight: 700,
                                                            background: '#e3eafc'
                                                        }}>Time</TableCell>
                                                        {daysOfWeek.map(day => (
                                                            <TableCell key={day} align="center"
                                                                       sx={{fontWeight: 700, background: '#e3eafc'}}>
                                                                {day.charAt(0) + day.slice(1).toLowerCase()}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {allTimes.map(time => (
                                                        <TableRow key={time}>
                                                            <TableCell sx={{fontWeight: 600}}>{time}</TableCell>
                                                            {daysOfWeek.map(day => (
                                                                <TableCell key={day} align="center">
                                                                    {week.activities
                                                                        .filter(a => `${a.startTime} - ${a.endTime}` === time && a.dayOfWeek === day)
                                                                        .map((a, i) => (
                                                                            <Box
                                                                                key={i}
                                                                                sx={{
                                                                                    mb: 0.5,
                                                                                    p: 1,
                                                                                    borderRadius: 2,
                                                                                    background: a.type === 'lesson' ? '#e3f2fd' : '#fff3e0',
                                                                                    color: '#222',
                                                                                    fontSize: 13,
                                                                                    boxShadow: 1,
                                                                                }}
                                                                            >
                                                                                <b>{a.topic}</b>
                                                                                <Typography variant="caption"
                                                                                            display="block"
                                                                                            color="text.secondary">
                                                                                    {a.description}
                                                                                </Typography>
                                                                            </Box>
                                                                        ))}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            {/* Lessons summary dưới bảng */}
                                            <Typography variant="body2" fontWeight={600} sx={{mt: 1}}>Lessons this
                                                week:</Typography>
                                            <ul>
                                                {week.lessons && week.lessons.map((lesson, lidx) => (
                                                    <li key={lidx}>
                                                        <b>{lesson.topic}</b>: {lesson.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Paper>
                                    );
                                })
                            ) : (
                                <Typography>No schedules available.</Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ChildrenList;



