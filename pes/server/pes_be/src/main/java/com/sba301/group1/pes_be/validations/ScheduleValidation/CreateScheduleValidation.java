package com.sba301.group1.pes_be.validations.ScheduleValidation;

import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.dto.requests.CreateScheduleRequest;

public class CreateScheduleValidation {
    
    // Original method signature for backward compatibility
    public static String validate(CreateScheduleRequest request, ClassesRepo classesRepo) {
        if (request.getWeekNumber() <= 0) {
            return "Week number must be positive";
        }
        
        if (request.getWeekNumber() > 52) {
            return "Week number cannot exceed 52";
        }
        
        if (request.getClassId() == null) {
            return "Class ID is required";
        }
        
        if (!classesRepo.existsById(request.getClassId())) {
            return "Class not found";
        }
        
        return "";
    }
    
    // Enhanced method signature with duplicate check
    public static String validate(CreateScheduleRequest request, ClassesRepo classesRepo, ScheduleRepo scheduleRepo) {
        // First run the basic validation
        String basicValidation = validate(request, classesRepo);
        if (!basicValidation.isEmpty()) {
            return basicValidation;
        }
        
        // Check for duplicate schedule (same class and week number)
        if (scheduleRepo.findByClassesIdAndWeekNumber(request.getClassId(), request.getWeekNumber()).isPresent()) {
            return "Schedule already exists for this week and class";
        }
        
        return "";
    }
}