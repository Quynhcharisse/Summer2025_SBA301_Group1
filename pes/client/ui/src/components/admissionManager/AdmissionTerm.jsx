import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Paper,
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
    Tooltip,
    Typography
} from "@mui/material";
import {Add, Close, Edit, Visibility} from '@mui/icons-material';
import {useEffect, useState} from "react";
import Radio from '@mui/material/Radio';
import {createTerm, getTermList, updateTerm} from "../../services/AdmissionService.jsx";
import {useSnackbar} from "notistack";
import { format } from 'date-fns';
import '../../styles/admissionManager/AdmissionTerm.css'

function RenderTable({openDetailPopUpFunc, terms, HandleSelectedTerm}) {

    const [page, setPage] = useState(0); // Trang hiện tại
    const [rowsPerPage, setRowsPerPage] = useState(5); //số dòng trang

    console.log('Terms: ', terms)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (term, type) => {
        // Xử lý khi người dùng click vào nút "Detail"
        HandleSelectedTerm(term)
        openDetailPopUpFunc(type); //truyền type 'view' hoặc 'edit'
    }

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
                            <TableCell>No</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Max number registration</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {terms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((term, index) => (
                                <TableRow key={term.id}>
                                    <TableCell align="center" sx={{minWidth: 80}}>{index + 1}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>{term.grade}</TableCell>
                                    <TableCell align="center"
                                               sx={{minWidth: 160}}>{term.maxNumberRegistration}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>{term.year}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 120}}>{term.status}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 80}}>
                                        <Tooltip title="View">
                                            <IconButton
                                                color="info"
                                                onClick={() => handleDetailClick(term, 'view')}
                                                sx={{mr: 1, backgroundColor: '#2c3e50'}}
                                            >
                                                <Visibility/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Update">
                                            <IconButton
                                                color={'error'}
                                                onClick={() => handleDetailClick(term, 'edit')}
                                                sx={{backgroundColor: '#2c3e50'}}
                                            >
                                                <Edit/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15]}
                count={terms?.length} //phải là list.length
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedTerm, GetTerm, mode}) {

    const isViewMode = mode === 'view'; // TRUE nếu đang xem

    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        grade: null,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
    });

    //Đồng bộ formData từ selectedTerm
    useEffect(() => {
        console.log("selectedTerm: ", selectedTerm);
        if (selectedTerm) {
            setFormData({
                grade: selectedTerm.grade ?? '',
                startDate: selectedTerm.startDate
                    ? format(new Date(selectedTerm.startDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                endDate: selectedTerm.endDate
                    ? format(new Date(selectedTerm.endDate), "yyyy-MM-dd'T'HH:mm")
                    : '',
                maxNumberRegistration: selectedTerm.maxNumberRegistration ?? 0,
            });
        }
    }, [selectedTerm]);


    const handleUpdateTerm = async () => {
        try {
            const response = await updateTerm(
                selectedTerm.id,
                formData.grade,
                formData.startDate,
                formData.endDate,
                formData.maxNumberRegistration,
            );
            enqueueSnackbar("Term updated successfully!", {variant: "success"});
            handleClosePopUp();
            GetTerm();
        } catch (error) {
            enqueueSnackbar("Failed to update term", {variant: "error"});
        }
    };

    // hàm cập nhật liên tục, onChange sẽ đc gọi, môix khi có thông tin thay đổi
    function HandleOnChange(e) {
        console.log('e.target.name: ', e.target.name)
        console.log('e.target.value: ', e.target.value)
        setFormData({...formData, [e.target.name]: e.target.value})
    }


    return (
        <Dialog
            maxWidth={'md'}
            fullWidth
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative', backgroundColor: '#2c3e50'}}>
                <Toolbar>
                    <IconButton edge="start"
                                color="inherit"
                                onClick={handleClosePopUp}
                                aria-label="close">
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        Admission Term Detail
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center", color: '#2c3e50'}}
                >
                    Term Information
                </Typography>

                <Stack spacing={3}>
                    <Stack>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="startDate"
                            value={formData.startDate}
                            onChange={(e) => HandleOnChange(e)}
                            disabled={isViewMode}
                            InputLabelProps={{shrink: true}}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => HandleOnChange(e)}
                            disabled={isViewMode}
                            required
                            fullWidth
                        />
                    </Stack>
                </Stack>
            </Box>
            <DialogActions sx={{justifyContent: 'flex-end', px: 4, py: 3, gap: '1rem'}}>
                <Button
                    sx={{minWidth: 120, height: '44px'}}
                    variant="contained"
                    color="warning"
                    onClick={handleClosePopUp}
                >
                    Close
                </Button>

                {/* Chỉ hiện nếu không phải chế độ view */}
                {!isViewMode && (
                    <Button
                        sx={{minWidth: 120, height: '44px'}}
                        variant="contained"
                        color="success"
                        onClick={handleUpdateTerm}
                    >
                        Update
                    </Button>
                )}

            </DialogActions>

        </Dialog>

    )
}

