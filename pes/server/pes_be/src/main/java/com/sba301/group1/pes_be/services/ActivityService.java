package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.AssignActivityToClassRequest;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;
import com.sba301.group1.pes_be.requests.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateActivityRequest;
import org.springframework.http.ResponseEntity;

public interface ActivityService {
    
    ResponseEntity<ResponseObject> createActivity(CreateActivityRequest request);
    
    ResponseEntity<ResponseObject> updateActivity(Integer activityId, UpdateActivityRequest request);
    
    ResponseEntity<ResponseObject> getActivityById(Integer activityId);
    
    ResponseEntity<ResponseObject> getActivitiesByScheduleId(Integer scheduleId);
    
    ResponseEntity<ResponseObject> getActivitiesByClassId(Integer classId);
    
    ResponseEntity<ResponseObject> getAllActivities();
    
    ResponseEntity<ResponseObject> deleteActivity(Integer activityId);
    
    ResponseEntity<ResponseObject> assignActivityToClass(AssignActivityToClassRequest request);
    
    ResponseEntity<ResponseObject> getActivitiesByClassAndDay(Integer classId, String dayOfWeek);
}