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
    Stack,
    Typography
} from '@mui/material';
import {Add, Delete, Edit} from '@mui/icons-material';
import {DataGrid} from '@mui/x-data-grid';
import {enqueueSnackbar} from 'notistack';
import SyllabusForm from "./SyllabusForm.jsx";
import {getAllSyllabi, removeSyllabus} from "../../services/EducationService.jsx";

export default function SyllabusList() {
    const [syllabi, setSyllabi] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [currentSyllabus, setCurrentSyllabus] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [syllabusToDelete, setSyllabusToDelete] = useState(null);

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            const response = await getAllSyllabi();
            const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setSyllabi(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Failed to load syllabi', {variant: 'error'});
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
        setSyllabusToDelete(syllabus);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSyllabusToDelete(null);
    };

    const openAddForm = () => {
        setIsEditMode(false);
        setCurrentSyllabus(null);
        setFormOpen(true);
    };

    const openEditForm = (syllabus) => {
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
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            minWidth: 180,
            headerAlign: 'center'
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 250,
            headerAlign: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="primary"
                        onClick={() => openEditForm(params.row)}
                    >
                        <Edit color="primary"/>
                    </IconButton>
                </Stack>
            )
        }
    ];

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
                <IconButton
                    color="error"
                    onClick={() => {
                        handleDeleteClick()
                    }}
                >
                    <Delete/>
                </IconButton>
            </Box>
            <Paper sx={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={syllabi}
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
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
