package com.sba301.group1.pes_be.validations.ClassValidation;

import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.dto.requests.ClassRequest;
import com.sba301.group1.pes_be.enums.Role;
import java.time.LocalDate;

public class CreateClassValidation {
    
    public static String validate(ClassRequest request, ClassesRepo classesRepo, AccountRepo accountRepo, SyllabusRepo syllabusRepo) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return "Class name is required";
        }
        
        if (classesRepo.existsByName(request.getName().trim())) {
            return "Class name already exists";
        }
        
        if (request.getNumberStudent() <= 0) {
            return "Number of students must be greater than 0";
        }
        
        if (request.getStartDate() == null) {
            return "Start date is required";
        }
        
        if (request.getEndDate() == null) {
            return "End date is required";
        }
        
        LocalDate now = LocalDate.now();
        LocalDate oneWeekFromNow = now.plusWeeks(1);
        
        if (LocalDate.parse(request.getStartDate()).isBefore(oneWeekFromNow)) {
            return "Start date must be at least 1 week from now";
        }
        
        if (!LocalDate.parse(request.getEndDate()).isAfter(LocalDate.parse(request.getStartDate()))) {
            return "End date must be after start date";
        }
        
        if (request.getTeacherId() == null) {
            return "Teacher is required";
        }
        
        if (!accountRepo.existsById(request.getTeacherId())) {
            return "Teacher not found";
        }
        
        var teacher = accountRepo.findById(request.getTeacherId()).orElse(null);
        if (teacher == null || teacher.getRole() != Role.TEACHER) {
            return "Selected account is not a teacher";
        }
        
        if (classesRepo.existsByTeacherAndYear(request.getTeacherId(), String.valueOf(LocalDate.parse(request.getStartDate()).getYear()))) {
            return "Teacher is already assigned to another class in the same year";
        }

        if (classesRepo.existsByRoomNumberAndYear(request.getRoomNumber(), String.valueOf(LocalDate.parse(request.getStartDate()).getYear()))) {
            return "Room is already assigned to another class in the same year";
        }
        
        if (request.getSyllabusId() == null) {
            return "Syllabus is required";
        }
        
        if (!syllabusRepo.existsById(request.getSyllabusId())) {
            return "Syllabus not found";
        }
        
        if (request.getRoomNumber() == null || request.getRoomNumber().trim().isEmpty()) {
            return "Room number is required";
        }
        
        if (request.getGrade() == null || request.getGrade().trim().isEmpty()) {
            return "Grade is required";
        }
        
        return "";
    }
}