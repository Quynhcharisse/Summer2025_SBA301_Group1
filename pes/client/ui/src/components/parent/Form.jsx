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
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {Add, Close, CloudUpload, Info} from '@mui/icons-material';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import {cancelAdmission, getChildren, getForms, submittedAdmission} from "../../services/ParentService.jsx";
import '../../styles/Parent/Form.css'
import {enqueueSnackbar} from "notistack";

function RenderTable({forms, openDetailModalFunc, setSelectedFormFunc}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const handleDetailClick = (form) => {
        setSelectedFormFunc(form);
        // Use a callback or ensure openDetailModalFunc runs after setSelectedFormFunc
        setTimeout(() => openDetailModalFunc(), 0);
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
                            <TableCell align={"center"}>No</TableCell>
                            <TableCell align={"center"}>Child name</TableCell>
                            <TableCell align={"center"}>Date of birth</TableCell>
                            <TableCell align={"center"}>Submitted date</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            <TableCell align={"center"}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Array.isArray(forms) && forms.length > 0
                                ? forms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((form, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align={"center"}>{index + 1}</TableCell>
                                                <TableCell align={"center"}>{form.childName}</TableCell>
                                                <TableCell align={"center"}>{form.dateOfBirth}</TableCell>
                                                <TableCell align={"center"}>{form.submittedDate}</TableCell>
                                                <TableCell align={"center"}>{form.status}</TableCell>
                                                <TableCell align={"center"}>
                                                    <IconButton color="primary" onClick={() => handleDetailClick(form)}>
                                                        <Info/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                : (
                                    <TableRow>
                                        <TableCell align="center" colSpan={6}>No data available</TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={forms?.length} // fix crash nếu forms null/undefined
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}


function RenderForm({handleCloseFunc, isModalOpened, children, fetchForms}) {

    //nơi lưu file thô mà người dùng upload từ <input type="file" />
    const [uploadedFile, setUploadedFile] = useState({
        profile: '',
        houseAddress: '',
        birth: '',
        commit: ''
    });

    //nơi lưu URL trả về từ Cloudinary sau khi upload thành công
    const [imageLink, setImageLink] = useState({
        profileLink: '',
        houseAddressLink: '',
        birthLink: '',
        commitLink: ''
    });

    const [selectedChildId, setSelectedChildId] = useState(children[0].id);
    const [input, setInput] = useState({
        address: '',
        note: ''
    });

    //dua vao id, lưu đúng loại file vào uploadedFile
    function handleUploadFile(file, id) {
        switch (id) {
            case 1:
                setUploadedFile({...uploadedFile, profile: file});
                break;
            case 2:
                setUploadedFile({...uploadedFile, houseAddress: file});
                break;
            case 3:
                setUploadedFile({...uploadedFile, birth: file});
                break;
            default:
                setUploadedFile({...uploadedFile, commit: file});
                break;
        }
    }


    const handleUploadImage = async () => {

        if (!uploadedFile.profile || !uploadedFile.birth || !uploadedFile.houseAddress || !uploadedFile.commit) {
            enqueueSnackbar("Please upload all required documents.", {variant: "warning"});
            return null;
        }

        const profileData = new FormData();
        profileData.append("file", uploadedFile.profile);
        profileData.append("upload_preset", "pes_swd");
        profileData.append("api_key", "837117616828593");

        const houseAddressData = new FormData();
        houseAddressData.append("file", uploadedFile.houseAddress);
        houseAddressData.append("upload_preset", "pes_swd");
        houseAddressData.append("api_key", "837117616828593");

        const birthData = new FormData();
        birthData.append("file", uploadedFile.birth);
        birthData.append("upload_preset", "pes_swd");
        birthData.append("api_key", "837117616828593");

        const commitData = new FormData();
        commitData.append("file", uploadedFile.commit);
        commitData.append("upload_preset", "pes_swd");
        commitData.append("api_key", "837117616828593");

        const profileResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", profileData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const houseAddressResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", houseAddressData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        const birthResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", birthData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );

        const commitResponse = await axios.post("https://api.cloudinary.com/v1_1/dbrfnkrbh/image/upload", commitData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );

        const profileCondition = profileResponse && profileResponse.status === 200
        const houseAddressCondition = houseAddressResponse && houseAddressResponse.status === 200
        const birthCondition = birthResponse && birthResponse.status === 200
        const commitCondition = commitResponse && commitResponse.status === 200


        if (profileCondition && houseAddressCondition && birthCondition && commitCondition) {
            const result = {
                profileLink: profileResponse.data.url,
                houseAddressLink: houseAddressResponse.data.url,
                birthLink: birthResponse.data.url,
                commitLink: commitResponse.data.url
            };
            setImageLink(result)
            return result
        }
        return null
    }

    async function handleSubmit() {
        const uploadResult = await handleUploadImage();
        if (!uploadResult) {
            return;
        }

        const selectedChild = children.find(child => child.id === selectedChildId);
        const response = await submittedAdmission(
            selectedChild.name,
            selectedChild.gender,
            selectedChild.dateOfBirth,
            selectedChild.placeOfBirth,
            input.address,
            uploadResult.profileLink,
            uploadResult.birthLink,
            uploadResult.houseAddressLink,
            uploadResult.commitLink,
            input.note
        );

        if (response && response.success) {
            enqueueSnackbar(response.message, {variant: "success"});
            await fetchForms()
            handleCloseFunc();
        } else {
            enqueueSnackbar("Submission failed", {variant: "error"});
        }
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
                        Create Admission Form
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

                {selectedChildId !== null && Array.isArray(children) && children.length > 0 && (
                    <Stack spacing={3}>
                        <Stack>
                            <FormControl fullWidth>
                                <InputLabel>Child name</InputLabel>
                                <Select
                                    value={selectedChildId}
                                    label="Child name *"
                                    onChange={(e) => setSelectedChildId(e.target.value)}
                                    variant={"outlined"}
                                >
                                    {children.map((child, index) => (
                                        <MenuItem key={index} value={child.id}>{child.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Stack>

                        <Stack>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                    row
                                    value={children.find(child => child.id === selectedChildId)?.gender || ''}

                                >
                                    <FormControlLabel value="female" control={<Radio/>} label="Female"
                                                      sx={{color: 'black'}} disabled/>
                                    <FormControlLabel value="male" control={<Radio/>} label="Male"
                                                      sx={{color: 'black'}} disabled/>
                                </RadioGroup>
                            </FormControl>
                        </Stack>

                        <Stack>
                            <DatePicker
                                label="Date of birth"
                                disabled
                                defaultValue={dayjs(children.find(child => child.id === selectedChildId) ? children.find(child => child.id === selectedChildId).dateOfBirth : null)}
                                slotProps={{textField: {fullWidth: true}}}
                            />
                        </Stack>

                        <Stack>
                            <TextField
                                fullWidth
                                label="Place of birth"
                                disabled
                                defaultValue={children.find(child => child.id === selectedChildId)?.placeOfBirth || ''}
                                name="placeOfBirth"
                            />
                        </Stack>

                        <Stack>
                            <TextField
                                fullWidth
                                label="Household registration address *"
                                value={input.address}
                                onChange={(e) => setInput({...input, address: e.target.value})}
                                name="householdRegistrationAddress"
                            />
                        </Stack>

                        <Stack>
                            <TextField fullWidth
                                       label={'Note'}
                                       aria-readonly
                                       value={input.note}
                                       onChange={(e) => setInput({...input, note: e.target.value})}
                            />
                        </Stack>
                    </Stack>
                )}

                <Typography
                    variant='subtitle1'
                    sx={{mb: 3, mt: 5, fontSize: '1rem'}}
                >
                    UPLOAD DOCUMENTS
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <Typography variant='body1' sx={{mb: 1}}>Profile Image: <span
                            className={'text-primary'}>{uploadedFile.profile ? uploadedFile.profile.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="profileImage"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 1)}/>
                        </Button>
                    </Stack>

                    <Stack>
                        <Typography variant='body1' sx={{mb: 1}}>Household Registration: <span
                            className={'text-primary'}>{uploadedFile.houseAddress ? uploadedFile.houseAddress.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="householdRegistrationImg"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 2)}/>
                        </Button>
                    </Stack>

                    <Stack>
                        <Typography variant='body1' sx={{mb: 1}}>Birth Certificate: <span
                            className={'text-primary'}>{uploadedFile.birth ? uploadedFile.birth.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="birthCertificateImg"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 3)}/>
                        </Button>
                    </Stack>

                    <Stack>
                        <Typography variant='body1' sx={{mb: 1}}>Commitment: <span
                            className={'text-primary'}>{uploadedFile.commit ? uploadedFile.commit.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="commitmentImg"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 4)}/>
                        </Button>
                    </Stack>
                    <Stack
                        sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1rem'}}>
                        <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained" color='success'
                                onClick={() => handleSubmit(
                                    children.find(child => child.id === selectedChildId)?.name,
                                    children.find(child => child.id === selectedChildId)?.gender,
                                    children.find(child => child.id === selectedChildId)?.dateOfBirth,
                                    children.find(child => child.id === selectedChildId)?.placeOfBirth,
                                    imageLink.profileLink,
                                    imageLink.birthLink,
                                    imageLink.houseAddressLink,
                                    imageLink.commitLink,
                                )}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderDetail({handleCloseFunc, isModalOpened, formData}) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    //handle cancel form
    async function HandleCancelForm() {
        setIsCancelling(true);
        try {
            const response = await cancelAdmission(formData.id);
            if (response?.success) {
                enqueueSnackbar("Form cancelled successfully", { variant: "success" });
                setIsConfirmOpen(false);
                handleCloseFunc();
            } else {
                enqueueSnackbar(response?.message || "Failed to cancel admission form", { variant: "error" });
            }
        } catch (error) {
            console.error("Cancel error:", error);
            enqueueSnackbar("Error occurred while cancelling form", { variant: "error" });
        }
        setIsCancelling(false);
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
                        <TextField fullWidth label={'Child name *'} aria-readonly value={formData.childName || ''}/>
                    </Stack>

                    <Stack>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup value={formData.childGender || ''} aria-readonly>
                            <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                            <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                        </RadioGroup>
                    </Stack>

                    <Stack>
                        <DatePicker label={'Date of birth *'} readOnly
                                    defaultValue={formData.dateOfBirth ? dayjs(formData.dateOfBirth.toString()) : null}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Place of birth *'} aria-readonly
                                   value={formData.placeOfBirth || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Household registration address *'} aria-readonly
                                   value={formData.householdRegistrationAddress || ''}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Note'} aria-readonly value={formData.note || ''}/>
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Cancel reason'} disabled value={formData.cancelReason || ''}/>
                    </Stack>
                </Stack>

                <Stack spacing={3}>
                    <Stack sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1rem'}}>
                        <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained" color='warning'
                                onClick={handleClosed}>
                            Close
                        </Button>
                        {
                            formData?.status.toLowerCase() === 'draft'
                            &&
                            <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained"
                                    color='success' onClick={handleClosed}>
                                Submit
                            </Button>
                        }

                        {formData?.status.toLowerCase() === 'pending approval' && (
                            <Button
                                sx={{ width: '10%', marginTop: '2vh', height: '5vh' }}
                                variant="contained"
                                color="error"
                                onClick={() => setIsConfirmOpen(true)}
                            >
                                Cancel
                            </Button>
                        )}
                    </Stack>
                    <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
                        <DialogTitle>Cancel Admission Form</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                ⚠️ Are you sure you want to cancel this admission form?
                                <br />
                                This action cannot be undone and the child may lose their enrollment opportunity for this term.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsConfirmOpen(false)}>No</Button>
                            <Button onClick={HandleCancelForm} color="error" autoFocus disabled={isCancelling}>
                                { isCancelling ? "Cancalling..." : "Yes, Cancel" }
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderPage({forms, openFormModelFunc, openDetailModalFunc, setSelectedFormFunc}) {

    return (
        <div className="container">
            <Typography variant={'caption'} style={{
                marginTop: '2rem',
                fontSize: '2rem',
                fontWeight: 'bold',
                fontFamily: '-moz-initial',
                color: '#2c3e50',
            }}>
                ADMISSION FORM
            </Typography>
            <div className={'d-flex justify-content-end mt-4 mb-4'}>
                <Button
                    variant="contained"
                    endIcon={<Add/>}
                    sx={{
                        width: '15%',
                        height: '5vh',
                        backgroundColor: '#2c3e50',
                        borderRadius: '10px',
                        marginRight: '3rem',
                    }}
                    onClick={openFormModelFunc}
                >
                    Create new form
                </Button>
            </div>
            <RenderTable forms={forms} openDetailModalFunc={openDetailModalFunc}
                         setSelectedFormFunc={setSelectedFormFunc}/>
        </div>
    )
}

export default function Form() {
    const [forms, setForms] = useState([]);
    const [modal, setModal] = useState({
        isOpen: false,
        type: ''
    });

    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);

    async function GetFormList() {
        const response = await getForms()
        if (response && response.success) {
            return response.data;
        }
    }

    async function FetchChildren() {
        const response = await getChildren();
        if (response && response.success) {
            return response.data;
        }
    }

    useEffect(() => {
        GetFormList().then(res => setForms(res))
        FetchChildren().then(res => setChildren(res))
    }, []) // chay lan dau tien

    const handleOpenModal = (type) => {
        setModal({...modal, isOpen: true, type: type});
    };

    const handleCloseModal = () => {
        setModal({...modal, isOpen: false, type: ''});
        GetFormList().then(res => setForms(res))
    };
    console.log(selectedChildId)
    return (
        <>
            <RenderPage
                forms={forms}
                openFormModelFunc={() => handleOpenModal('form')}
                openDetailModalFunc={() => handleOpenModal('detail')}
                setSelectedFormFunc={setSelectedForm} // truyền hàm setSelectedForm để cập nhật form đã chọn
            />
            {
                modal.isOpen && modal.type === 'form' && children.length > 0 && (
                    <RenderForm isModalOpened={modal.isOpen}
                                handleCloseFunc={handleCloseModal}
                                children={children}
                                fetchForms={GetFormList}
                    /> // condition de ko thi mean = true and component
                )
            }
            {
                modal.isOpen && modal.type === 'detail' &&
                <RenderDetail isModalOpened={modal.isOpen}
                              handleCloseFunc={handleCloseModal}
                              formData={selectedForm || {}} //pass đúng đata nếu cần
                /> // condition de ko thi mean = true and component
            }
        </>
    )
}