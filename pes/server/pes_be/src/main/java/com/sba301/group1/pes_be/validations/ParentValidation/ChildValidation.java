
package com.sba301.group1.pes_be.validations.ParentValidation;


import com.sba301.group1.pes_be.dto.requests.AddChildRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateChildRequest;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.Period;

public class ChildValidation {
    public static String updateChildValidate(UpdateChildRequest request, HttpServletRequest req, ParentRepo parentRepo, JWTService jwtService, StudentRepo studentRepo) {
        Account account = jwtService.extractAccountFromCookie(req);
        Parent parent = parentRepo.findByAccount_Id(account.getId()).orElse(null);
        if (parent == null) {
            return ("Parent not found");
        }

        Student student = studentRepo.findById(request.getId()).orElse(null);
        if (student == null || !student.getParent().getId().equals(parent.getId())) {
            return ("Child not found or access denied");
        }

        if (request.getId() <= 0) {
            return "Invalid child ID.";
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return "Name is required.";
        }
        if (request.getName().length() < 2 || request.getName().length() > 50) {
            return "Name must be between 2 and 50 characters.";
        }

        if (!isValidGender(request.getGender())) {
            return "Gender must be Male, Female";
        }

        if (request.getDateOfBirth() == null || request.getDateOfBirth().isAfter(LocalDate.now())) {
            return "Date of birth must be in the past.";
        }

        int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();
        if (age < 3 || age > 5) {
            return "Child's age must be between 3 and 5 years.";
        }

        if (request.getPlaceOfBirth() == null || request.getPlaceOfBirth().trim().isEmpty()) {
            return "Place of birth is required.";
        }

        if (request.getPlaceOfBirth().length() > 100) {
            return "Place of birth must be less than 100 characters.";
        }

        if (request.getProfileImage() == null || request.getProfileImage().isEmpty()) {
            return "Profile image is required.";
        }

        if (request.getHouseholdRegistrationImg() == null || request.getHouseholdRegistrationImg().isEmpty()) {
            return "Household registration image is required.";
        }

        if (request.getBirthCertificateImg() == null || request.getBirthCertificateImg().isEmpty()) {
            return "Birth certificate image is required.";
        }

        String imgError;

        imgError = validateImageField("Profile image", request.getProfileImage());
        if (!imgError.isEmpty()) return imgError;

        imgError = validateImageField("Household registration image", request.getHouseholdRegistrationImg());
        if (!imgError.isEmpty()) return imgError;

        imgError = validateImageField("Birth certificate image", request.getBirthCertificateImg());
        if (!imgError.isEmpty()) return imgError;

        return "";
    }

    public static String addChildValidate(AddChildRequest request, HttpServletRequest httpRequest, ParentRepo parentRepo, JWTService jwtService) {
        Account account = jwtService.extractAccountFromCookie(httpRequest);

        Parent parent = parentRepo.findByAccount_Id(account.getId()).orElse(null);
        if (parent == null) {
            return ("Parent not found");
        }

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return "Name is required.";
        }
        if (request.getName().length() < 2 || request.getName().length() > 50) {
            return "Name must be between 2 and 50 characters.";
        }

        if (!isValidGender(request.getGender())) {
            return "Gender must be Male or Female.";
        }

        if (request.getDateOfBirth() == null || request.getDateOfBirth().isAfter(LocalDate.now())) {
            return "Date of birth must be in the past.";
        }

        int age = Period.between(request.getDateOfBirth(), LocalDate.now()).getYears();
        if (age < 3 || age > 5) {
            return "Child's age must be between 3 and 5 years.";
        }

        if (request.getPlaceOfBirth() == null || request.getPlaceOfBirth().trim().isEmpty()) {
            return "Place of birth is required.";
        }

        if (request.getPlaceOfBirth().length() > 100) {
            return "Place of birth must be less than 100 characters.";
        }

        String[] images = {
                request.getProfileImage(),
                request.getHouseholdRegistrationImg(),
                request.getBirthCertificateImg(),
        };
        String[] imageNames = {
                "Profile image",
                "Household registration image",
                "Birth certificate image",
                "Commitment image"
        };

        for (int i = 0; i < images.length; i++) {
            String error = validateImageField(imageNames[i], images[i]);
            if (!error.isEmpty()) return error;
        }

        return "";
    }

    private static boolean isValidGender(String gender) {
        return gender != null && (
                gender.equalsIgnoreCase("Male") ||
                        gender.equalsIgnoreCase("Female")
        );
    }

    private static String validateImageField(String name, String value) {
        if (value == null || value.isEmpty()) {
            return name + " is required.";
        }
        if (!value.matches("(?i)^.+\\.(jpg|jpeg|png|gif|bmp)$")) {
            return name + " must be a valid image file (.jpg, .png, .jpeg, .gif, .bmp).";
        }
        return "";
    }
}