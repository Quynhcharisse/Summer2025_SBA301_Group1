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
import {useEffect, useState} from "react";
import {Add, Close, CloudUpload, Info} from '@mui/icons-material';
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import {getForms} from "../../services/ParentService.jsx";
import '../../styles/Parent/Form.css'

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
                            <TableCell align={"center"}>No</TableCell>
                            <TableCell align={"center"}>Child name</TableCell>
                            <TableCell align={"center"}>Date of birth</TableCell>
                            <TableCell align={"center"}>Submitted date</TableCell>
                            <TableCell align={"center"}>Modified date</TableCell>
                            <TableCell align={"center"}>Status</TableCell>
                            <TableCell align={"center"}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            forms
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((form, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell align={"center"}>{index + 1}</TableCell>
                                            <TableCell align={"center"}>{form.childName}</TableCell>
                                            <TableCell align={"center"}>{form.dateOfBirth}</TableCell>
                                            <TableCell align={"center"}>{form.submittedDate}</TableCell>
                                            <TableCell align={"center"}>{form.modifiedDate}</TableCell>
                                            <TableCell align={"center"}>{form.status}</TableCell>
                                            <TableCell align={"center"}>
                                                <IconButton color="primary" onClick={() => handleDetailClick(form)}>
                                                    <Info/>
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

function RenderForm({handleCloseFunc, isModalOpened}) {

    const [uploadedFile, setUploadedFile] = useState({
        profile: {
            img: null,
            url: ""
        },
        houseAddress: {
            img: null,
            url: ""
        },
        birth: {
            img: null,
            url: ""
        },
        commit: {
            img: null,
            url: ""
        },
    });

    function handleUploadFile(file, index) {
        switch (index) {
            case 1:
                setUploadedFile({...uploadedFile, profile: {img: file, url: ""}});
                break;
            case 2:
                setUploadedFile({...uploadedFile, houseAddress: {img: file, url: ""}});
                break;
            case 3:
                setUploadedFile({...uploadedFile, birth: {img: file, url: ""}});
                break;
            default:
                setUploadedFile({...uploadedFile, commit: {img: file, url: ""}});
                break;
        }
    }


    function handleSaveDraft() {
        handleCloseFunc()
    }

    const handleUploadImage = async () => {

        const profileData = new FormData();
        profileData.append("file", uploadedFile.profile.img);
        profileData.append("upload_preset", "pes_swd");
        profileData.append("api_key", "837117616828593");

        const houseAddressData = new FormData();
        houseAddressData.append("file", uploadedFile.houseAddress.img);
        houseAddressData.append("upload_preset", "pes_swd");
        houseAddressData.append("api_key", "837117616828593");

        const birthData = new FormData();
        birthData.append("file", uploadedFile.birth.img);
        birthData.append("upload_preset", "pes_swd");
        birthData.append("api_key", "837117616828593");

        const commitData = new FormData();
        commitData.append("file", uploadedFile.commit.img);
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

        if (profileResponse && profileResponse.status === 200) {
            console.log(profileResponse.data.url);
            setUploadedFile(
                (uploadedFile) => (
                    {
                        ...uploadedFile, profile: {
                            ...uploadedFile.profile,
                            url: profileResponse.data.url
                        }
                    }
                ))
        }

        if (houseAddressResponse && houseAddressResponse.status === 200) {
            setUploadedFile((uploadedFile) => (
                {
                    ...uploadedFile, houseAddress: {
                        ...uploadedFile.houseAddress,
                        url: houseAddressResponse.data.url
                    }
                }
            ))
        }


        if (birthResponse && birthResponse.status === 200) {
            setUploadedFile((uploadedFile) => ({
                ...uploadedFile, birth: {
                    ...uploadedFile.birth,
                    url: birthResponse.data.url
                }
            }))
        }

        if (commitResponse && commitResponse.status === 200) {
            setUploadedFile((uploadedFile) => ({
                ...uploadedFile, commit: {
                    ...uploadedFile.commit,
                    url: commitResponse.data.url
                }
            }))
        }

        return profileResponse && profileResponse.status === 200
            && houseAddressResponse && houseAddressResponse.status === 200
            && birthResponse && birthResponse.status === 200
            && commitResponse && commitResponse.status === 200


    }

    async function handleSubmit() {
        const response = await handleUploadImage();
        if (response) {
            console.log('Uploaded file:  ', uploadedFile);
            console.log('Upload successfully');
        } else {
            console.log('Upload failed');
        }
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

                <Stack container spacing={3}>
                    <Stack item xs={12}>
                        <TextField fullWidth label={'Child name *'}/>
                    </Stack>

                    <Stack item xs={12}>
                        <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                        >
                            <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                            <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                        </RadioGroup>
                    </Stack>

                    <Stack item xs={12}>
                        <DatePicker label={'Date of birth *'}/>
                    </Stack>

                    <Stack item xs={12}>
                        <TextField fullWidth label={'Place of birth *'}/>
                    </Stack>

                    <Stack item xs={12}>
                        <TextField fullWidth label={'Household registration address *'}
                                   name="householdRegistrationAddress"/>
                    </Stack>
                </Stack>

                <Typography
                    variant='subtitle1'
                    sx={{mb: 3, mt: 5, fontSize: '1rem'}}
                >
                    UPLOAD DOCUMENTS
                </Typography>

                <Stack container spacing={3}>
                    <Stack item xs={12}>
                        <Typography variant='body1' sx={{mb: 1}}>Profile Image: <span
                            className={'text-primary'}>{uploadedFile.profile.img ? uploadedFile.profile.img.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="profileImage"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 1)}/>
                        </Button>
                    </Stack>

                    <Stack item xs={12}>
                        <Typography variant='body1' sx={{mb: 1}}>Household Registration: <span
                            className={'text-primary'}>{uploadedFile.houseAddress.img ? uploadedFile.houseAddress.img.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="householdRegistrationImg"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 2)}/>
                        </Button>
                    </Stack>

                    <Stack item xs={12}>
                        <Typography variant='body1' sx={{mb: 1}}>Birth Certificate: <span
                            className={'text-primary'}>{uploadedFile.birth.img ? uploadedFile.birth.img.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="birthCertificateImg"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 3)}/>
                        </Button>
                    </Stack>

                    <Stack item xs={12}>
                        <Typography variant='body1' sx={{mb: 1}}>Commitment: <span
                            className={'text-primary'}>{uploadedFile.commit.img ? uploadedFile.commit.img.name : ""}</span></Typography>
                        <Button component="label" sx={{width: '10%', marginTop: '2vh', height: '5vh'}}
                                variant="contained"
                                startIcon={<CloudUpload/>}>
                            Upload
                            <input type="file" hidden name="commitmentImg"
                                   onChange={(e) => handleUploadFile(e.target.files[0], 4)}/>
                        </Button>
                    </Stack>
                    <Stack item xs={12}
                           sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1rem'}}>
                        <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained" color='primary'
                                onClick={handleSaveDraft}>
                            Save Draft
                        </Button>

                        <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained" color='success'
                                onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderDetail({handleCloseFunc, isModalOpened, formData}) {

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

                <Stack container spacing={3}>
                    <Stack>
                        <TextField fullWidth label={'Child name *'} aria-readonly value={formData.childName}/>
                    </Stack>

                    <Stack>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup value={formData.childGender} aria-readonly>
                            <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                            <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                        </RadioGroup>
                    </Stack>

                    <Stack>
                        <DatePicker label={'Date of birth *'} readOnly
                                    defaultValue={dayjs(formData.dateOfBirth.toString())}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Place of birth *'} aria-readonly value={formData.placeOfBirth}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Household registration address *'} aria-readonly
                                   value={formData.householdRegistrationAddress}/>
                    </Stack>

                    <Stack>
                        <TextField fullWidth label={'Note'} aria-readonly value={formData.note}/>
                    </Stack>
                    <Stack>
                        <TextField fullWidth label={'Cancel reason'} disabled value={formData.cancelReason}/>
                    </Stack>
                </Stack>

                <Stack container spacing={3}>
                    <Stack sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '1rem'}}>
                        <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained" color='warning'
                                onClick={handleClosed}>
                            Close
                        </Button>
                        {
                            formData.status.toLowerCase() === 'draft'
                            &&
                            <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained"
                                    color='success' onClick={handleClosed}>
                                Submit
                            </Button>
                        }

                        {
                            formData.status.toLowerCase() === 'pending approval'
                            &&
                            <Button sx={{width: '10%', marginTop: '2vh', height: '5vh'}} variant="contained"
                                    color='error' onClick={handleClosed}>
                                Cancel
                            </Button>
                        }


                    </Stack>
                </Stack>
            </Box>
        </Dialog>
    )
}

