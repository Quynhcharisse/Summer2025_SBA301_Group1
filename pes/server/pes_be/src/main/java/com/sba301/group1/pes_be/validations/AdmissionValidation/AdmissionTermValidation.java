package com.sba301.group1.pes_be.validations.AdmissionValidation;

import com.sba301.group1.pes_be.requests.CreateAdmissionTermRequest;

import java.time.LocalDateTime;

public class AdmissionTermValidation {
    public static String createTermValidate(CreateAdmissionTermRequest request) {

        if (request.getStartDate() == null || request.getEndDate() == null) {
            return "Start date is required or end date is required";
        }

        //end date ko dc qua nam tuyen sinh
        //Tránh trường hợp tạo đợt tuyển sinh cho năm 2026
        // nhưng lại kết thúc trong 2025 hoặc 2027 — điều này sẽ gây mâu thuẫn trong hệ thống
        if (request.getEndDate().getYear() !=  LocalDateTime.now().getYear()) {
            return "End date must be in year";
        }

        if (!request.getStartDate().isBefore(request.getEndDate())) {
            return "Start date must be before end date";
        }


        if (request.getMaxNumberRegistration() <= 0 || request.getMaxNumberRegistration() > 1000) {
            return "Max number registration must be greater than 0 and less than 1000";
        }

        if (request.getGrade().trim().isEmpty()) {
            return "Grade is required";
        }
        return "";
    }

}
