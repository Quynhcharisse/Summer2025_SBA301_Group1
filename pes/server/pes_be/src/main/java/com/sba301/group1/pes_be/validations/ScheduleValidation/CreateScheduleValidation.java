package com.sba301.group1.pes_be.validations.ScheduleValidation;

import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.requests.CreateScheduleRequest;

public class CreateScheduleValidation {
    
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
}