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
    Typography,
    Grid,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import {Add, Close, Visibility} from '@mui/icons-material';
import {useEffect, useState} from "react";
import Radio from '@mui/material/Radio';
import {createTerm, getTermList} from "../../services/AdmissionService.jsx";
import {useSnackbar} from "notistack";
import {format} from 'date-fns';
import '../../styles/admissionManager/AdmissionTerm.css'
import {ValidateTermFormData} from "../validation/ValidateTermFormData.jsx";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

function RenderTable({openDetailPopUpFunc, terms, HandleSelectedTerm}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const columns = [
        {label: 'No', minWidth: 80, align: 'center', key: 'no'},
        {label: 'Grade', minWidth: 100, align: 'center', key: 'grade'},
        {label: 'Max Number Registration', minWidth: 160, align: 'center', key: 'maxNumberRegistration'},
        {label: 'Year', minWidth: 100, align: 'center', key: 'year'},
        {label: 'Status', minWidth: 120, align: 'center', key: 'status'},
        {label: 'Action', minWidth: 80, align: 'center', key: 'action'},
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value)
        setPage(0)
    }

    const handleDetailClick = (term, type) => {
        HandleSelectedTerm(term)
        openDetailPopUpFunc(type);
    }

    console.log(terms)

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
                            {columns.map(col => (
                                <TableCell
                                    key={col.key}
                                    align={col.align}
                                    sx={{minWidth: col.minWidth, fontWeight: 'bold'}}
                                >
                                    {col.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {terms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((term, idx) => (
                                <TableRow key={term.id}>
                                    <TableCell align="center" sx={{minWidth: 80}}>{idx + 1}</TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>
                                        <Box sx={{
                                            display: 'inline-block',
                                            backgroundColor: term.grade === 'SEED'
                                                ? '#2e7d32'
                                                : term.grade === 'BUD'
                                                    ? '#ed6c02'
                                                    : '#0288d1',
                                            padding: '6px 16px',
                                            borderRadius: '16px',
                                            minWidth: '90px',
                                        }}>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                color: '#ffffff',
                                                textTransform: 'uppercase',
                                                fontSize: '0.875rem',
                                                lineHeight: '1.43',
                                                letterSpacing: '0.01071em',
                                            }}>
                                                {term.grade}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 160}}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1
                                        }}>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                color: term.approvedForm >= term.maxNumberRegistration ? '#d32f2f' : '#07663a'
                                            }}>
                                                {term.approvedForm || 0}
                                            </Typography>
                                            <Typography sx={{color: '#666'}}>/</Typography>
                                            <Typography sx={{fontWeight: 600}}>
                                                {term.maxNumberRegistration}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 100}}>{term.year}</TableCell>
                                    <TableCell align="center" sx={{
                                        minWidth: 120,
                                        fontWeight: 700,
                                        color:
                                            term.status === 'active'
                                                ? '#219653' // xanh lá
                                                : term.status === 'inactive'
                                                    ? '#bdbdbd' // xám nhạt
                                                    : term.status === 'locked'
                                                        ? '#d32f2f' // đỏ
                                                        : '#2c3e50',
                                        borderRadius: 2,
                                        letterSpacing: 1,
                                        textTransform: 'uppercase'
                                    }}>
                                        {term.status}
                                    </TableCell>
                                    <TableCell align="center" sx={{minWidth: 80}}>
                                        <Tooltip title="View">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDetailClick(term, 'view')}
                                                sx={{mr: 1}}
                                            >
                                                <Visibility/>
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
                count={terms?.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function RenderDetailPopUp({handleClosePopUp, isPopUpOpen, selectedTerm}) {
    const [formData, setFormData] = useState({
        name: '',
        startDate: null,
        endDate: null,
        grade: '',
        maxStudent: 0,
        minStudent: 0,
        description: ''
    });

    //Đồng bộ formData từ selectedTerm
    useEffect(() => {
        if (selectedTerm) {
            setFormData({
                name: selectedTerm.name ?? '',
                startDate: selectedTerm.startDate ? new Date(selectedTerm.startDate) : null,
                endDate: selectedTerm.endDate ? new Date(selectedTerm.endDate) : null,
                grade: selectedTerm.grade ?? '',
                maxStudent: selectedTerm.maxStudent ?? 0,
                minStudent: selectedTerm.minStudent ?? 0,
                description: selectedTerm.description ?? ''
            });
        }
    }, [selectedTerm]);

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'active':
                return '#219653';
            case 'inactive':
                return '#bdbdbd';
            case 'locked':
                return '#d32f2f';
            default:
                return '#2c3e50';
        }
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (field, newValue) => {
        setFormData(prev => ({
            ...prev,
            [field]: newValue
        }));
    };

    return (
        <Dialog
            fullScreen
            open={isPopUpOpen}
            onClose={handleClosePopUp}
        >
            <AppBar sx={{position: 'relative', backgroundColor: '#07663a'}}>
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
                    <Box sx={{
                        backgroundColor: getStatusColor(formData.status),
                        padding: '6px 16px',
                        borderRadius: '16px',
                        marginLeft: 2
                    }}>
                        <Typography sx={{
                            color: '#ffffff',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                        }}>
                            {formData.status}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box p={4}>
                <Typography
                    variant='subtitle1'
                    sx={{mb: 2, fontWeight: 'bold', fontSize: "2.5rem", textAlign: "center", color: '#07663a'}}
                >
                    Term Information
                </Typography>

                <Paper elevation={3} sx={{p: 3, mb: 3}}>
                    <Typography variant="h6" gutterBottom>Term Information</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                label="Start Date"
                                value={formData.startDate ? dayjs(formData.startDate) : null}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        startDate: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null
                                    }));
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth required/>}
                                format="DD/MM/YYYY HH:mm"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DateTimePicker
                                label="End Date"
                                value={formData.endDate ? dayjs(formData.endDate) : null}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        endDate: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null
                                    }));
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth required/>}
                                format="DD/MM/YYYY HH:mm"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Grade</InputLabel>
                                <Select
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    label="Grade"
                                >
                                    <MenuItem value="GRADE_3">Grade 3</MenuItem>
                                    <MenuItem value="GRADE_4">Grade 4</MenuItem>
                                    <MenuItem value="GRADE_5">Grade 5</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Maximum Students"
                                name="maxStudent"
                                type="number"
                                value={formData.maxStudent}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Minimum Students"
                                name="minStudent"
                                type="number"
                                value={formData.minStudent}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <DialogActions sx={{justifyContent: 'flex-end', px: 4, py: 3}}>
                <Button
                    sx={{minWidth: 120, height: '44px'}}
                    variant="contained"
                    color="warning"
                    onClick={handleClosePopUp}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function RenderFormPopUp({isPopUpOpen, handleClosePopUp, GetTerm, terms}) {

    const {enqueueSnackbar} = useSnackbar();

    const [formData, setFormData] = useState({
        startDate: null,
        endDate: null,
        grade: '',
        maxNumberRegistration: 0
    });

    const [error, setError] = useState('');

    const handleCreate = async (formData) => {
        const validationError = ValidateTermFormData(formData, terms);
        if (validationError) {
            setError(validationError);
            enqueueSnackbar(validationError, {variant: "warning"});
            return;
        }

        try {
            const response = await createTerm(
                formData.startDate,
                formData.endDate,
                formData.grade,
                formData.maxNumberRegistration
            );

            if (response.success) {
                enqueueSnackbar("Term created successfully", {variant: "success"});
                handleClosePopUp();
                GetTerm();
            } else {
                enqueueSnackbar(response.message || "Failed to create term", {variant: "error"});
            }
        } catch (error) {
            console.error("Error creating term:", error);
            enqueueSnackbar(error.message || "An error occurred while creating the term", {variant: "error"});
        }
    };

    const HandleOnChange = async (e) => {
        const { name, value } = e.target;
        
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Validate form data
        const validationError = ValidateTermFormData(formData, terms);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError('');
    };

    return (
        <Dialog open={isPopUpOpen}
                onClose={handleClosePopUp}
                fullScreen
        >
            <AppBar sx={{
                position: 'relative',
                backgroundColor: '#07663a'
            }}>
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
            <DialogTitle sx={{fontWeight: 'bold', fontSize: 26, color: '#2c684f'}}>
                Create New Term
            </DialogTitle>
            <DialogContent>
                <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Grade</Typography>
                        <RadioGroup
                            row
                            name="grade"
                            value={formData.grade}
                            onChange={(e) => HandleOnChange(e)}
                        >
                            <FormControlLabel
                                value="seed"
                                control={
                                    <Radio sx={{
                                        color: '#2e7d32',
                                        '&.Mui-checked': {
                                            color: '#2e7d32',
                                        }
                                    }}/>
                                }
                                label={
                                    <Box sx={{
                                        padding: '6px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: formData.grade === 'seed' ? '#2e7d32' : 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: formData.grade === 'seed' ? '#2e7d32' : 'rgba(46, 125, 50, 0.08)',
                                        },
                                    }}>
                                        <Typography sx={{
                                            color: formData.grade === 'seed' ? '#ffffff' : '#2e7d32',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            Seed
                                        </Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="bud"
                                control={
                                    <Radio sx={{
                                        color: '#ed6c02',
                                        '&.Mui-checked': {
                                            color: '#ed6c02',
                                        }
                                    }}/>
                                }
                                label={
                                    <Box sx={{
                                        padding: '6px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: formData.grade === 'bud' ? '#ed6c02' : 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: formData.grade === 'bud' ? '#ed6c02' : 'rgba(237, 108, 2, 0.08)',
                                        },
                                    }}>
                                        <Typography sx={{
                                            color: formData.grade === 'bud' ? '#ffffff' : '#ed6c02',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            Bud
                                        </Typography>
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                value="leaf"
                                control={
                                    <Radio sx={{
                                        color: '#0288d1',
                                        '&.Mui-checked': {
                                            color: '#0288d1',
                                        }
                                    }}/>
                                }
                                label={
                                    <Box sx={{
                                        padding: '6px 16px',
                                        borderRadius: '16px',
                                        backgroundColor: formData.grade === 'leaf' ? '#0288d1' : 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: formData.grade === 'leaf' ? '#0288d1' : 'rgba(2, 136, 209, 0.08)',
                                        },
                                    }}>
                                        <Typography sx={{
                                            color: formData.grade === 'leaf' ? '#ffffff' : '#0288d1',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            Leaf
                                        </Typography>
                                    </Box>
                                }
                            />
                        </RadioGroup>
                    </Box>

                    <Box sx={{display: 'flex', gap: 2, width: '30%', mt: 3}}>
                        <DateTimePicker
                            label="Start Date"
                            value={formData.startDate ? dayjs(formData.startDate) : null}
                            onChange={(newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    startDate: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null
                                }));
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth required/>}
                            format="DD/MM/YYYY HH:mm"
                        />
                        <DateTimePicker
                            label="End Date"
                            value={formData.endDate ? dayjs(formData.endDate) : null}
                            onChange={(newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    endDate: newValue ? newValue.format("YYYY-MM-DDTHH:mm:ss") : null
                                }));
                            }}
                            renderInput={(params) => <TextField {...params} fullWidth required/>}
                            format="DD/MM/YYYY HH:mm"
                        />
                    </Box>

                    <TextField
                        label="Max Registration Number"
                        type="number"
                        required
                        fullWidth
                        name="maxNumberRegistration"
                        value={formData.maxNumberRegistration}
                        onChange={(e) => HandleOnChange(e)}
                        sx={{
                            mt: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                '& fieldset': {
                                    borderColor: '#2c684f',
                                    borderWidth: 2,
                                },
                                '&:hover fieldset': {
                                    borderColor: '#2c684f',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#2c684f',
                                    boxShadow: '0 0 0 2px #eaf3ed'
                                },
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleClosePopUp}
                    sx={{
                        bgcolor: '#e67e22',
                        '&:hover': {
                            bgcolor: '#d35400'
                        },
                        px: 4
                    }}
                >
                    CANCEL
                </Button>
                <Button
                    variant="contained"
                    onClick={() => handleCreate(formData)}
                    sx={{
                        bgcolor: '#2c3e50',
                        '&:hover': {
                            bgcolor: '#1a252f'
                        },
                        px: 4
                    }}
                >
                    SAVE CHANGE
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function RenderPage({openFormPopUpFunc, openDetailPopUpFunc, terms, HandleSelectedTerm}) {
    // Calculate total registrations
    const totalMaxRegistrations = terms.reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    const totalRegistered = terms.reduce((sum, term) => sum + (term.approvedForm || 0), 0);

    // Calculate BUD and SEED registrations
    const budMaxRegistrations = terms.filter(term => term.grade === 'BUD').reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    const budRegistered = terms.filter(term => term.grade === 'BUD').reduce((sum, term) => sum + (term.approvedForm || 0), 0);

    const seedMaxRegistrations = terms.filter(term => term.grade === 'SEED').reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    const seedRegistered = terms.filter(term => term.grade === 'SEED').reduce((sum, term) => sum + (term.approvedForm || 0), 0);

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
                        color: '#07663a'
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

            {/* Registration Statistics */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 4,
                mb: 3
            }}>
                {/* BUD Grade Stats */}
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: '#f8faf8',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box sx={{
                            backgroundColor: '#ed6c02',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '16px',
                            fontWeight: 600
                        }}>
                            BUD
                        </Box>
                        <Typography variant="h6" sx={{color: '#07663a', fontWeight: 600}}>
                            Registration:
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: budRegistered >= budMaxRegistrations ? '#d32f2f' : '#07663a',
                                    fontWeight: 700
                                }}
                            >
                                {budRegistered}
                            </Typography>
                            <Typography variant="h5" sx={{color: '#666'}}>/</Typography>
                            <Typography variant="h5" sx={{color: '#2c3e50', fontWeight: 700}}>
                                {budMaxRegistrations}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* SEED Grade Stats */}
                <Paper sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: '#f8faf8',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box sx={{
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '16px',
                            fontWeight: 600
                        }}>
                            SEED
                        </Box>
                        <Typography variant="h6" sx={{color: '#07663a', fontWeight: 600}}>
                            Registration:
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    color: seedRegistered >= seedMaxRegistrations ? '#d32f2f' : '#07663a',
                                    fontWeight: 700
                                }}
                            >
                                {seedRegistered}
                            </Typography>
                            <Typography variant="h5" sx={{color: '#666'}}>/</Typography>
                            <Typography variant="h5" sx={{color: '#2c3e50', fontWeight: 700}}>
                                {seedMaxRegistrations}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
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
                        backgroundColor: '#07663a',
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


export default function TermAdmission() {
    const [popUp, setPopUp] = useState({
        isOpen: false,
        type: '', // 'form' or 'view'
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
                openDetailPopUpFunc={(type) => handleOpenPopUp('view')}
                HandleSelectedTerm={HandleSelectedTerm}
            />

            {popUp.isOpen && popUp.type === 'form' && (
                <RenderFormPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    GetTerm={GetTerm}
                    terms={data.terms}
                />
            )}
            {popUp.isOpen && popUp.type === 'view' && (
                <RenderDetailPopUp
                    isPopUpOpen={popUp.isOpen}
                    handleClosePopUp={handleClosePopUp}
                    selectedTerm={selectedTerm}
                />
            )}
        </>
    );
}