function RenderFormPopUp({isPopUpOpen, handleClosePopUp, GetTerm}) {

    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        grade: null,
        startDate: null,
        endDate: null,
        maxNumberRegistration: 0,
        reservationFee: 0,
        serviceFee: 0,
        uniformFee: 0,
        learningMaterialFee: 0,
        facilityFee: 0
    });


    const handleCreate = async (
        formData
    ) => {
        const response = await createTerm(
            formData.grade,
            formData.startDate,
            formData.endDate,
            formData.maxNumberRegistration,
            formData.reservationFee,
            formData.serviceFee,
            formData.uniformFee,
            formData.learningMaterialFee,
            formData.facilityFee
        );

        if (response.success) {
            enqueueSnackbar("Term created successfully!", {variant: "success"});
            handleClosePopUp();
            GetTerm(); // reload list
        } else {
            enqueueSnackbar(response.message || "Failed to create term", {variant: "error"});
        }
    };

    console.log("Form data: ", formData)

    // hàm cập nhật liên tục, onChange sẽ đc gọi, môix khi có thông tin thay đổi
    function HandleOnChange(e) {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    return (
        <Dialog open={isPopUpOpen} onClose={handleClosePopUp} maxWidth="sm" fullWidth>
            <DialogTitle sx={{fontWeight: 'bold', fontSize: 26, color: '#2c3e50'}}>
                Create New Term
            </DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <FormControl sx={{pl: 1}}>
                        <FormLabel

                            sx={{
                                color: '#2c3e50 !important',
                                '&.Mui-focused': {
                                    color: '#2c3e50 !important'
                                }
                            }}>Grade</FormLabel>
                        <RadioGroup
                            row
                            name="grade"
                            value={formData.grade}
                            onChange={(e) => HandleOnChange(e)}
                        >
                            <FormControlLabel value="seed" control={<Radio sx={{
                                color: '#2c3e50',
                                '&.Mui-checked': {
                                    color: '#2c3e50',
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                }
                            }}
                            />} label="Seed"/>
                            <FormControlLabel value="bud" control={<Radio sx={{
                                color: '#2c3e50',
                                '&.Mui-checked': {
                                    color: '#2c3e50',
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                }
                            }}/>} label="Bud"/>
                            <FormControlLabel value="leaf" control={<Radio sx={{
                                color: '#2c3e50',
                                '&.Mui-checked': {
                                    color: '#2c3e50',
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                }
                            }}/>} label="Leaf"/>
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={(e) => HandleOnChange(e)}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c3e50',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c3e50',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c3e50',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            required
                            fullWidth
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => HandleOnChange(e)}
                            InputLabelProps={{shrink: true}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '& fieldset': {
                                        borderColor: '#2c3e50',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#2c3e50',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2c3e50',
                                        boxShadow: '0 0 0 2px #eaf3ed'
                                    },
                                }
                            }}
                        />
                    </Box>

                    <TextField
                        label="Max Registrations"
                        type="number"
                        required
                        fullWidth
                        name="maxNumberRegistration"
                        value={formData.maxNumberRegistration}
                        onChange={(e) => HandleOnChange(e)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: '#2c3e50',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#2c3e50',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2c3e50',
                                    boxShadow: '0 0 0 2px #eaf3ed'
                                },
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{pb: 3, pr: 3}}>
                <Button
                    onClick={handleClosePopUp}
                    variant="outlined"
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: 18,
                        px: 4,
                        color: '#2c3e50',
                        borderColor: '#2c3e50',
                        '&:hover': {backgroundColor: '#eaf3ed', borderColor: '#2c3e50'}
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: 18,
                        px: 4,
                        backgroundColor: '#2c3e50',
                        '&:hover': {backgroundColor: '#2c3e50'}
                    }}
                    onClick={() => handleCreate(formData)}
                >
                    Save Change
                </Button>
            </DialogActions>
        </Dialog>
    )
}


