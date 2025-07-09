package com.sba301.group1.pes_be.validations.AdmissionValidation;

import com.sba301.group1.pes_be.dto.requests.CreateExtraTermRequest;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;

public class ExtraTermValidation {
    public static String createExtraTerm(CreateExtraTermRequest request, AdmissionTermRepo admissionTermRepo) {
        if (request.getAdmissionTermId() == null) {
            return "Admission term ID is required.";
        }

        if (request.getStartDate() == null || request.getEndDate() == null) {
            return "Start date and end date are required.";
        }

        if (!request.getEndDate().isAfter(request.getStartDate())) {
            return "End date must be after start date.";
        }

        if (request.getMaxNumberRegistration() <= 0) {
            return "Maximum number of registrations must be greater than 0.";
        }

        // 2. Kiểm tra AdmissionTerm tồn tại
        AdmissionTerm term = admissionTermRepo.findById(request.getAdmissionTermId()).orElse(null);
        if (term == null) {
            return ("Admission term not found");
        }

        // 3. Kiểm tra status và chỉ tiêu
        if (!term.getStatus().equals(Status.LOCKED_TERM)) {
            return ("Only locked terms can have extra requests");
        }

        if (countApprovedFormByTerm(term) >= term.getMaxNumberRegistration()) {
            return ("Term has already reached maximum registration");
        }

        return "";
    }

    public static int countApprovedFormByTerm(AdmissionTerm term) {
        return (int) term.getAdmissionFormList().stream().filter(form -> form.getStatus().equals(Status.APPROVED)).count();
    }
}
