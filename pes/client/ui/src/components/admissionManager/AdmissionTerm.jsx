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
    const isViewMode = mode === 'view';
    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        grade: '',
        startDate: '',
        endDate: '',
        maxNumberRegistration: 0
    });

    useEffect(() => {
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

    // Validate form trước khi update
    const validateUpdateForm = () => {
        // Check if term is not INACTIVE
        if (selectedTerm.status !== 'INACTIVE_TERM') {
            enqueueSnackbar("Only inactive terms can be updated", {variant: "error"});
            return false;
        }

        // 1. Validate các field required
        if (!formData.startDate) {
            enqueueSnackbar("Please select start date", {variant: "error"});
            return false;
        }
        if (!formData.endDate) {
            enqueueSnackbar("Please select end date", {variant: "error"});
            return false;
        }
        if (!formData.maxNumberRegistration || formData.maxNumberRegistration <= 0) {
            enqueueSnackbar("Max number registration must be greater than 0", {variant: "error"});
            return false;
        }

        // 2. Validate thời gian
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const now = new Date();

        if (startDate < now) {
            enqueueSnackbar("Start date must be in the future", {variant: "error"});
            return false;
        }

        if (endDate <= startDate) {
            enqueueSnackbar("End date must be after start date", {variant: "error"});
            return false;
        }

        return true;
    };

    const handleUpdateTerm = async () => {
        try {
            // Validate form trước
            if (!validateUpdateForm()) {
                return;
            }

            const response = await updateTerm(
                selectedTerm.id,
                formData.grade,
                formData.startDate,
                formData.endDate,
                formData.maxNumberRegistration
            );

            if (response.success) {
                enqueueSnackbar("Term updated successfully!", {variant: "success"});
                handleClosePopUp();
                GetTerm();
            } else {
                // Xử lý các lỗi từ BE
                if (response.message.includes("overlaps")) {
                    enqueueSnackbar("Time period overlaps with another term of the same grade", {variant: "error"});
                } else if (response.message.includes("inactive")) {
                    enqueueSnackbar("Only inactive terms can be updated", {variant: "error"});
                } else {
                    enqueueSnackbar(response.message || "Failed to update term", {variant: "error"});
                }
            }
        } catch (error) {
            enqueueSnackbar("An error occurred while updating the term", {variant: "error"});
        }
    };

    function HandleOnChange(e) {
        const {name, value} = e.target;
        
        // Validate maxNumberRegistration khi nhập
        if (name === "maxNumberRegistration") {
            const numValue = parseInt(value);
            if (numValue <= 0) {
                enqueueSnackbar("Max number registration must be greater than 0", {variant: "warning"});
            }
        }

        setFormData({...formData, [name]: value});
    }

    return (
        <Dialog maxWidth={'md'} fullWidth open={isPopUpOpen} onClose={handleClosePopUp}>
            <AppBar sx={{position: 'relative', backgroundColor: '#2c3e50'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClosePopUp}
                        aria-label="close"
                    >
                        <Close/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        {isViewMode ? 'View Term Detail' : 'Update Term'}
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
                            label="Start Date *"
                            type="datetime-local"
                            required
                            fullWidth
                            name="startDate"
                            value={formData.startDate}
                            onChange={HandleOnChange}
                            disabled={isViewMode}
                            InputLabelProps={{shrink: true}}
                            helperText={!isViewMode && "Start date must be in the future"}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="End Date *"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={HandleOnChange}
                            disabled={isViewMode}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            helperText={!isViewMode && "End date must be after start date"}
                        />
                    </Stack>
                    <Stack>
                        <TextField
                            label="Max Registrations *"
                            type="number"
                            required
                            fullWidth
                            name="maxNumberRegistration"
                            value={formData.maxNumberRegistration}
                            onChange={HandleOnChange}
                            disabled={isViewMode}
                            inputProps={{ min: 1 }}
                            helperText={!isViewMode && "Must be greater than 0"}
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

                {!isViewMode && (
                    <Button
                        sx={{minWidth: 120, height: '44px'}}
                        variant="contained"
                        color="success"
                        onClick={handleUpdateTerm}
                        disabled={selectedTerm?.status !== 'INACTIVE_TERM'}
                    >
                        Update
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

function RenderFormPopUp({isPopUpOpen, handleClosePopUp, GetTerm}) {
    const {enqueueSnackbar} = useSnackbar();
    const currentYear = new Date().getFullYear();

    const [formData, setFormData] = useState({
        grade: '',
        startDate: '',
        endDate: '',
        maxNumberRegistration: 0
    });

    // Validate form trước khi gửi request
    const validateForm = () => {
        // 1. Check các field required
        if (!formData.grade) {
            enqueueSnackbar("Please select a grade", {variant: "error"});
            return false;
        }
        if (!formData.startDate) {
            enqueueSnackbar("Please select start date", {variant: "error"});
            return false;
        }
        if (!formData.endDate) {
            enqueueSnackbar("Please select end date", {variant: "error"});
            return false;
        }
        if (!formData.maxNumberRegistration || formData.maxNumberRegistration <= 0) {
            enqueueSnackbar("Max number registration must be greater than 0", {variant: "error"});
            return false;
        }

        // 2. Validate thời gian
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const now = new Date();

        if (startDate < now) {
            enqueueSnackbar("Start date must be in the future", {variant: "error"});
            return false;
        }

        if (endDate <= startDate) {
            enqueueSnackbar("End date must be after start date", {variant: "error"});
            return false;
        }

        return true;
    };

    const handleCreate = async () => {
        try {
            // Validate form trước
            if (!validateForm()) {
                return;
            }

            const response = await createTerm(
                formData.grade,
                formData.startDate,
                formData.endDate,
                formData.maxNumberRegistration
            );

            if (response.success) {
                enqueueSnackbar("Term created successfully!", {variant: "success"});
                handleClosePopUp();
                GetTerm();
            } else {
                // Xử lý các lỗi từ BE trả về
                if (response.message.includes("already exists")) {
                    enqueueSnackbar(`A term for grade ${formData.grade} already exists in ${currentYear}`, {variant: "error"});
                } else if (response.message.includes("overlaps")) {
                    enqueueSnackbar("Time period overlaps with another term of the same grade", {variant: "error"});
                } else {
                    enqueueSnackbar(response.message || "Failed to create term", {variant: "error"});
                }
            }
        } catch (error) {
            enqueueSnackbar("An error occurred while creating the term", {variant: "error"});
        }
    };

    function HandleOnChange(e) {
        const {name, value} = e.target;
        
        // Validate maxNumberRegistration khi nhập
        if (name === "maxNumberRegistration") {
            const numValue = parseInt(value);
            if (numValue <= 0) {
                enqueueSnackbar("Max number registration must be greater than 0", {variant: "warning"});
            }
        }

        setFormData({...formData, [name]: value});
    }

    return (
        <Dialog open={isPopUpOpen} onClose={handleClosePopUp} maxWidth="sm" fullWidth>
            <DialogTitle sx={{fontWeight: 'bold', fontSize: 26, color: '#2c3e50'}}>
                Create New Term
            </DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <FormControl sx={{pl: 1}}>
                        <FormLabel sx={{
                            color: '#2c3e50 !important',
                            '&.Mui-focused': {color: '#2c3e50 !important'}
                        }}>
                            Grade *
                        </FormLabel>
                        <RadioGroup
                            row
                            name="grade"
                            value={formData.grade}
                            onChange={HandleOnChange}
                        >
                            <FormControlLabel value="seed" control={<Radio />} label="Seed"/>
                            <FormControlLabel value="bud" control={<Radio />} label="Bud"/>
                            <FormControlLabel value="leaf" control={<Radio />} label="Leaf"/>
                        </RadioGroup>
                    </FormControl>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <TextField
                            label="Start Date *"
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={HandleOnChange}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            helperText="Start date must be in the future"
                        />
                        <TextField
                            label="End Date *"
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={HandleOnChange}
                            required
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            helperText="End date must be after start date"
                        />
                    </Box>

                    <TextField
                        label="Max Registrations *"
                        type="number"
                        required
                        fullWidth
                        name="maxNumberRegistration"
                        value={formData.maxNumberRegistration}
                        onChange={HandleOnChange}
                        inputProps={{ min: 1 }}
                        helperText="Must be greater than 0"
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
                    onClick={handleCreate}
                >
                    Create Term
                </Button>
            </DialogActions>
        </Dialog>
    );
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