package com.sba301.group1.pes_be.validations.ParentValidation;

import com.sba301.group1.pes_be.requests.AddChildRequest;
import com.sba301.group1.pes_be.requests.UpdateChildRequest;

public class ChildValidation {
    public static String addChildValidate(AddChildRequest request) {
        // Validate age
        int age = request.getDateOfBirth().until(java.time.LocalDate.now()).getYears();
        if(age < 3 || age > 7) {
            return "Child's age must be between 3 and 7 years old.";
        }

        // Validate form information
        if (!validateFormFields(
                request.getProfileImage(),
                request.getHouseholdRegistrationAddress(),
                request.getBirthCertificateImg(),
                request.getHouseholdRegistrationImg(),
                request.getCommitmentImg())) {
            return "All form fields must be provided together.";
        }

        return "";
    }

    public static String updateChildValidate(UpdateChildRequest request) {
        // Validate age
        int age = request.getDateOfBirth().until(java.time.LocalDate.now()).getYears();
        if(age < 3 || age > 7) {
            return "Child's age must be between 3 and 7 years old.";
        }

        // Validate form information
        if (!validateFormFields(
                request.getProfileImage(),
                request.getHouseholdRegistrationAddress(),
                request.getBirthCertificateImg(),
                request.getHouseholdRegistrationImg(),
                request.getCommitmentImg())) {
            return "All form fields must be provided together.";
        }

        return "";
    }

    public static boolean validateFormFields(
            String profileImage,
            String householdRegistrationAddress,
            String birthCertificateImg,
            String householdRegistrationImg,
            String commitmentImg) {
        
        boolean hasAnyField = profileImage != null || 
                            householdRegistrationAddress != null ||
                            birthCertificateImg != null || 
                            householdRegistrationImg != null ||
                            commitmentImg != null;

        boolean hasAllFields = profileImage != null && 
                             householdRegistrationAddress != null &&
                             birthCertificateImg != null && 
                             householdRegistrationImg != null &&
                             commitmentImg != null;

        // Nếu có bất kỳ trường nào được điền, thì tất cả các trường phải được điền
        return !hasAnyField || hasAllFields;
    }
}
