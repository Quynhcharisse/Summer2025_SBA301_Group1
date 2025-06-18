package com.sba301.group1.pes_be.validations.ParentValidation;

import com.sba301.group1.pes_be.requests.UpdateParentRequest;
import java.time.LocalDate;

public class UpdateProfileValidation {
    public static String validate(UpdateParentRequest request) {
        // Name validation
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return "Name is required.";
        }
        if (!request.getName().matches("^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$")) {
            return "Name can only contain letters and spaces.";
        }
        int nameLength = request.getName().trim().length();
        if (nameLength < 2 || nameLength > 50) {
            return "Name must be between 2 and 50 characters.";
        }

        // Phone validation
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            return "Phone number is required.";
        }
        if (!request.getPhone().matches("^(03|05|07|08|09)\\d{8}$")) {
            return "Phone number must start with a valid region prefix and be 10 digits.";
        }

        // Gender validation
        if (request.getGender() == null || request.getGender().trim().isEmpty()) {
            return "Gender is required.";
        }
        String gender = request.getGender().trim().toLowerCase();
        if (!gender.equals("male") && !gender.equals("female")) {
            return "Gender must be male or female.";
        }

        // Identity number validation is skipped since it cannot be updated

        // Address validation
        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            return "Address is required.";
        }
        if (request.getAddress().trim().length() > 200) {
            return "Address cannot exceed 200 characters.";
        }

        // Job validation
        if (request.getJob() == null || request.getJob().trim().isEmpty()) {
            return "Job is required.";
        }
        if (request.getJob().trim().length() > 50) {
            return "Job cannot exceed 50 characters.";
        }

        // Relationship to child validation
        if (request.getRelationshipToChild() == null || request.getRelationshipToChild().trim().isEmpty()) {
            return "Relationship to child is required.";
        }
        if (request.getRelationshipToChild().trim().length() > 20) {
            return "Relationship to child cannot exceed 20 characters.";
        }

        // Day of birth validation
        if (request.getDayOfBirth() == null) {
            return "Date of birth is required.";
        }
        if (request.getDayOfBirth().isAfter(LocalDate.now())) {
            return "Date of birth cannot be in the future.";
        }
        // Kiểm tra tuổi tối thiểu (ví dụ: 18 tuổi)
        if (request.getDayOfBirth().isAfter(LocalDate.now().minusYears(18))) {
            return "Parent must be at least 18 years old.";
        }

        return "";
    }
}
