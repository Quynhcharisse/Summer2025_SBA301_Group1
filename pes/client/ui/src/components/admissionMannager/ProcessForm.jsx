import {
    AppBar,
    Box,
    Button,
    Dialog,
    FormControlLabel,
    FormLabel,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
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
    Typography
} from "@mui/material";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {enqueueSnackbar} from "notistack";
import {getFormTracking, processAdmissionForm} from "../../services/AdmissionService.jsx";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Close, Info} from "@mui/icons-material";
import '../../styles/admissionManager/ProcessForm.css'


//trong render table : forms(danh sách các đơn đăng kí),
// setSelectedFormFunc(form) lưu lại form để hiển thị chi tiết
// openDetailModalFunc() mở modal chi tiết
function RenderTable({forms, openDetailModalFunc, setSelectedFormFunc}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const headers = [
        "No",
        "Child name",
        "Date of birth",
        "Submitted date",
        "Term Status",
        "Status",
        "Action"
    ]

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleDetailClick = (form) => {
        setSelectedFormFunc(form);
        openDetailModalFunc();
    }

    return (
        <Paper sx={{
            width: '100%',
            height: 500,
            borderRadius: 3,
            overflow: 'hidden',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            border: '2px solid rgb(254, 254, 253)',
        }}>
            <TableContainer sx={{height: 500}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {
                                headers.map((header, index) => (
                                    <TableCell key={index} align={"center"}
                                               sx={{fontWeight: 'bold'}}>{header}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            forms
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((form, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell align={"center"}>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell align={"center"}>{form.childName}</TableCell>
                                            <TableCell
                                                align="center">{dayjs(form.dateOfBirth).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell
                                                align="center">{dayjs(form.submittedDate).format('DD/MM/YYYY')}</TableCell>
                                            <TableCell align="center">
                                            <span
                                                style={{
                                                    textTransform: 'lowercase',
                                                    fontWeight: 'bold',
                                                    color:
                                                        form.admissionTerm?.admissionTermStatus === 'LOCKED_TERM'
                                                            ? 'green'
                                                            : form.admissionTerm?.admissionTermStatus === 'ACTIVE_TERM'
                                                                ? '#f39c12' // orange
                                                                : '#7f8c8d', // grey
                                                }}
                                            >
                                                    {form.admissionTerm?.admissionTermStatus?.toLowerCase() ?? 'n/a'}
                                                  </span>
                                            </TableCell>
                                            <TableCell
                                                align={"center"}
                                                className={form.status === 'approved' ? "status-color-green" : "status-color-red"}
                                            >
                                                {form.status}
                                            </TableCell>
                                            <TableCell align={"center"}>
                                                <IconButton color="primary" onClick={() => handleDetailClick(form)}>
                                                    <Info sx={{fill: '#2c3e50'}}/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={forms.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderDetail({handleCloseFunc, isModalOpened, formData, onActionCompleted}) {

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: '', // 2 loại : approve || reject
        reason: ''
    });

        async function handleProcessForm(isApproved, reason) {
            const response = await processAdmissionForm(formData.id, isApproved, reason);
            console.log('Response: ', response);
            if (response?.success) {
                enqueueSnackbar(
                    isApproved ? "Approved successfully" : "Rejected successfully",
                    {variant: "success"}
                )
                handleCloseFunc()
                onActionCompleted()
            } else {
                enqueueSnackbar(
                    isApproved ? "Approval failed" : "Rejection failed",
                    {variant: "error"}
                )
            }

        }


    function handleClosed() {
        handleCloseFunc()
    }

    return (
        <Dialog
            fullScreen
            open={isModalOpened}
            onClose={handleCloseFunc}
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleCloseFunc}
                        aria-label="close"
                    >
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
                        <TextField fullWidth label={'Child name *'} readOnly value={formData.childName}/>
                    </Stack>

                    <Stack>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup value={formData.childGender} row>
                            <FormControlLabel value="female" control={<Radio/>} label="Female"
                                              sx={{color: 'black'}} disabled/>
                            <FormControlLabel value="male" control={<Radio/>} label="Male" sx={{color: 'black'}}
                                              disabled/>
                        </RadioGroup>
                    </Stack>

                    <Stack>
                        <DatePicker
                            label="Date of birth *"
                            defaultValue={dayjs(formData.dateOfBirth)}
                            readOnly
                            slotProps={{textField: {fullWidth: true, disabled: true}}}
                        />

                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Place of birth *'} aria-readonly
                                   value={formData.placeOfBirth}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Household registration address *'} aria-readonly
                                   value={formData.householdRegistrationAddress}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Note'} aria-readonly value={formData.note}/>
                    </Stack>
                    <Stack>
                        {
                            formData.status.toLowerCase() === 'pending approval'
                            &&
                            <TextField fullWidth label={'Cancel reason'} disabled value={formData.cancelReason ? formData.cancelReason : ''}/>
                        }
                    </Stack>

                    <Typography variant="subtitle1" sx={{mt: 5, mb: 2, fontWeight: 'bold'}}>Uploaded
                        Documents</Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                        {[{label: "Profile Image", src: formData.profileImage},
                            {label: "Household Registration", src: formData.householdRegistrationImg},
                            {label: "Birth Certificate", src: formData.birthCertificateImg},
                            {label: "Commitment", src: formData.commitmentImg}].map((item, idx) => (
                            <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>
                                <a href={item.src} target="_blank" rel="noopener noreferrer">
                                    <img src={item.src} alt={item.label}
                                         style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}/>
                                </a>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    <Stack sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1rem'}}>
                        <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained"
                                color='warning'
                                onClick={handleClosed}>
                            Close
                        </Button>

                        {
                            formData.status.toLowerCase() === 'pending approval' &&
                            formData.admissionTerm?.admissionTermStatus?.toLowerCase() === 'locked' &&
                            <Button
                                sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                color='success'
                                onClick={() =>
                                    setConfirmDialog({open: true, type: 'approve', reason: ''})
                                }
                            >
                                Approve
                            </Button>
                        }

                        {
                            formData.status.toLowerCase() === 'pending approval' &&
                            formData.admissionTerm?.admissionTermStatus?.toLowerCase() === 'locked' &&
                            <Button
                                sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                color='error'
                                onClick={() =>
                                    setConfirmDialog({open: true, type: 'reject', reason: ''})
                                }
                            >
                                Reject
                            </Button>
                        }
                    </Stack>
                </Stack>
            </Box>

            <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({open: false, type: '', reason: ''})}>
                <Box p={3} width={500}>
                    <Stack spacing={3}>
                        <Typography variant="h6" fontWeight="bold">
                            {confirmDialog.type === 'approve'
                                ? 'Confirm Approval'
                                : 'Confirm Rejection'}
                        </Typography>

                        <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>
                            {confirmDialog.type === 'approve'
                                ? 'Approving this form will officially confirm the child’s enrollment\nDo you want to proceed?'
                                : 'Rejecting this admission form will notify the parent and close this application\nPlease provide a reason below'}
                        </Typography>

                        {confirmDialog.type === 'reject' && (
                            <TextField
                                multiline
                                minRows={3}
                                label="Reason for rejection"
                                placeholder="Enter reason..."
                                fullWidth
                                value={confirmDialog.reason}
                                onChange={(e) =>
                                    setConfirmDialog((prev) => ({
                                        ...prev,
                                        reason: e.target.value,
                                    }))
                                }
                            />
                        )}

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={() => setConfirmDialog({open: false, type: '', reason: ''})}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color={confirmDialog.type === 'approve' ? 'success' : 'error'}
                                onClick={() => {
                                    const isApproved = confirmDialog.type === 'approve';
                                    const reason = isApproved ? '' : confirmDialog.reason;
                                    handleProcessForm(isApproved, reason);
                                    setConfirmDialog({open: false, type: '', reason: ''});
                                }}
                            >
                                Confirm
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Dialog>

        </Dialog>
    )
}

function RenderPage({forms, openDetailModalFunc, setSelectedFormFunc}) {

    return (
        <div className="container">
            <div className={'d-flex row justify-content-end mt-4 mb-4'}>

                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center"}}
                >
                    Tracking Form Information
                </Typography>


                <RenderTable forms={forms} openDetailModalFunc={openDetailModalFunc}
                             setSelectedFormFunc={setSelectedFormFunc}/>
            </div>
        </div>
    )
}

// trong component chính
export default function ProcessForm() {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [modal, setModal] = useState({
        isOpen: false,
        type: ''
    });

    //getForm by Admisson Manager
    async function getFormList() {
        const response = await getFormTracking()
        if (response && response.success) {
            return response.data;
        }
    }

    useEffect(() => {
        getFormList().then(res => setForms(res));
    }, []);

    const handleOpenModal = (type) => {
        setModal({...modal, isOpen: true, type: type});
    };

    const handleCloseModal = () => {
        setModal({...modal, isOpen: false, type: ''});
    };

    return (
        <>
            <RenderPage
                forms={forms}
                openFormModelFunc={() => handleOpenModal('form')}
                openDetailModalFunc={() => handleOpenModal('detail')}
                setSelectedFormFunc={setSelectedForm}
            />

            {
                modal.isOpen && modal.type === 'detail' &&
                <RenderDetail isModalOpened={modal.isOpen}
                              handleCloseFunc={handleCloseModal}
                              formData={selectedForm}
                              onActionCompleted={async () => {
                                  const reload = await getFormList()
                                  setForms(reload)
                              }}
                />
            }
        </>
    )
}