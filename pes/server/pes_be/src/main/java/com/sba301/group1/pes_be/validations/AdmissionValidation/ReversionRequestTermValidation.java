package com.sba301.group1.pes_be.validations.AdmissionValidation;

import com.sba301.group1.pes_be.requests.CreateReversionTermRequest;

public class ReversionRequestTermValidation {
    public static String createReversionRequestTerm(CreateReversionTermRequest request) {
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

        if (request.getReason() == null || request.getReason().trim().isEmpty()) {
            return "Reason is required";
        }


        if (request.getReason().trim().split("\\s+").length > 150) {
            return "Reason must not exceed 150 words currently" + request.getReason().trim().split("\\s+").length + " words";
        }

        return "";
    }
}
