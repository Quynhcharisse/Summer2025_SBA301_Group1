export const ValidateTermFormData = (formData, existingTerms = []) => {
    // 1. Validate các field cơ bản (empty check)
    if (!formData.grade) {
        return "Grade is required";
    }
    if (!formData.startDate) {
        return "Start date is required";
    }
    if (!formData.endDate) {
        return "End date is required";
    }
    if (!formData.maxNumberRegistration || formData.maxNumberRegistration <= 0) {
        return "Max number of registrations must be greater than 0";
    }

    // 2. Validate grade format - phải match với enum Grade ở BE
    const validGrades = ['SEED', 'BUD', 'LEAF'];
    const inputGrade = formData.grade.toUpperCase();
    if (!validGrades.includes(inputGrade)) {
        return "Invalid grade. Grade must be one of: Seed, Bud, Leaf";
    }

    // 3. Validate thời gian
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const currentYear = new Date().getFullYear();

    // Kiểm tra endDate phải sau startDate
    if (endDate <= startDate) {
        return "End date must be after start date";
    }

    // Nếu không có existingTerms, bỏ qua các validation liên quan
    if (!existingTerms || existingTerms.length === 0) {
        return "";
    }

    // 4. Kiểm tra mỗi năm mỗi grade chỉ được có 1 đợt tuyển sinh
    const termsThisYear = existingTerms.filter(term => {
        const termGrade = term.grade.toUpperCase();
        const termYear = new Date(term.startDate).getFullYear();
        return termGrade === inputGrade && termYear === currentYear;
    });

    if (termsThisYear.length > 0) {
        return `An admission term already exists for grade ${formData.grade} in year ${currentYear}`;
    }

    // 5. Kiểm tra trùng thời gian với cùng grade
    const sameGradeTerms = existingTerms.filter(term => 
        term.grade.toUpperCase() === inputGrade
    );

    for (const term of sameGradeTerms) {
        const termStart = new Date(term.startDate);
        const termEnd = new Date(term.endDate);

        // Sử dụng logic giống BE để check overlap
        if (!(endDate <= termStart || startDate >= termEnd)) {
            return "Time period overlaps with another term of the same grade";
        }
    }

    // 6. Validate các khoản phí
    if (formData.reservationFee < 0 || 
        formData.serviceFee < 0 || 
        formData.uniformFee < 0 || 
        formData.learningMaterialFee < 0 || 
        formData.facilityFee < 0) {
        return "All fees must be non-negative";
    }

    if (formData.maxStudent < 0) {
        return "Maximum number of students must be non-negative";
    }

    if (formData.maxStudent < formData.minStudent) {
        return "Maximum number of students must be greater than or equal to minimum number of students";
    }

    return ""; // Return empty string if validation passes
};
