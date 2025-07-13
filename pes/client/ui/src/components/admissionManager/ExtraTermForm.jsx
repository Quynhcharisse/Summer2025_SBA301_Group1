import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    Tooltip,
} from "@mui/material";
import {Info} from "@mui/icons-material";
import {useState} from "react";
import {createExtraTerm} from "../../services/AdmissionService.jsx";
import {enqueueSnackbar} from "notistack";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

// Helper function to format date for Java backend
const formatToJavaDateTime = (date) => {
    if (!date) return null;
    return date.toISOString();
};

export default function ExtraTermForm({formData, onClose}) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleExtraTermSubmit = async () => {
        try {
            if (!formData || !formData.id) {
                enqueueSnackbar('Invalid term selected', { variant: 'error' });
                return;
            }

            if (!startDate || !endDate) {
                enqueueSnackbar('Please select both start and end dates', { variant: 'error' });
                return;
            }

            const requestData = {
                termId: formData.id,
                startDate: formatToJavaDateTime(startDate),
                endDate: formatToJavaDateTime(endDate),
                maxNumberRegistration: formData.maxNumberRegistration - formData.approvedForm
            };

            const response = await createExtraTerm(requestData);

            if (response.success) {
                enqueueSnackbar('Extra term created successfully', { variant: 'success' });
                onClose();
            } else {
                enqueueSnackbar(response.message || 'Failed to create extra term', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to create extra term', { variant: 'error' });
        }
    };

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
    };

    // Function to generate extra term name
    const generateExtraTermName = (term) => {
        return `Extra Term - ${term.grade} ${term.year}`;
    };

    return (
        <Box sx={{ 
            p: 3, 
            bgcolor: '#f8faf8',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            mt: 3
        }}>
            <Typography variant="subtitle1" sx={{ 
                mb: 3, 
                color: '#07663a', 
                fontWeight: 600,
                borderBottom: '1px solid #e0e0e0',
                pb: 1
            }}>
                {generateExtraTermName(formData)}
            </Typography>

            <Stack spacing={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                                error: !startDate
                            }
                        }}
                    />
                    <DateTimePicker
                        label="End Date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                                error: !endDate
                            }
                        }}
                    />
                </LocalizationProvider>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: 'white',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                }}>
                    <Typography variant="body2" color="textSecondary">
                        Maximum Registration: 
                        <Box component="span" sx={{ 
                            color: '#07663a',
                            fontWeight: 600,
                            ml: 1
                        }}>
                            {formData.maxNumberRegistration - formData.approvedForm} slots
                        </Box>
                    </Typography>
                    <Tooltip title="This is the remaining slots from the main term">
                        <Info fontSize="small" sx={{ color: '#666' }} />
                    </Tooltip>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button 
                        onClick={onClose}
                        variant="outlined"
                        sx={{ 
                            flex: 1,
                            color: '#07663a',
                            borderColor: '#07663a',
                            '&:hover': {
                                borderColor: '#07663a',
                                backgroundColor: 'rgba(7, 102, 58, 0.1)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleExtraTermSubmit}
                        variant="contained"
                        sx={{ 
                            flex: 1,
                            backgroundColor: '#07663a',
                            '&:hover': {
                                backgroundColor: 'rgba(7, 102, 58, 0.85)'
                            }
                        }}
                    >
                        Create
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
} 