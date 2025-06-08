import { useState, useEffect } from 'react';
import {
    Table, TableHead, TableRow, TableCell, TableBody,
    Button, Box, Typography, IconButton, Stack
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import SyllabusService from "../../services/SyllabusService.jsx";
import SyllabusForm from "./SyllabusForm.jsx";

export default function SyllabusList() {
    const [syllabi, setSyllabi] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [currentSyllabus, setCurrentSyllabus] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchSyllabus();
    }, []);

    const fetchSyllabus = async () => {
        try {
            const response = await SyllabusService.getAll();
            const sortedData = response.data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setSyllabi(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            enqueueSnackbar('Failed to load syllabi', { variant: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await SyllabusService.remove(id);
            if (!response.data) {
                enqueueSnackbar("Syllabus not found!", { variant: 'error' });
                return;
            }
            await fetchSyllabus();
            enqueueSnackbar("Syllabus deleted successfully!", { variant: 'success' });
        } catch (error) {
            console.log(error.message);
            enqueueSnackbar("Syllabus deletion failed!", { variant: 'error' });
        }
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
        fetchSyllabus(); // Refresh the list after form closes
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>Manage Syllabus</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>
                            <Button
                                startIcon={<Add />}
                                variant="contained"
                                color="primary"
                                onClick={openAddForm}
                            >
                                Add new syllabus
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {syllabi.map(item => (
                        <TableRow key={item.id}>
                            <TableCell><strong>{item.title}</strong></TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => openEditForm(item)}
                                    >
                                        <Edit />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to delete this syllabus?")) {
                                                handleDelete(item.id);
                                            }
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <SyllabusForm
                open={formOpen}
                onClose={closeForm}
                syllabus={currentSyllabus}
                isEdit={isEditMode}
            />
        </Box>
    );
}

