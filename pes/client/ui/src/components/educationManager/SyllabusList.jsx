import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Skeleton,
    Stack,
    Typography
} from '@mui/material';
import {Add, Delete, Edit, Info} from '@mui/icons-material';
import {DataGrid} from '@mui/x-data-grid';
import {enqueueSnackbar} from 'notistack';
import SyllabusForm from "./SyllabusForm.jsx";
import {getAllSyllabi, removeSyllabus} from "../../services/EducationService.jsx";
import { useNavigate } from 'react-router-dom';

export default function SyllabusList() {
    const navigate = useNavigate();
    const [syllabi, setSyllabi] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [currentSyllabus, setCurrentSyllabus] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [syllabusToDelete, setSyllabusToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            setLoading(true);
            const response = await getAllSyllabi();
            const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setSyllabi(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Failed to load syllabi', {variant: 'error'});
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async (id) => {
        try {
            const response = await removeSyllabus(id);
            if (!response.data) {
                enqueueSnackbar("Syllabus not found!", {variant: 'error'});
                return;
            }
            await fetchSyllabus();
            enqueueSnackbar("Syllabus deleted successfully!", {variant: 'success'});
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar("Syllabus deletion failed!", {variant: 'error'});
        } finally {
            setDeleteDialogOpen(false);
            setSyllabusToDelete(null);
        }
    };

    const handleDeleteClick = (syllabus) => {
        // Prevent delete for skeleton rows
        if (!syllabus || !syllabus.id || syllabus.id.toString().startsWith('skeleton-')) {
            return;
        }
        setSyllabusToDelete(syllabus);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSyllabusToDelete(null);
    };

    const handleViewDetails = (syllabus) => {
        // Prevent navigation for skeleton rows
        if (!syllabus || !syllabus.id || syllabus.id.toString().startsWith('skeleton-')) {
            return;
        }
        navigate(`/education/syllabus/${syllabus.id}`);
    };

    const openAddForm = () => {
        setIsEditMode(false);
        setCurrentSyllabus(null);
        setFormOpen(true);
    };

    const openEditForm = (syllabus) => {
        // Prevent edit for skeleton rows
        if (!syllabus || !syllabus.id || syllabus.id.toString().startsWith('skeleton-')) {
            return;
        }
        setIsEditMode(true);
        setCurrentSyllabus(syllabus);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setCurrentSyllabus(null);
        fetchSyllabus();
    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center'},
        {field: 'title', headerName: 'Title', flex: 1, minWidth: 180, headerAlign: 'center'},
        {field: 'description', headerName: 'Description', flex: 2, minWidth: 250, headerAlign: 'center'},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => {
                // Show skeleton for loading rows
                if (params.row.id && params.row.id.toString().startsWith('skeleton-')) {
                    return <Skeleton variant="rectangular" width={150} height={32} />;
                }
                
                return (
                    <Stack direction="row" spacing={1}>
                        <IconButton
                            color="primary"
                            onClick={() => handleViewDetails(params.row)}
                            title="View Details"
                        >
                            <Info color="primary"/>
                        </IconButton>
                        <IconButton
                            color="info"
                            onClick={() => openEditForm(params.row)}
                            title="Edit Syllabus"
                        >
                            <Edit color="info"/>
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(params.row)}
                            title="Delete Syllabus"
                        >
                            <Delete color="error"/>
                        </IconButton>
                    </Stack>
                );
            }
        }
    ];

    // Create skeleton data for loading state
    const createSkeletonRows = () => {
        return Array(5).fill(0).map((_, index) => ({
            id: `skeleton-${index}`,
            title: `Loading...`,
            description: `Loading syllabus description...`
        }));
    };

    return (
        <Box sx={{p: 3}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h5" fontWeight="bold">
                    Manage Syllabus
                </Typography>
                <Button
                    startIcon={<Add/>}
                    variant="contained"
                    color="primary"
                    onClick={openAddForm}
                >
                    Add new syllabus
                </Button>
            </Box>
            <Paper sx={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={loading ? createSkeletonRows() : syllabi}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    getRowId={(row) => row?.id || Math.random()}
                    sx={{
                        '& .MuiDataGrid-header': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-cell': {
                            display: 'flex',
                            alignItems: 'center'
                        }
                    }}
                />
            </Paper>

            <SyllabusForm
                open={formOpen}
                onClose={closeForm}
                syllabus={currentSyllabus}
                isEdit={isEditMode}
            />

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete the syllabus "{syllabusToDelete?.title}"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDeleteConfirm(syllabusToDelete?.id)} color="error" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