function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, terms, HandleSelectedTerm}) {
    return (
        <div className="container">
            {/*1.tiêu đề */}
            <Box sx={{mt: 2, mb: 2}}>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        textAlign: 'center',
                        fontFamily: 'inherit',
                        letterSpacing: 1,
                        mb: 1,
                        color: '#2c3e50'
                    }}
                >
                    Term Admission
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 500,
                        fontFamily: 'inherit'
                    }}
                >
                    Manage the terms for student admission
                </Typography>
            </Box>

            {/*2. button create new term */}
            <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
                <Button
                    variant="contained"
                    endIcon={<Add/>}
                    onClick={openFormPopUpFunc}
                    sx={{
                        minWidth: 180,
                        height: 44,
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: 14,
                        backgroundColor: '#2c3e50',
                        boxShadow: 2,
                        mr: {xs: 0, md: 2}
                    }}
                >
                    Create new term
                </Button>
            </Box>

            {/*3. cần 1 bảng để hiện list */}
            <RenderTable
                terms={terms}
                openDetailPopUpFunc={openDetailPopUpFunc}
                HandleSelectedTerm={HandleSelectedTerm}
            />
        </div>
    )
}


export default function AdmissionTerm() {
    const [popUp, setPopUp] = useState({
        open: false,
        type: '', // 'view' or 'update'
        term: null
    });

    const handleOpenPopUp = (type) => {
        setPopUp({...popUp, isOpen: true, type: type})
    }

    const handleClosePopUp = () => {
        setPopUp({...popUp, isOpen: false, type: ''})
        GetTerm(); //gọi lại api để cập nhật data
    }

    //tạo useState data của BE để sài (dành cho form)
    const [data, setData] = useState({
        terms: [],
    })

    const [selectedTerm, setSelectedTerm] = useState(null) // tuong trung cho 1 cai selected

    function HandleSelectedTerm(term) {
        setSelectedTerm(term)
    }

    //useEffcet sẽ chạy lần đầu tiên, or sẽ chạy khi có thay đổi
    useEffect(() => {
        //lấy data lên và lưu data vào getForm
        GetTerm()
    }, []);

    //gọi API form list //save trực tiếp data
    async function GetTerm() {
        const response = await getTermList()
        if (response && response.success) {
            setData({
                ...data,
                terms: response.data
            })
        }
    }

    return (
        <>
            <RenderPage
                terms={data.terms}
                openFormPopUpFunc={() => handleOpenPopUp('form')}
                openDetailPopUpFunc={(type) => handleOpenPopUp(type)}
                HandleSelectedTerm={HandleSelectedTerm}
            />

            {
                popUp.isOpen && popUp.type === 'form' &&
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    GetTerm={GetTerm}
                />
            }
            {
                popUp.isOpen && (popUp.type === 'view' || popUp.isOpen && popUp.type === 'edit') &&
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedTerm={selectedTerm}
                    GetTerm={GetTerm}
                    mode={popUp.type}
                />
            }
        </>
    );
}