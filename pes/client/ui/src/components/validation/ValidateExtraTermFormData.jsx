export const ValidateExtraTermFormData = (formData) => {
    // 1. Validate basic fields (empty check)
    if (!formData.admissionTermId) {
        return "Admission Term is required";
    }
    if (!formData.startDate) {
        return "Start date is required";
    }
    if (!formData.endDate) {
        return "End date is required";
    }
    if (!formData.reason) {
        return "Reason is required";
    }

    // 2. Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid date format";
    }

    // Check if startDate is in the future
    if (startDate < now) {
        return "Start date must be in the future";
    }

    // Check if endDate is after startDate
    if (endDate <= startDate) {
        return "End date must be after start date";
    }

    // 3. Validate reason length
    if (formData.reason.trim().length < 10) {
        return "Reason must be at least 10 characters long";
    }

    // All validations passed
    return "";
}; 