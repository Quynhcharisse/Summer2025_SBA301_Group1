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
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    RadioGroup,
    Select,
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
import {Add, Close, Visibility} from '@mui/icons-material';
import {useEffect, useState} from "react";
import Radio from '@mui/material/Radio';
import {createTerm, getTermList} from "../../services/AdmissionService.jsx";
import {useSnackbar} from "notistack";
import '../../styles/admissionManager/AdmissionTerm.css'
import {ValidateTermFormData} from "../validation/ValidateTermFormData.jsx";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import ExtraTermForm from "./ExtraTermForm.jsx";

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
                                                <Visibility color={"success"}/>
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
        maxNumberRegistration: 0,
        approvedForm: 0,
        description: ''
    });

    const [showExtraTermForm, setShowExtraTermForm] = useState(false);

    useEffect(() => {
        if (selectedTerm) {
            setFormData({
                name: selectedTerm.name ?? '',
                startDate: selectedTerm.startDate ? new Date(selectedTerm.startDate) : null,
                endDate: selectedTerm.endDate ? new Date(selectedTerm.endDate) : null,
                grade: selectedTerm.grade ?? '',
                maxNumberRegistration: selectedTerm.maxNumberRegistration ?? 0,
                approvedForm: selectedTerm.approvedForm ?? 0,
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

    const canAddExtraTerm = selectedTerm?.status === 'locked' && 
                           selectedTerm?.approvedForm < selectedTerm?.maxNumberRegistration;

    return (
        <Dialog
            open={isPopUpOpen}
            onClose={handleClosePopUp}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    bgcolor: '#07663a',
                    color: 'white',
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.5px' }}>
                        Term Details
                    </Typography>
                    <Box sx={{
                        backgroundColor: getStatusColor(selectedTerm?.status),
                        padding: '6px 16px',
                        borderRadius: '30px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                        <Typography sx={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {selectedTerm?.status}
                        </Typography>
                    </Box>
                </Box>
                <IconButton 
                                onClick={handleClosePopUp}
                    sx={{ 
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    <Close />
                    </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4, bgcolor: '#f8faf8' }}>
                <Grid container spacing={3}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                border: '1px solid #e0e0e0',
                                borderRadius: '16px',
                                bgcolor: '#fff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }
                            }}
                        >
                <Typography
                                variant="h6" 
                                sx={{ 
                                    color: '#07663a',
                                    fontWeight: 600,
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                Basic Information
                </Typography>

                            <Grid container spacing={3}>
                                {/* Name and Grade Row */}
                                <Grid item xs={12} sm={8}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: '#f8faf8',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        height: '100%'
                                    }}>
                                        <Typography sx={{ 
                                            fontWeight: 600, 
                                            width: 120,
                                            color: '#666',
                                            position: 'relative',
                                            '&::after': {
                                                content: '":"',
                                                position: 'absolute',
                                                right: '16px'
                                            }
                                        }}>
                                            Name
                                        </Typography>
                                        <Typography sx={{ 
                                            flex: 1,
                                            color: '#2c3e50',
                                            fontWeight: 500
                                        }}>
                                            {formData.name}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: '#f8faf8',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        height: '100%'
                                    }}>
                                        <Typography sx={{ 
                                            fontWeight: 600, 
                                            width: 120,
                                            color: '#666',
                                            position: 'relative',
                                            '&::after': {
                                                content: '":"',
                                                position: 'absolute',
                                                right: '16px'
                                            }
                                        }}>
                                            Grade
                                        </Typography>
                                        <Typography sx={{ 
                                            flex: 1,
                                            color: '#2c3e50',
                                            fontWeight: 500,
                                            textTransform: 'capitalize'
                                        }}>
                                            {formData.grade?.toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Start Date and End Date Row */}
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: '#f8faf8',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        height: '100%'
                                    }}>
                                        <Typography sx={{ 
                                            fontWeight: 600, 
                                            width: 120,
                                            color: '#666',
                                            position: 'relative',
                                            '&::after': {
                                                content: '":"',
                                                position: 'absolute',
                                                right: '16px'
                                            }
                                        }}>
                                            Start Date
                                        </Typography>
                                        <Typography sx={{ 
                                            flex: 1,
                                            color: '#2c3e50',
                                            fontWeight: 500
                                        }}>
                                            {formData.startDate ? (
                                                <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 600 }}>{dayjs(formData.startDate).format('DD/MM/YYYY')}</span>
                                                    <span style={{ color: '#666' }}>at</span>
                                                    <span>{dayjs(formData.startDate).format('HH:mm')}</span>
                                                </Box>
                                            ) : '-'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: '#f8faf8',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0',
                                        height: '100%'
                                    }}>
                                        <Typography sx={{ 
                                            fontWeight: 600, 
                                            width: 120,
                                            color: '#666',
                                            position: 'relative',
                                            '&::after': {
                                                content: '":"',
                                                position: 'absolute',
                                                right: '16px'
                                            }
                                        }}>
                                            End Date
                                        </Typography>
                                        <Typography sx={{ 
                                            flex: 1,
                                            color: '#2c3e50',
                                            fontWeight: 500
                                        }}>
                                            {formData.endDate ? (
                                                <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 600 }}>{dayjs(formData.endDate).format('DD/MM/YYYY')}</span>
                                                    <span style={{ color: '#666' }}>at</span>
                                                    <span>{dayjs(formData.endDate).format('HH:mm')}</span>
                                                </Box>
                                            ) : '-'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Registration Row */}
                                <Grid item xs={12}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: '#f8faf8',
                                        borderRadius: '12px',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <Typography sx={{ 
                                            fontWeight: 600, 
                                            width: 120,
                                            color: '#666',
                                            position: 'relative',
                                            '&::after': {
                                                content: '":"',
                                                position: 'absolute',
                                                right: '16px'
                                            }
                                        }}>
                                            Registration
                                        </Typography>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            flex: 1
                                        }}>
                                            <Typography sx={{ 
                                                color: formData.approvedForm >= formData.maxNumberRegistration ? '#d32f2f' : '#07663a',
                                                fontWeight: 700,
                                                fontSize: '1.1rem'
                                            }}>
                                                {formData.approvedForm}
                                            </Typography>
                                            <Typography sx={{ color: '#666' }}>/</Typography>
                                            <Typography sx={{ 
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                color: '#2c3e50'
                                            }}>
                                                {formData.maxNumberRegistration}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Extra Terms Section */}
                    <Grid item xs={12}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                bgcolor: 'white',
                                borderRadius: '12px',
                                p: 3,
                                mt: 2
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Typography variant="h6" sx={{ color: '#07663a', fontWeight: 600 }}>
                                    Extra Terms
                                </Typography>
                                {canAddExtraTerm && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setShowExtraTermForm(true)}
                                        sx={{
                                            bgcolor: '#07663a',
                                            '&:hover': {
                                                bgcolor: '#07663a',
                                                opacity: 0.9
                                            }
                                        }}
                                    >
                                        Add Extra Term
                                    </Button>
                                )}
                            </Box>

                            {selectedTerm?.extraTerms && selectedTerm.extraTerms.length > 0 ? (
                                <TableContainer sx={{ 
                                    borderRadius: '12px', 
                                    border: '1px solid #e0e0e0',
                                    maxHeight: 300,
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                        height: '8px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        bgcolor: '#f1f1f1',
                                        borderRadius: '4px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        bgcolor: '#888',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            bgcolor: '#555'
                                        }
                                    }
                                }}>
                                    <Table stickyHeader size="medium">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        bgcolor: '#f8faf8',
                                                        color: '#07663a',
                                                        borderBottom: '2px solid #e0e0e0'
                                                    }}
                                                >
                                                    Start Date
                                                </TableCell>
                                                <TableCell 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        bgcolor: '#f8faf8',
                                                        color: '#07663a',
                                                        borderBottom: '2px solid #e0e0e0'
                                                    }}
                                                >
                                                    End Date
                                                </TableCell>
                                                <TableCell 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        bgcolor: '#f8faf8',
                                                        color: '#07663a',
                                                        borderBottom: '2px solid #e0e0e0'
                                                    }}
                                                >
                                                    Registration
                                                </TableCell>
                                                <TableCell 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        bgcolor: '#f8faf8',
                                                        color: '#07663a',
                                                        borderBottom: '2px solid #e0e0e0'
                                                    }}
                                                >
                                                    Status
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedTerm.extraTerms.map((extraTerm, index) => (
                                                <TableRow 
                                                    key={index}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { 
                                                            border: 0 
                                                        },
                                                        '&:hover': { 
                                                            bgcolor: '#f5f5f5',
                                                            transition: 'all 0.2s ease'
                                                        },
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <TableCell sx={{ color: '#2c3e50' }}>
                                                        {dayjs(extraTerm.startDate).format('DD/MM/YYYY HH:mm')}
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#2c3e50' }}>
                                                        {dayjs(extraTerm.endDate).format('DD/MM/YYYY HH:mm')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1
                                                        }}>
                                                            <Typography
                                                                sx={{
                                                                    color: extraTerm.approvedForm >= extraTerm.maxNumberRegistration ? '#d32f2f' : '#07663a',
                                                                    fontWeight: 700,
                                                                    fontSize: '0.95rem'
                                                                }}
                                                            >
                                                                {extraTerm.approvedForm}
                                                            </Typography>
                                                            <Typography sx={{ color: '#666' }}>/</Typography>
                                                            <Typography sx={{ 
                                                                fontWeight: 700,
                                                                fontSize: '0.95rem',
                                                                color: '#2c3e50'
                                                            }}>
                                                                {extraTerm.maxNumberRegistration}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{
                                                            backgroundColor: getStatusColor(extraTerm.status),
                                                            padding: '6px 16px',
                                                            borderRadius: '20px',
                                                            display: 'inline-block',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                                        }}>
                                                            <Typography sx={{
                                                                color: '#ffffff',
                                                                fontWeight: 600,
                                                                fontSize: '0.75rem',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                {extraTerm.status}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    bgcolor: '#f8faf8',
                                    borderRadius: '12px',
                                    border: '1px dashed #ccc'
                                }}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            color: '#666',
                                            fontStyle: 'italic',
                                            mb: 1
                                        }}
                                    >
                                        No extra terms available
                                    </Typography>
                                    {canAddExtraTerm && (
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: '#07663a' }}
                                        >
                                            Click the button above to add a new extra term
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            {/* Extra Term Form Dialog */}
            {showExtraTermForm && (
                <ExtraTermForm
                    formData={selectedTerm}
                    onClose={() => setShowExtraTermForm(false)}
                    getStatusColor={getStatusColor}
                />
            )}
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


    const leafMaxRegistrations = terms.filter(term => term.grade === 'LEAF').reduce((sum, term) => sum + term.maxNumberRegistration, 0);
    const leafRegistered = terms.filter(term => term.grade === 'LEAF').reduce((sum, term) => sum + (term.approvedForm || 0), 0);

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

                {/* LEAF Grade Stats */}
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
                            backgroundColor: '#3B86CB',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '16px',
                            fontWeight: 600
                        }}>
                            LEAF
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
                                    color: leafRegistered >= leafMaxRegistrations ? '#d32f2f' : '#07663a',
                                    fontWeight: 700
                                }}
                            >
                                {leafRegistered}
                            </Typography>
                            <Typography variant="h5" sx={{color: '#666'}}>/</Typography>
                            <Typography variant="h5" sx={{color: '#2c3e50', fontWeight: 700}}>
                                {leafMaxRegistrations}
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