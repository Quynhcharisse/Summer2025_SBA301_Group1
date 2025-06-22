import {
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
    Grid,
    Alert
} from "@mui/material";
import {Add, Close, CloudUpload, Info} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {cancelAdmission, getFormInformation, submittedForm} from "../../services/ParentService.jsx";
import dayjs from "dayjs";
import {enqueueSnackbar} from "notistack";
import axios from "axios";
import '../../styles/Parent/Form.css'


function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
                                        <IconButton color="primary" onClick={() => handleDetailClick(form)}>
                                            <Info sx={{color: '#2c3e50'}}/>
                                        </IconButton>
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
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedForm}) {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleOpenConfirm = () => setOpenConfirm(true);
    const handleCloseConfirm = () => setOpenConfirm(false);

    async function HandleCancel() {
        const response = await cancelAdmission(selectedForm.id)
        if (response && response.success) {
            enqueueSnackbar("Form cancelled successfully", {variant: "success"});
            handleClosePopUp()
        } else {
            enqueueSnackbar(response.message || "Failed to cancel admission form", {variant: "error"});
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
                            >
                                Cancel Form
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
                                <Button onClick={handleCloseConfirm} color="inherit">Disagree</Button>
                                <Button onClick={HandleCancel} color="error" autoFocus>Agree</Button>
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

function RenderFormPopUp({handleClosePopUp, isPopUpOpen, studentList, GetForm}) {
    const [selectedStudentId, setSelectedStudentId] = useState(
        studentList?.[0]?.id || ''
    );
    
    const selectedStudent = studentList?.find(child => child.id === selectedStudentId);

    const [input, setInput] = useState({
        address: '',
        note: ''
    });

    const [uploadedFile, setUploadedFile] = useState({
        childCharacteristics: null,
        commitment: null
    });

    const [isSubmit, setIsSubmit] = useState(false);

    async function HandleSubmit() {
        setIsSubmit(true);

        if (!input.address.trim()) {
            enqueueSnackbar("Please enter household registration address", {variant: "error"});
            return;
        }

        if (!uploadedFile.childCharacteristics) {
            enqueueSnackbar("Please upload child characteristics form", {variant: "error"});
            return;
        }

        if (!uploadedFile.commitment) {
            enqueueSnackbar("Please upload commitment form", {variant: "error"});
            return;
        }

        // Upload files to Cloudinary
        const formData = new FormData();
        formData.append("file", uploadedFile.childCharacteristics);
        formData.append("upload_preset", "pes_swd");
        formData.append("api_key", "837117616828593");

        const commitmentData = new FormData();
        commitmentData.append("file", uploadedFile.commitment);
        commitmentData.append("upload_preset", "pes_swd");
        commitmentData.append("api_key", "837117616828593");

        try {
            const [characteristicsResponse, commitmentResponse] = await Promise.all([
                axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                }),
                axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", commitmentData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            ]);

            if (characteristicsResponse.status === 200 && commitmentResponse.status === 200) {
                const response = await submittedForm({
                    studentId: selectedStudentId,
                    householdRegistrationAddress: input.address,
                    childCharacteristicsFormImg: characteristicsResponse.data.url,
                    commitmentImg: commitmentResponse.data.url,
                    note: input.note || ''
                });

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
        }
    }

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close"
                    >
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                        Create Admission Form
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
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

                <Box sx={{ mb: 4 }}>
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
                                sx={{ bgcolor: '#fff' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Gender"
                                value={selectedStudent?.gender || ''}
                                disabled
                                sx={{ bgcolor: '#fff' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                value={selectedStudent?.dateOfBirth || ''}
                                disabled
                                sx={{ bgcolor: '#fff' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Place of Birth"
                                value={selectedStudent?.placeOfBirth || ''}
                                disabled
                                sx={{ bgcolor: '#fff' }}
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
                            <Box sx={{ textAlign: 'center' }}>
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
                            <Box sx={{ textAlign: 'center' }}>
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
                            <Box sx={{ textAlign: 'center' }}>
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
                        Please verify that all student information is correct before submitting the form. If any information needs to be
                        updated, please contact the school administrator.
                    </Alert>
                </Paper>

                <TextField
                    fullWidth
                    required
                    label="Household Registration Address"
                    value={input.address}
                    onChange={(e) => setInput({ ...input, address: e.target.value })}
                    error={isSubmit && !input.address.trim()}
                    helperText={isSubmit && !input.address.trim() ? "This field is required" : ""}
                    sx={{ 
                        mb: 3,
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: '#2c3e50'
                            }
                        }
                    }}
                />

                <TextField
                    fullWidth
                    label="Note"
                    value={input.note}
                    onChange={(e) => setInput({ ...input, note: e.target.value })}
                    multiline
                    rows={4}
                    sx={{ 
                        mb: 4,
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                                borderColor: '#2c3e50'
                            }
                        }
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
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ 
                                    height: '56px',
                                    borderColor: '#2c3e50',
                                    color: '#2c3e50',
                                    '&:hover': {
                                        borderColor: '#2c3e50',
                                        bgcolor: 'rgba(44, 62, 80, 0.04)'
                                    }
                                }}
                            >
                                {uploadedFile.childCharacteristics ? uploadedFile.childCharacteristics.name : "UPLOAD NEW"}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setUploadedFile({
                                        ...uploadedFile,
                                        childCharacteristics: e.target.files[0]
                                    })}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    mb: 1,
                                    fontWeight: 500,
                                    color: '#2c3e50'
                                }}
                            >
                                Commitment
                            </Typography>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ 
                                    height: '56px',
                                    borderColor: '#2c3e50',
                                    color: '#2c3e50',
                                    '&:hover': {
                                        borderColor: '#2c3e50',
                                        bgcolor: 'rgba(44, 62, 80, 0.04)'
                                    }
                                }}
                            >
                                {uploadedFile.commitment ? uploadedFile.commitment.name : "UPLOAD NEW"}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setUploadedFile({
                                        ...uploadedFile,
                                        commitment: e.target.files[0]
                                    })}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClosePopUp}
                        sx={{ 
                            px: 4,
                            borderColor: '#e67e22',
                            color: '#e67e22',
                            '&:hover': {
                                borderColor: '#d35400',
                                bgcolor: 'rgba(230, 126, 34, 0.04)'
                            }
                        }}
                    >
                        CANCEL
                    </Button>
                    <Button
                        variant="contained"
                        onClick={HandleSubmit}
                        sx={{ 
                            px: 4,
                            bgcolor: '#2c3e50',
                            '&:hover': {
                                bgcolor: '#1a252f'
                            }
                        }}
                    >
                        SUBMIT
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}

