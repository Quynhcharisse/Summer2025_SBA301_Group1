package com.sba301.group1.pes_be.validations.ParentValidation;

import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.requests.SubmitAdmissionFormRequest;

public class FormByParentValidation {
    public static String submittedForm(SubmitAdmissionFormRequest request) {

        // Không được để trống
        if (request.getHouseholdRegistrationAddress() == null || request.getHouseholdRegistrationAddress().isEmpty()) {
            return "Household registration address is required.";
        }

        // Không được để trống
        if (request.getHouseholdRegistrationAddress().length() > 150) {
            return "Household registration address must not exceed 150 characters.";
        }

        // Không được để trống
        if (request.getProfileImage() == null || request.getProfileImage().isEmpty()) {
            return "Profile image is required.";
        }

        // Không được để trống
        if (request.getHouseholdRegistrationImg() == null || request.getHouseholdRegistrationImg().isEmpty()) {
            return "Household registration image is required.";
        }

        // Không được để trống
        if (request.getBirthCertificateImg() == null || request.getBirthCertificateImg().isEmpty()) {
            return "Birth certificate image is required.";
        }

        // Không được để trống
        if (request.getCommitmentImg() == null || request.getCommitmentImg().isEmpty()) {
            return "Commitment image is required.";
        }

        String imgError;

        imgError = validateImageField("Profile image", request.getProfileImage());
        if (!imgError.isEmpty()) return imgError;

        imgError = validateImageField("Household registration image", request.getHouseholdRegistrationImg());
        if (!imgError.isEmpty()) return imgError;

        imgError = validateImageField("Birth certificate image", request.getBirthCertificateImg());
        if (!imgError.isEmpty()) return imgError;

        imgError = validateImageField("Commitment image", request.getCommitmentImg());
        if (!imgError.isEmpty()) return imgError;

        return "";
    }


    public static String canceledValidate(CancelAdmissionForm request, Account account, AdmissionFormRepo admissionFormRepo) {
        AdmissionForm form = admissionFormRepo.findById(request.getId()).orElse(null);

        if (form == null) {
            return "Admission form not found.";
        }

        //so sánh id của account bên trong parent
        if (!form.getParent().getAccount().getId().equals(account.getId())) {
            return "You do not have permission to access this form";
        }

        if (!form.getStatus().equals(Status.PENDING_APPROVAL.getValue())) {
            return "Forms in PENDING APPROVAL status can be cancelled.";
        }
        return "";
    }


    private static String validateImageField(String img, String value) {
        //ko để trống
        if (value == null || value.isEmpty()) {
            return img + " is required.";
        }

        //Chỉ cho phép định dạng file ảnh hợp lệ (.jpg, .jpeg, .png, .gif, .bmp)
        if (!value.matches("(?i)^.+\\.(jpg|jpeg|png|gif|bmp)$")) {
            return img + " must be a valid image file (.jpg, .png, .jpeg, .gif, .bmp).";
        }

        return "";
    }
}