function RenderPage({forms, openFormModelFunc, openDetailModalFunc, setSelectedFormFunc}) {

    return (
        <div className="container">
            <Typography variant={'caption'} style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                fontFamily: '-moz-initial',
            }}>
                ADMISSION FORM
            </Typography>
            <div className={'d-flex justify-content-end mt-4 mb-4'}>
                <Button
                    variant="contained"
                    endIcon={<Add/>}
                    sx={{
                        width: '20%',
                        height: '5vh'
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

export default function AdmissionForm() {
    const [forms, setForms] = useState([]);
    const [modal, setModal] = useState({
        isOpen: false,
        type: ''
    });

    const [selectedForm, setSelectedForm] = useState(null);

    async function getFormList() {
        const response = await getForms()
        if (response && response.success) {
            return response.data;
        }
    }

    console.log(selectedForm);

    useEffect(() => {
        getFormList().then(res => setForms(res))
    }, []) // chay lan dau tien

    const handleOpenModal = (type) => {
        setModal({...modal, isOpen: true, type: type});
    };

    const handleCloseModal = () => {
        setModal({...modal, isOpen: false, type: ''});
    };

    const handleSetSelectedForm = (selectedForm) => {
        setSelectedForm(selectedForm);
    }

    return (
        <>
            <RenderPage
                forms={forms}
                openFormModelFunc={() => handleOpenModal('form')}
                openDetailModalFunc={() => handleOpenModal('detail')}
                setSelectedFormFunc={handleSetSelectedForm}
            />
            {
                modal.isOpen && modal.type === 'form' &&
                <RenderForm isModalOpened={open} handleCloseFunc={handleCloseModal}/> // condition de ko thi mean = true and component
            }

            {
                modal.isOpen && modal.type === 'detail' &&
                <RenderDetail isModalOpened={open} handleCloseFunc={handleCloseModal} formData={selectedForm}/> // condition de ko thi mean = true and component
            }
        </>

    )
}