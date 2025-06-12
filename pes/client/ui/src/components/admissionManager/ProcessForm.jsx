import {
    AppBar,
    Box,
    Button,
    Dialog,
    FormControl,
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
import {Close, Info} from '@mui/icons-material';
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {getFormTracking, processAdmissionForm} from "../../services/AdmissionService.jsx";
import dayjs from "dayjs";
import {enqueueSnackbar} from "notistack";
import '../../styles/admissionManager/ProcessForm.css'


function RenderTable({openDetailPopUpFunc, forms, HandleSelectedForm}) {
    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5); //số dòng trang

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

    // Lọc trước khi phân trang
    const filteredForms = forms?.filter(form => form.status !== "cancelled") || [];

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
                            <TableCell align={"center"}>Child ID</TableCell>
                            <TableCell align={"center"}>Submit Date</TableCell>
                            <TableCell align={"center"}>Cancel Reason</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            <TableCell align={"center"}>Note</TableCell>
                            <TableCell align={"center"}>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredForms
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((form, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell align={"center"}>{index + 1}</TableCell>
                                        <TableCell align={"center"}>{form.id}</TableCell>
                                        <TableCell align={"center"}>{form.submittedDate}</TableCell>
                                        <TableCell align={"center"}>{form.cancelReason || "N/A"}</TableCell>
                                        <TableCell align="center" sx={{
                                            color:
                                                form.status === "approved"
                                                    ? "green"
                                                    : form.status === "rejected"
                                                        ? "red"
                                                        : form.status === "pending approval"
                                                            ? "#052c65"
                                                            : "black",
                                            fontWeight: "bold"
                                        }}>
                                            {form.status}
                                        </TableCell>
                                        <TableCell align={"center"}>{form.note}</TableCell>
                                        <TableCell align={"center"}>
                                            <IconButton color="primary"
                                                        onClick={() => handleDetailClick(form)}
                                            >
                                                <Info sx={{color: '#2c3e50'}}/>
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
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={filteredForms?.length} //phân trang có bn dòng
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderDetailPopUp({isPopUpOpen, handleClosePopUp, selectedForm}) {

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: '',
        reason: ''
    });

    //tạo state để hiển thị ảnh
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    async function HandleProcessForm(isApproved, reason) {
        const response = await processAdmissionForm(selectedForm.id, isApproved, reason)

        console.log("API Response: ", response.success);

        if (response && response.success) {
            enqueueSnackbar(
                isApproved ? "Approved successfully" : "Rejected successfully",
                {variant: "success"})
        } else {
            console.error("Process failed:", response?.message || "No response");
            enqueueSnackbar(
                isApproved ? "Approval failed" : "Rejection failed",
                {variant: "error"}
            )
        }
        handleClosePopUp()
    }

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
                            <RadioGroup row value={selectedForm.studentGender || ''}>
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
                            {label: "Commitment", src: selectedForm.commitmentImg}
                        ].map((item, idx) => (
                            <Paper key={idx} elevation={2} sx={{p: 2, borderRadius: 2, width: 200}}>
                                <Typography variant="body2" fontWeight="bold" sx={{mb: 1}}>{item.label}</Typography>

                                {/*thay vì click="ảnh" redirect sang link khác*/}
                                {/*vì giải quyết vấn đề hiện model thôi*/}
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    style={{width: '100%', borderRadius: 8, cursor: 'pointer'}}
                                    onClick={() => {
                                        setSelectedImage(item.src);
                                        setOpenImage(true);
                                    }}
                                />

                                <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="md">
                                    <img src={selectedImage} style={{width: '100%'}} alt="Zoom"/>
                                </Dialog>
                            </Paper>
                        ))}
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    <Stack sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '2vh',
                    }}>
                        <Button sx={{width: '8%', height: '5vh'}}
                                variant="contained"
                                color="warning"
                                onClick={handleClosePopUp}>
                            Close
                        </Button>

                        {selectedForm.status === "pending approval" && (
                            <>
                                <Button
                                    sx={{width: '8%', height: '5vh'}}
                                    variant="contained"
                                    color="success"
                                    onClick={() => setConfirmDialog({open: true, type: 'approve', reason: ''})}
                                >
                                    Approve
                                </Button>
                                <Button
                                    sx={{width: '8%', height: '5vh'}}
                                    variant="contained"
                                    color="error"
                                    onClick={() => setConfirmDialog({open: true, type: 'reject', reason: ''})}
                                >
                                    Reject
                                </Button>
                            </>
                        )}

                    </Stack>
                    <Dialog open={confirmDialog.open}
                            onClose={() => setConfirmDialog({open: false, type: '', reason: ''})}>
                        <Box p={3} width={500}>
                            <Stack spacing={3}>
                                <Typography variant="h6" fontWeight="bold">
                                    {confirmDialog.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                                </Typography>

                                <Typography variant="body2" sx={{whiteSpace: 'pre-line'}}>
                                    {confirmDialog.type === 'approve'
                                        ? 'Are you sure you want to approve this admission form?\nThis action cannot be undone.'
                                        : 'Are you sure you want to reject this form?\nPlease enter a reason below.'}
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
                                            setConfirmDialog(prev => ({...prev, reason: e.target.value}))
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
                                            const reason = isApproved ? '' : confirmDialog.reason.trim();

                                            // Log phân biệt rõ hành động
                                            if (isApproved) {
                                                console.log("🟢 APPROVE form:", selectedForm.id);
                                            } else {
                                                console.log("🔴 REJECT form:", selectedForm.id, "| Reason:", reason);
                                            }

                                            //Nếu là reject mà ko có lys do chỉ cảnh báo
                                            if (!isApproved && reason === '') {
                                                enqueueSnackbar("Please enter a reason for rejection.", {variant: "warning"});
                                                return;
                                            }
                                            //ktr lỗi
                                            HandleProcessForm(isApproved, reason);
                                        }}
                                    >
                                        Confirm
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Dialog>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderPage({openDetailPopUpFunc, forms, HandleSelectedForm}) {

    return (
        <div className="container">
            {/*hien tieu de*/}
            <Typography variant={'caption'} style={{
                marginTop: '2rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                fontFamily: '-moz-initial',
                color: '#2c3e50'
            }}>
                PROCESS FORM
            </Typography>

            {/*hien bang*/}
            <RenderTable
                forms={forms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedForm={HandleSelectedForm}//selected form moi dc
            />
        </div>
    )
}

export default function ProcessForm() {
    // luu nhung bien cuc bi
    const [popUp, setPopup] = useState({
        isOpen: false,
        type: ''
    });

    const [formList, setFormList] = useState([])

    const [selectedForm, setSelectedForm] = useState(null) // tuong trung cho 1 cai selected

    function HandleSelectedForm(form) {
        setSelectedForm(form)
    }

    const handleOpenPopup = (type) => {
        setPopup({...popUp, isOpen: true, type: type});
    }

    const handleClosePopup = () => {
        setPopup({...popUp, isOpen: false, type: ''});
        GetFormByAdmission()
    }

    async function GetFormByAdmission() {
        const response = await getFormTracking()
        if (response && response.success) {
            setFormList(response.data)
        }
    }

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        GetFormByAdmission()
    }, [])

    return (
        <>
            <RenderPage openDetailPopUpFunc={() => handleOpenPopup('detail')}
                        forms={formList}
                        HandleSelectedForm={HandleSelectedForm} // là 1 hàm, truyền hàm vào, để cập nhật for đã chọn
            />

            {
                popUp.isOpen && popUp.type === 'detail' &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopup}
                    selectedForm={selectedForm}
                />
            }
        </>
    )
}