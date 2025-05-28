package com.sba301.group1.pes_be.validations.ActivityValidation;

import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;

import java.util.Arrays;
import java.util.List;

public class CreateActivityValidation {
    
    private static final List<String> VALID_DAYS = Arrays.asList(
        "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
    );
    
    public static String validate(CreateActivityRequest request, ScheduleRepo scheduleRepo) {
        if (request.getTopic() == null || request.getTopic().trim().isEmpty()) {
            return "Topic is required";
        }
        
        if (request.getDayOfWeek() == null || request.getDayOfWeek().trim().isEmpty()) {
            return "Day of week is required";
        }
        
        if (!VALID_DAYS.contains(request.getDayOfWeek().toUpperCase())) {
            return "Invalid day of week. Must be one of: " + String.join(", ", VALID_DAYS);
        }
        
        if (request.getStartTime() == null || request.getStartTime().trim().isEmpty()) {
            return "Start time is required";
        }
        
        if (request.getEndTime() == null || request.getEndTime().trim().isEmpty()) {
            return "End time is required";
        }
        
        // Basic time format validation (HH:MM)
        if (!isValidTimeFormat(request.getStartTime()) || !isValidTimeFormat(request.getEndTime())) {
            return "Time must be in HH:MM format";
        }
        
        if (request.getScheduleId() == null) {
            return "Schedule ID is required";
        }
        
        if (!scheduleRepo.existsById(request.getScheduleId())) {
            return "Schedule not found";
        }
        
        return "";
    }
    
    private static boolean isValidTimeFormat(String time) {
        if (time == null || time.length() != 5) {
            return false;
        }
        
        String[] parts = time.split(":");
        if (parts.length != 2) {
            return false;
        }
        
        try {
            int hours = Integer.parseInt(parts[0]);
            int minutes = Integer.parseInt(parts[1]);
            return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}