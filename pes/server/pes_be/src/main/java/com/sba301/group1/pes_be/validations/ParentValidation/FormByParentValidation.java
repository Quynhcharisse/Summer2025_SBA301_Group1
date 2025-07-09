package com.sba301.group1.pes_be.validations.ParentValidation;

import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.dto.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.dto.requests.SubmitAdmissionFormRequest;

public class FormByParentValidation {
    public static String submittedForm(SubmitAdmissionFormRequest request) {

        if (request.getHouseholdRegistrationAddress() == null || request.getHouseholdRegistrationAddress().trim().isEmpty()) {
            return "Household registration address is required.";
        }

        if (request.getHouseholdRegistrationAddress().length() > 150) {
            return "Household registration address must not exceed 150 characters.";
        }

        if (request.getCommitmentImg() == null || request.getCommitmentImg().trim().isEmpty()) {
            return "Commitment image is required.";
        }

        if (!isValidImage(request.getCommitmentImg())) {
            return "Commitment image must be a valid image (.jpg, .jpeg, .png, .gif, .bmp)";
        }

        if (request.getChildCharacteristicsFormImg() == null || request.getChildCharacteristicsFormImg().trim().isEmpty()) {
            return "Child characteristics form image is required.";
        }

        if (!isValidImage(request.getChildCharacteristicsFormImg())) {
            return "Child characteristics form image must be a valid image (.jpg, .jpeg, .png, .gif, .bmp)";
        }

        if (request.getNote() != null && request.getNote().length() > 300) {
            return "Note must not exceed 300 characters.";
        }

        return "";
    }

    public static String canceledValidate(CancelAdmissionForm request, Account account, AdmissionFormRepo admissionFormRepo) {
        AdmissionForm form = admissionFormRepo.findById(request.getId()).orElse(null);

        if (form == null) {
            return "Admission form not found.";
        }

        if (!form.getParent().getAccount().getId().equals(account.getId())) {
            return "You do not have permission to access this form";
        }

        if (!form.getStatus().equals(Status.PENDING_APPROVAL)) {
            return "Forms in PENDING APPROVAL status can be cancelled.";
        }
        return "";
    }

    private static boolean isValidImage(String fileName) {
        return fileName.matches("(?i)^.+\\.(jpg|jpeg|png|gif|bmp)$");
    }
}

