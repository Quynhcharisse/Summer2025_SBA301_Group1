package com.sba301.group1.pes_be.validations.ScheduleValidation;

import com.sba301.group1.pes_be.models.Schedule;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.dto.requests.UpdateScheduleRequest;

public class UpdateScheduleValidation {
    
    public static String validate(UpdateScheduleRequest request, Schedule currentSchedule, ScheduleRepo scheduleRepo) {
        if (request.getWeekNumber() <= 0) {
            return "Week number must be positive";
        }
        
        if (request.getWeekNumber() > 52) {
            return "Week number cannot exceed 52";
        }
        
        // Check for duplicate schedule only if week number is changing
        if (currentSchedule.getWeekNumber() != request.getWeekNumber()) {
            if (scheduleRepo.findByClassesIdAndWeekNumber(
                    currentSchedule.getClasses().getId(), 
                    request.getWeekNumber()).isPresent()) {
                return "A schedule already exists for week " + request.getWeekNumber() + " in this class";
            }
        }
        
        return "";
    }
}