function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, forms, HandleSelectedForm, studentList}) {
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
                    disabled={studentList && studentList.filter(student => !student.hadForm).length === 0} // disable  - có student và filter trả về 1 list mới.length = 0 bị rỗng
            >
                Create new form
            </Button>

            {/*3. cần 1 bảng để hiện list */}
            <RenderTable
                forms={forms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedForm={HandleSelectedForm}//selected form moi dc
            />
        </div>
    )
}

export default function AdmissionForm() {
    //lưu những biến sài cục bộ
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: ''
    })

    //tạo useState data của BE để sài (dành cho form)
    const [data, setData] = useState({
        admissionFormList: [],
        studentList: null
    })

    const [selectedForm, setSelectedForm] = useState(null) // tuong trung cho 1 cai selected

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

    //gọi API form list //save trực tiếp data
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

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        //lấy data lên và lưu data vào getForm
        GetForm()
    }, []);

    return (
        <>
            <RenderPage
                forms={data.admissionFormList}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={() => handleOpenPopUp('detail')}
                HandleSelectedForm={HandleSelectedForm} // la 1 ham, truyen ham vao, để cập nhật form đã chọn
                studentList={data.studentList}
            />
            {
                popUp.isOpen && popUp.type === 'form' &&
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen && data.studentList && data.studentList.filter(student => !student.hadForm).length !== 0} // mở được form thì hasForm khác 0
                    handleClosePopUp={handleClosePopUp}
                    studentList={data.studentList}
                    GetForm={GetForm}
                />
            },
            {
                popUp.isOpen && popUp.type === 'detail' &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedForm={selectedForm}
                />
            }
        </>
    )
}