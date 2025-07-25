import {
    Alert,
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Toolbar,
    Typography,
    CircularProgress
} from "@mui/material";
import {Add, Close, CloudUpload, Info, Refresh, Edit} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {cancelAdmission, getFormInformation, refillForm, submittedForm} from "../../services/ParentService.jsx";
import dayjs from "dayjs";
import {enqueueSnackbar} from "notistack";
import axios from "axios";
import '../../styles/Parent/Form.css'


function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm, openRefillForm, refreshData}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [refillConfirmDialog, setRefillConfirmDialog] = useState(false);
    const [selectedRefillForm, setSelectedRefillForm] = useState(null);
    const [isResubmitting, setIsResubmitting] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (form) => {
        HandleSelectedForm(form)
        openDetailPopUpFunc();
    }

    const handleRefillClick = (form) => {
        setSelectedRefillForm(form);
        setRefillConfirmDialog(true);
    }

    const handleDirectResubmit = async () => {
        setIsResubmitting(true);
        try {
            const response = await refillForm(
                selectedRefillForm.studentId,
                selectedRefillForm.id,
                selectedRefillForm.householdRegistrationAddress,
                selectedRefillForm.childCharacteristicsFormImg,
                selectedRefillForm.commitmentImg,
                selectedRefillForm.note || ''
            );
            
            if (response && response.success) {
                enqueueSnackbar("Form resubmitted successfully", {variant: 'success'});
                refreshData(); // Refresh data to update the table
            } else {
                enqueueSnackbar(response.message || "Failed to resubmit form", {variant: "error"});
            }
        } catch (error) {
            enqueueSnackbar("Error resubmitting form", {variant: "error"});
        } finally {
            setIsResubmitting(false);
            setRefillConfirmDialog(false);
        }
    }

    const handleEditThenResubmit = () => {
        setRefillConfirmDialog(false);
        openRefillForm(selectedRefillForm);
    }

    // Helper function to format status text
    const formatStatus = (status) => {
        return status.toLowerCase().replace(/_/g, ' ');
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'green';
            case 'rejected':
            case 'cancelled':
                return 'red';
            case 'pending_approval':
                return '#052c65';
            default:
                return 'black';
        }
    };

    return (
        <>
        <Paper sx={{
            width: '100%',
            height: 500,
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgb(254, 254, 253)'
        }}>
            <TableContainer sx={{height: 500}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>No</TableCell>
                            <TableCell align={"center"}>Child Name</TableCell>
                            <TableCell align={"center"}>Submit Date</TableCell>
                            <TableCell align={"center"}>Cancel Reason</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            <TableCell align={"center"}>Note</TableCell>
                            <TableCell align={"center"}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {Array.isArray(forms) && forms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No forms found
                                </TableCell>
                            </TableRow>
                        ) : (
                            forms?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((form, index) => (
                                <TableRow key={form.id}>
                                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell align="center">{form.studentName}</TableCell>
                                    <TableCell align="center">{form.submittedDate}</TableCell>
                                    <TableCell align="center">{form.cancelReason || "N/A"}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            color: getStatusColor(form.status),
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {formatStatus(form.status)}
                                    </TableCell>
                                    <TableCell align="center">{form.note || "N/A"}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton color="primary" onClick={() => handleDetailClick(form)}>
                                                <Info sx={{color: '#2c3e50'}}/>
                                            </IconButton>
                                            {(form.status === 'CANCELLED' || form.status === 'REJECTED') && (
                                                <IconButton
                                                        onClick={() => handleRefillClick(form)}
                                                    sx={{
                                                        color: '#e67e22',
                                                        '&:hover': {
                                                            color: '#d35400'
                                                        }
                                                    }}
                                                >
                                                    <Refresh/>
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={Array.isArray(forms) ? forms.length : 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
            
            {/* Refill Confirmation Dialog */}
            <Dialog 
                open={refillConfirmDialog} 
                onClose={() => setRefillConfirmDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
                        overflow: 'hidden'
                    }
                }}
            >
                <Box sx={{ 
                    bgcolor: '#d32f2f',
                    p: 3,
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        ⚠️ IMPORTANT NOTICE - ADMISSION FORM RESUBMISSION
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Please read carefully before proceeding
                    </Typography>
                </Box>

                <DialogContent sx={{ p: 4 }}>
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            '& .MuiAlert-icon': { fontSize: 24 },
                            '& .MuiAlert-message': { fontSize: '16px' }
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                            FORM REJECTION NOTICE
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            The admission form for <strong>{selectedRefillForm?.studentName}</strong> has been <strong>REJECTED</strong> by the admission committee.
                        </Typography>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            You must choose ONE of the following options to proceed with resubmission.
                        </Typography>
                    </Alert>

                    <Alert 
                        severity="warning" 
                        sx={{ 
                            mb: 4,
                            borderRadius: 2,
                            '& .MuiAlert-icon': { fontSize: 24 }
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                            CRITICAL REMINDER:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • This is your opportunity to correct any issues that led to the rejection
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • Resubmitting identical information may result in another rejection
                        </Typography>
                        <Typography variant="body2">
                            • Consider carefully whether any information needs to be updated before resubmitting
                        </Typography>
                    </Alert>

                    <Typography variant="h6" sx={{ mb: 3, color: '#d32f2f', fontWeight: 700, textAlign: 'center' }}>
                        SELECT YOUR RESUBMISSION METHOD:
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Paper 
                                elevation={2}
                                sx={{ 
                                    p: 3,
                                    border: '2px solid #2196f3',
                                    borderRadius: 2,
                                    backgroundColor: '#f8f9fa'
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2', textAlign: 'center' }}>
                                    OPTION 1: RESUBMIT AS IS
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                                    What this means:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Submit the exact same information without any modifications
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • All documents and data remain unchanged
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    • Fastest option - immediate resubmission
                                </Typography>
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        WARNING: Use this option only if you believe the rejection was due to administrative reasons, not data issues.
                                    </Typography>
                                </Alert>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper 
                                elevation={2}
                                sx={{ 
                                    p: 3,
                                    border: '2px solid #ff9800',
                                    borderRadius: 2,
                                    backgroundColor: '#fff8f0'
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f57c00', textAlign: 'center' }}>
                                    OPTION 2: EDIT THEN RESUBMIT
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                                    What this means:
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Review and modify your application information
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    • Update documents if necessary
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    • Address potential issues that caused rejection
                                </Typography>
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        RECOMMENDED: Choose this option if you suspect there were errors or incomplete information in your original submission.
                                    </Typography>
                                </Alert>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
                            FINAL WARNING:
                        </Typography>
                        <Typography variant="body2">
                            By proceeding with resubmission, you acknowledge that this is your second attempt. Subsequent rejections may impact your eligibility for this admission term. Please ensure all information is accurate and complete.
                        </Typography>
                    </Alert>
                </DialogContent>

                <Box sx={{ 
                    bgcolor: '#f5f5f5',
                    p: 4,
                    borderTop: '3px solid #d32f2f'
                }}>
                    <Typography variant="body1" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#d32f2f' }}>
                        PROCEED WITH CAUTION - YOUR DECISION CANNOT BE UNDONE
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                        <Button 
                            onClick={() => setRefillConfirmDialog(false)} 
                            variant="outlined"
                            color="inherit"
                            disabled={isResubmitting}
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                minWidth: 120
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleEditThenResubmit}
                            variant="contained"
                            color="warning"
                            disabled={isResubmitting}
                            startIcon={<Edit />}
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                minWidth: 200
                            }}
                        >
                            Edit Then Resubmit
                        </Button>
                        <Button 
                            onClick={handleDirectResubmit}
                            variant="contained"
                            color="error"
                            disabled={isResubmitting}
                            startIcon={isResubmitting ? <CircularProgress size={18} color="inherit" /> : <Refresh />}
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                minWidth: 200,
                                bgcolor: '#d32f2f',
                                '&:hover': {
                                    bgcolor: '#b71c1c'
                                }
                            }}
                        >
                            {isResubmitting ? 'Processing...' : 'Resubmit As Is'}
                        </Button>
                    </Box>
                    
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, fontStyle: 'italic', color: '#666' }}>
                        * By clicking any option above, you confirm that you have read and understood all warnings and consequences.
                    </Typography>
                </Box>
            </Dialog>
        </>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedForm}) {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const handleOpenConfirm = () => setOpenConfirm(true);
    const handleCloseConfirm = () => setOpenConfirm(false);

    async function HandleCancel() {
        setIsCancelling(true);
        try {
            const response = await cancelAdmission(selectedForm.id)
            if (response && response.success) {
                enqueueSnackbar("Form cancelled successfully", {variant: "success"});
                handleClosePopUp()
            } else {
                enqueueSnackbar(response.message || "Failed to cancel admission form", {variant: "error"});
            }
        } catch (error) {
            enqueueSnackbar("Error cancelling form", {variant: "error"});
        } finally {
            setIsCancelling(false);
            setOpenConfirm(false);
        }
    }

    // Helper function to check if form can be cancelled
    const canCancel = () => {
        const status = selectedForm.status.toLowerCase();
        return status !== 'cancelled' && status !== 'approved' && status !== 'rejected';
    };

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                onClick={handleClosePopUp}
                                aria-label="close">
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Admission Form Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center"}}
                >
                    Form Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField fullWidth label='Child name' disabled value={selectedForm.studentName || ''}/>
                    </Stack>
                    <Stack>
                        <FormControl>
                            <FormLabel sx={{color: 'black'}} disabled>Gender</FormLabel>
                            <RadioGroup row value={selectedForm.studentGender?.toLowerCase() || ''}>
                                <FormControlLabel value="female" control={<Radio/>} label="Female"
                                                  sx={{color: 'black'}} disabled/>
                                <FormControlLabel value="male" control={<Radio/>} label="Male"
                                                  sx={{color: 'black'}} disabled/>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                    <Stack>
                        <DatePicker label='Date of birth' disabled
                                    defaultValue={selectedForm.studentDateOfBirth ? dayjs(selectedForm.studentDateOfBirth.toString()) : null}
                        />
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Place of birth'} disabled
                                   value={selectedForm.studentPlaceOfBirth || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Household registration address'} disabled
                                   value={selectedForm.householdRegistrationAddress || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Note'} disabled value={selectedForm.note || ''}/>
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Cancel reason'} disabled value={selectedForm.cancelReason || ''}/>
                    </Stack>

                    <Typography variant="subtitle1" sx={{mt: 5, mb: 2, fontWeight: 'bold'}}>Uploaded
                        Documents</Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                        {[
                            {label: "Profile Image", src: selectedForm.profileImage},
                            {label: "Household Registration", src: selectedForm.householdRegistrationImg},
                            {label: "Birth Certificate", src: selectedForm.birthCertificateImg},
                            {label: "Child Characteristics Form", src: selectedForm.childCharacteristicsFormImg},
                            {label: "Commitment", src: selectedForm.commitmentImg}
                        ].filter(item => item.src).map((item, idx) => (
                            <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}
                                    onClick={() => {
                                        setSelectedImage(item.src);
                                        setOpenImage(true);
                                    }}
                                />
                            </Paper>
                        ))}
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    <Stack
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                            marginTop: '2vh'
                        }}
                    >
                        <Button
                            sx={{width: '10%', height: '5vh'}}
                            variant="contained"
                            color="warning"
                            onClick={handleClosePopUp}
                        >
                            Close
                        </Button>

                        {canCancel() && (
                            <Button
                                sx={{width: '10%', height: '5vh'}}
                                variant="contained"
                                color="error"
                                onClick={handleOpenConfirm}
                                disabled={isCancelling}
                            >
                                {isCancelling ? 'Cancelling...' : 'Cancel Form'}
                            </Button>
                        )}

                        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                            <DialogTitle>Cancel Admission Form</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    ⚠️ Are you sure you want to cancel this admission form?
                                    <br/>
                                    This action <strong>cannot be undone</strong> and the child may lose their
                                    enrollment opportunity for this term.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button 
                                    onClick={handleCloseConfirm} 
                                    color="inherit"
                                    disabled={isCancelling}
                                >
                                    Disagree
                                </Button>
                                <Button 
                                    onClick={HandleCancel} 
                                    color="error" 
                                    autoFocus
                                    disabled={isCancelling}
                                    startIcon={isCancelling ? <CircularProgress size={16} color="inherit" /> : null}
                                >
                                    {isCancelling ? 'Cancelling...' : 'Agree'}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Stack>
            </Box>

            <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="md">
                <img src={selectedImage} style={{width: '100%'}} alt="Zoom"/>
            </Dialog>
        </Dialog>
    )
}

function RenderFormPopUp({
                             handleClosePopUp,
                             isPopUpOpen,
                             studentList,
                             selectedForm,
                             GetForm,
                             isRefill = false,
                             formId,
                             setIsFormSubmitting
                         }) {
    // Nếu là refill, lấy id học sinh từ selectedForm
    const [selectedStudentId, setSelectedStudentId] = useState(
        isRefill && selectedForm ? selectedForm.studentId : (studentList?.[0]?.id || '')
    );
    const selectedStudent = studentList?.find(child => child.id === selectedStudentId);

    // Thêm state để lưu thông tin refill cũ (nếu có)
    const [input, setInput] = useState({
        address: '',
        note: ''
    });

    const [uploadedFile, setUploadedFile] = useState({
        childCharacteristics: null, // file object mới
        commitment: null, // file object mới
        childCharacteristicsUrl: '', // url cũ
        commitmentUrl: '' // url cũ
    });

    const [isSubmit, setIsSubmit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Khi mở popup refill, tự động điền lại dữ liệu cũ
    useEffect(() => {
        if (isRefill && selectedForm && selectedStudent) {
            setInput({
                address: selectedForm.householdRegistrationAddress || '',
                note: selectedForm.note || ''
            });
            setUploadedFile(prev => ({
                ...prev,
                childCharacteristicsUrl: selectedForm.childCharacteristicsFormImg || '',
                commitmentUrl: selectedForm.commitmentImg || ''
            }));
        }
        // eslint-disable-next-line
    }, [isRefill, selectedStudentId, selectedForm]);

    async function HandleSubmit() {
        setIsSubmit(true);
        setIsLoading(true);
        setIsFormSubmitting && setIsFormSubmitting(true);

        if (!input.address.trim()) {
            enqueueSnackbar("Please enter household registration address", {variant: "error"});
            setIsLoading(false);
            setIsFormSubmitting && setIsFormSubmitting(false);
            return;
        }

        // Validate file: nếu không có file mới và không có url cũ thì báo lỗi
        if (!uploadedFile.childCharacteristics && !uploadedFile.childCharacteristicsUrl) {
            enqueueSnackbar("Please upload child characteristics form", {variant: "error"});
            setIsLoading(false);
            setIsFormSubmitting && setIsFormSubmitting(false);
            return;
        }
        if (!uploadedFile.commitment && !uploadedFile.commitmentUrl) {
            enqueueSnackbar("Please upload commitment form", {variant: "error"});
            setIsLoading(false);
            setIsFormSubmitting && setIsFormSubmitting(false);
            return;
        }

        let childCharacteristicsUrl = uploadedFile.childCharacteristicsUrl;
        let commitmentUrl = uploadedFile.commitmentUrl;

        try {
            // Nếu có file mới thì upload lên Cloudinary
            if (uploadedFile.childCharacteristics) {
                const formData = new FormData();
                formData.append("file", uploadedFile.childCharacteristics);
                formData.append("upload_preset", "pes_swd");
                formData.append("api_key", "837117616828593");
                const res = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
                if (res.status === 200) childCharacteristicsUrl = res.data.url;
            }
            if (uploadedFile.commitment) {
                const formData = new FormData();
                formData.append("file", uploadedFile.commitment);
                formData.append("upload_preset", "pes_swd");
                formData.append("api_key", "837117616828593");
                const res = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
                if (res.status === 200) commitmentUrl = res.data.url;
            }

            if (isRefill) {
                // Gọi API refillForm với url file mới hoặc cũ
                const response = await refillForm(
                    selectedStudentId,
                    formId,
                    input.address,
                    childCharacteristicsUrl,
                    commitmentUrl,
                    input.note || ''
                );
                setIsLoading(false);
                if (response && response.success) {
                    enqueueSnackbar("Form refilled successfully", {variant: 'success'});
                    GetForm();
                    handleClosePopUp();
                } else {
                    enqueueSnackbar(response.message || "Failed to refill form", {variant: "error"});
                }
            } else {
                const requestData = {
                    studentId: selectedStudentId,
                    householdRegistrationAddress: input.address,
                    childCharacteristicsFormImg: childCharacteristicsUrl,
                    commitmentImg: commitmentUrl,
                    note: input.note || ''
                };

                const response = await submittedForm(requestData);
                if (response && response.success) {
                    enqueueSnackbar(response.message, {variant: 'success'});
                    GetForm();
                    handleClosePopUp();
                } else {
                    enqueueSnackbar(response.message || "Submission failed", {variant: "error"});
                }
            }
        } catch (error) {
            enqueueSnackbar("Error uploading files", {variant: "error"});
        } finally {
            setIsLoading(false);
            setIsFormSubmitting && setIsFormSubmitting(false);
        }
    }

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative', bgcolor: '#2c3e50'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close"
                    >
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6">
                        {isRefill ? "Refill Admission Form" : "Create Admission Form"}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{p: 4, maxWidth: '1200px', mx: 'auto'}}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 5,
                        color: '#2c3e50',
                        textAlign: 'center',
                        fontWeight: 600,
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 100,
                            height: 3,
                            bgcolor: '#2c3e50'
                        }
                    }}
                >
                    Form Information
                </Typography>

                <Box sx={{mb: 4}}>
                    <FormControl fullWidth>
                        <InputLabel>Child Name</InputLabel>
                        <Select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            label="Child Name"
                            sx={{
                                bgcolor: '#fff',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.12)'
                                }
                            }}
                        >
                            {studentList?.filter(student => !student.hadForm).map((student) => (
                                <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography
                        color="error"
                        variant="caption"
                        sx={{
                            display: 'block',
                            mt: 1,
                            fontStyle: 'italic'
                        }}
                    >
                        * Only children with age from 3 to 5 can be submitted for admission preschool
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        bgcolor: '#f8f9fa',
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: '#2c3e50',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        Student Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={selectedStudent?.name || ''}
                                disabled
                                sx={{bgcolor: '#fff'}}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Gender"
                                value={selectedStudent?.gender || ''}
                                disabled
                                sx={{bgcolor: '#fff'}}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                value={selectedStudent?.dateOfBirth || ''}
                                disabled
                                sx={{bgcolor: '#fff'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Place of Birth"
                                value={selectedStudent?.placeOfBirth || ''}
                                disabled
                                sx={{bgcolor: '#fff'}}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: '#2c3e50',
                            fontWeight: 600
                        }}
                    >
                        Student Documents
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{textAlign: 'center'}}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        mb: 2,
                                        fontWeight: 500,
                                        color: '#2c3e50'
                                    }}
                                >
                                    Profile Image
                                </Typography>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    {selectedStudent?.profileImage ? (
                                        <img
                                            src={selectedStudent.profileImage}
                                            alt="Profile"
                                            style={{
                                                maxHeight: '100%',
                                                maxWidth: '100%',
                                                objectFit: 'contain',
                                                borderRadius: 8
                                            }}
                                        />
                                    ) : (
                                        <Typography color="textSecondary">No image</Typography>
                                    )}
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{textAlign: 'center'}}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        mb: 2,
                                        fontWeight: 500,
                                        color: '#2c3e50'
                                    }}
                                >
                                    Birth Certificate
                                </Typography>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    {selectedStudent?.birthCertificateImg ? (
                                        <img
                                            src={selectedStudent.birthCertificateImg}
                                            alt="Birth Certificate"
                                            style={{
                                                maxHeight: '100%',
                                                maxWidth: '100%',
                                                objectFit: 'contain',
                                                borderRadius: 8
                                            }}
                                        />
                                    ) : (
                                        <Typography color="textSecondary">No image</Typography>
                                    )}
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{textAlign: 'center'}}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        mb: 2,
                                        fontWeight: 500,
                                        color: '#2c3e50'
                                    }}
                                >
                                    Household Registration
                                </Typography>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: '#fff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    {selectedStudent?.householdRegistrationImg ? (
                                        <img
                                            src={selectedStudent.householdRegistrationImg}
                                            alt="Household Registration"
                                            style={{
                                                maxHeight: '100%',
                                                maxWidth: '100%',
                                                objectFit: 'contain',
                                                borderRadius: 8
                                            }}
                                        />
                                    ) : (
                                        <Typography color="textSecondary">No image</Typography>
                                    )}
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>

                    <Alert
                        severity="info"
                        sx={{
                            mt: 3,
                            bgcolor: 'rgba(30, 136, 229, 0.1)',
                            '& .MuiAlert-icon': {
                                color: 'rgb(30, 136, 229)'
                            }
                        }}
                    >
                        Please verify that all student information is correct before submitting the form. If any
                        information needs to be
                        updated, please contact the school administrator.
                    </Alert>
                </Paper>

                <TextField
                    fullWidth
                    required
                    label="Household Registration Address"
                    value={input.address}
                    onChange={(e) => setInput({...input, address: e.target.value})}
                    error={isSubmit && !input.address.trim()}
                    helperText={isSubmit && !input.address.trim() ? "This field is required" : ""}
                    sx={{
                        mb: 3,
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-root': {'&.Mui-focused fieldset': {borderColor: '#2c3e50'}}
                    }}
                />

                <TextField
                    fullWidth
                    label="Note"
                    value={input.note}
                    onChange={(e) => setInput({...input, note: e.target.value})}
                    multiline
                    rows={4}
                    sx={{
                        mb: 4,
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-root': {'&.Mui-focused fieldset': {borderColor: '#2c3e50'}}
                    }}
                />

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: '#2c3e50',
                            fontWeight: 600
                        }}
                    >
                        Upload Documents
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 1,
                                    fontWeight: 500,
                                    color: '#2c3e50'
                                }}
                            >
                                Child Characteristics Form
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUpload/>}
                                fullWidth
                                sx={{
                                    height: '56px',
                                    borderColor: '#2c3e50',
                                    color: '#2c3e50',
                                    '&:hover': {borderColor: '#2c3e50', bgcolor: 'rgba(44, 62, 80, 0.04)'}
                                }}
                            >
                                {uploadedFile.childCharacteristics ? uploadedFile.childCharacteristics.name : (uploadedFile.childCharacteristicsUrl ? 'Current file' : 'UPLOAD NEW')}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setUploadedFile({
                                        ...uploadedFile,
                                        childCharacteristics: e.target.files[0]
                                    })}
                                />
                            </Button>
                            {/* Hiển thị preview file cũ nếu có và chưa upload file mới */}
                            {uploadedFile.childCharacteristicsUrl && !uploadedFile.childCharacteristics && (
                                <Box sx={{mt: 1, textAlign: 'center'}}>
                                    <img src={uploadedFile.childCharacteristicsUrl} alt="Current"
                                         style={{maxWidth: 120, borderRadius: 6}}/>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 500, color: '#2c3e50'}}>
                                Commitment
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUpload/>}
                                fullWidth
                                sx={{
                                    height: '56px',
                                    borderColor: '#2c3e50',
                                    color: '#2c3e50',
                                    '&:hover': {borderColor: '#2c3e50', bgcolor: 'rgba(44, 62, 80, 0.04)'}
                                }}
                            >
                                {uploadedFile.commitment ? uploadedFile.commitment.name : (uploadedFile.commitmentUrl ? 'Current file' : 'UPLOAD NEW')}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setUploadedFile({
                                        ...uploadedFile,
                                        commitment: e.target.files[0]
                                    })}
                                />
                            </Button>
                            {uploadedFile.commitmentUrl && !uploadedFile.commitment && (
                                <Box sx={{mt: 1, textAlign: 'center'}}>
                                    <img src={uploadedFile.commitmentUrl} alt="Current"
                                         style={{maxWidth: 120, borderRadius: 6}}/>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Paper>

                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2}}>
                    <Button
                        variant="outlined"
                        onClick={handleClosePopUp}
                        sx={{
                            px: 4,
                            borderColor: '#e67e22',
                            color: '#e67e22',
                            '&:hover': {borderColor: '#d35400', bgcolor: 'rgba(230, 126, 34, 0.04)'}
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        variant="contained"
                        onClick={HandleSubmit}
                        sx={{px: 4, bgcolor: '#2c3e50', '&:hover': {bgcolor: '#1a252f'}}}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isLoading ? "SUBMITTING..." : "SUBMIT"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, forms, HandleSelectedForm, studentList, openRefillForm, isFormSubmitting, refreshData}) {
    return (
        <div className="container">
            {/*1.tiêu đề */}
            <Typography variant={'caption'} style={{
                marginTop: '2rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                fontFamily: '-moz-initial',
                color: '#2c3e50'
            }}>
                ADMISSION FORM
            </Typography>

            {/*2. button create new form */}
            <Button className="button-container"
                    variant="contained"
                    endIcon={<Add/>}
                    sx={{
                        width: '15%',
                        height: '5vh',
                        backgroundColor: '#2c3e50',
                        borderRadius: '10px',
                        marginRight: '3rem'
                    }}
                    onClick={openFormPopUpFunc}
                    disabled={
                        isFormSubmitting || 
                        (studentList && studentList.filter(student => !student.hadForm).length === 0)
                    }
            >
                Create new form
            </Button>

            {/*3. cần 1 bảng để hiện list */}
            <RenderTable
                forms={forms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedForm={HandleSelectedForm}//selected form moi dc
                openRefillForm={openRefillForm}
                refreshData={refreshData}
            />
        </div>
    )
}

export default function AdmissionForm() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: ''
    })

    const [data, setData] = useState({
        admissionFormList: [],
        studentList: null
    })

    const [selectedForm, setSelectedForm] = useState(null)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)

    function HandleSelectedForm(form) {
        setSelectedForm(form)
    }

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type})
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''})
        GetForm()
    }

    const handleRefillForm = (form) => {
        setSelectedForm(form);
        handleOpenPopUp('pending approval');
    }

    async function GetForm() {
        const response = await getFormInformation()
        if (response && response.success) {
            setData({
                ...data,
                admissionFormList: response.data.admissionFormList,
                studentList: response.data.studentList
            })
        }
    }

    useEffect(() => {
        GetForm()
    }, []);

    return (
        <>
            <RenderPage
                forms={data.admissionFormList}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={() => handleOpenPopUp('detail')}
                HandleSelectedForm={HandleSelectedForm}
                studentList={data.studentList}
                openRefillForm={handleRefillForm}
                isFormSubmitting={isFormSubmitting}
                refreshData={GetForm}
            />
            {
                popUp.isOpen && popUp.type === 'form' &&
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen && data.studentList && data.studentList.filter(student => !student.hadForm).length !== 0}
                    handleClosePopUp={handleClosePopUp}
                    studentList={data.studentList}
                    GetForm={GetForm}
                    setIsFormSubmitting={setIsFormSubmitting}
                />
            }
            {
                popUp.isOpen && popUp.type === 'detail' &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedForm={selectedForm}
                />
            }
            {
                popUp.isOpen && popUp.type === 'pending approval' &&
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    studentList={data.studentList}
                    selectedForm={selectedForm}
                    GetForm={GetForm}
                    isRefill={true}
                    formId={selectedForm.id}
                    setIsFormSubmitting={setIsFormSubmitting}
                />
            }
        </>
    )
}