import {
    Avatar,
    Box,
    Checkbox,
    Chip,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import {
    CheckCircle,
    CheckCircleOutline,
    RemoveCircle
} from '@mui/icons-material';

/**
 * Reusable student card component for displaying student information
 * Used in both available and assigned student lists
 */
const StudentCard = ({
    student,
    isSelected,
    onClick,
    onCheckboxChange,
    variant = 'available', // 'available' or 'assigned'
    calculateAge // Function to calculate age from birth date
}) => {
    // Determine colors and icons based on variant and selection state
    const getStyles = () => {
        if (variant === 'available') {
            return {
                borderColor: isSelected ? 'primary.main' : 'transparent',
                bgcolor: isSelected ? 'primary.50' : 'background.paper',
                checkboxColor: 'primary',
                avatarColor: 'primary.main',
                icon: <CheckCircleOutline color='primary' />,
                checkedIcon: <CheckCircle color='primary' />
            };
        } else {
            return {
                borderColor: isSelected ? 'error.main' : 'transparent',
                bgcolor: isSelected ? 'error.50' : 'background.paper',
                checkboxColor: isSelected ? 'error' : 'success',
                avatarColor: isSelected ? 'error.main' : 'success.main',
                icon: <CheckCircleOutline color='primary' />,
                checkedIcon: <RemoveCircle color='primary' />
            };
        }
    };

    const styles = getStyles();

    return (
        <Paper
            elevation={isSelected ? 4 : 2}
            sx={{
                p: { xs: 1.5, md: 2 },
                border: '2px solid',
                borderColor: styles.borderColor,
                bgcolor: styles.bgcolor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                '&:hover': {
                    boxShadow: 2,
                }
            }}
            onClick={onClick}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
                sx={{ width: '100%' }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ flex: 1 }}
                >
                    <Avatar
                        src={student.profileImage}
                        sx={{
                            bgcolor: styles.avatarColor,
                            width: { xs: 48, md: 56 },
                            height: { xs: 48, md: 56 },
                            fontSize: { xs: '1.25rem', md: '1.5rem' }
                        }}
                    >
                        {student.name?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={1}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
                            >
                                {student.name}
                            </Typography>
                            <Chip
                                label={`Age ${calculateAge(student.dateOfBirth)}`}
                                size="small"
                                color="secondary"
                                sx={{ fontWeight: 'medium' }}
                            />
                        </Stack>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={{ xs: 0.5, sm: 2 }}
                            sx={{ flexWrap: 'wrap', mt: 0.5 }}
                        >
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '120px' }}>
                                <strong>Gender:</strong> {student.gender}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '180px' }}>
                                <strong>Born:</strong> {student.dateOfBirth}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: '150px' }}>
                                <strong>Place:</strong> {student.placeOfBirth}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        icon={styles.icon}
                        checkedIcon={styles.checkedIcon}
                        color={styles.checkboxColor}
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onCheckboxChange(student.id);
                        }}
                        sx={{
                            ml: { xs: 0, sm: 2 },
                            '& .MuiSvgIcon-root': {
                                fontSize: { xs: 24, md: 28 }
                            }
                        }}
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

export default StudentCard;
