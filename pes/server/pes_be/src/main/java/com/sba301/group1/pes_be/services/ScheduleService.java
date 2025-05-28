package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.CreateScheduleRequest;
import com.sba301.group1.pes_be.requests.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateScheduleRequest;
import org.springframework.http.ResponseEntity;

public interface ScheduleService {
    
    ResponseEntity<ResponseObject> createSchedule(CreateScheduleRequest request);
    
    ResponseEntity<ResponseObject> updateSchedule(Integer scheduleId, UpdateScheduleRequest request);
    
    ResponseEntity<ResponseObject> getScheduleById(Integer scheduleId);
    
    ResponseEntity<ResponseObject> getSchedulesByClassId(Integer classId);
    
    ResponseEntity<ResponseObject> getWeeklySchedule(Integer classId, int weekNumber);
    
    ResponseEntity<ResponseObject> deleteSchedule(Integer scheduleId);
    
    ResponseEntity<ResponseObject> getAllSchedules();
}