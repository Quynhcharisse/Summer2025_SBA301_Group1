package com.sba301.group1.pes_be.validations.AdmissionValidation;

import com.sba301.group1.pes_be.dto.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AdmissionTermValidation {
    public static String createTermValidate(CreateAdmissionTermRequest request, AdmissionTermRepo admissionTermRepo) {

        if (request.getStartDate() == null || request.getEndDate() == null) {
            return "Start date is required or end date is required";
        }

        //end date ko dc qua nam tuyen sinh
        //Tránh trường hợp tạo đợt tuyển sinh cho năm 2026
        // nhưng lại kết thúc trong 2025 hoặc 2027 — điều này sẽ gây mâu thuẫn trong hệ thống
        if (request.getEndDate().getYear() != LocalDateTime.now().getYear()) {
            return "End date must be in year";
        }

        if (!request.getStartDate().isBefore(request.getEndDate())) {
            return "Start date must be before end date";
        }

        if (request.getGrade().trim().isEmpty()) {
            return "Grade is required";
        }

        Grade grade;
        try {
            grade = Grade.valueOf(request.getGrade().toUpperCase());
        } catch (IllegalArgumentException e) {
            return "Invalid grade provided";
        }

        // 4. Kiểm tra trùng thời gian với cùng grade
        List<AdmissionTerm> termsWithSameGrade = admissionTermRepo.findByGrade(grade);
        for (AdmissionTerm t : termsWithSameGrade) {
            if (datesOverlap(request.getStartDate(), request.getEndDate(), t.getStartDate(), t.getEndDate())) {
                return ("Time period overlaps with another term of the same grade");
            }
        }

        int currentYear = LocalDate.now().getYear();
        // 3. Mỗi năm, mỗi grade chỉ được phép có 1 đợt tuyển sinh
        long termCountThisYear = admissionTermRepo.countByYearAndGrade(currentYear, grade);
        if (termCountThisYear >= 1) {
            return ("Admission term already exists for grade " + grade + " in year " + currentYear);
        }


        if (request.getMaxNumberRegistration() <= 0 || request.getMaxNumberRegistration() > 1000) {
            return "Max number registration must be greater than 0 and less than 1000";
        }

        return "";
    }

    public static boolean datesOverlap(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2, LocalDateTime end2) {
        return !(end1.isBefore(start2) || start1.isAfter(end2));
    }
}
