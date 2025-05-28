package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.AssignActivityToClassRequest;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;
import com.sba301.group1.pes_be.requests.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateActivityRequest;
import com.sba301.group1.pes_be.services.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Tag(name = "Activity Management", description = "APIs for managing activities")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    @Operation(summary = "Create a new activity")
    public ResponseEntity<ResponseObject> createActivity(@RequestBody CreateActivityRequest request) {
        return activityService.createActivity(request);
    }

    @PutMapping("/{activityId}")
    @Operation(summary = "Update an existing activity")
    public ResponseEntity<ResponseObject> updateActivity(
            @PathVariable Integer activityId,
            @RequestBody UpdateActivityRequest request) {
        return activityService.updateActivity(activityId, request);
    }

    @GetMapping("/{activityId}")
    @Operation(summary = "Get activity by ID")
    public ResponseEntity<ResponseObject> getActivityById(@PathVariable Integer activityId) {
        return activityService.getActivityById(activityId);
    }

    @GetMapping("/schedule/{scheduleId}")
    @Operation(summary = "Get all activities for a specific schedule")
    public ResponseEntity<ResponseObject> getActivitiesByScheduleId(@PathVariable Integer scheduleId) {
        return activityService.getActivitiesByScheduleId(scheduleId);
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get all activities for a specific class")
    public ResponseEntity<ResponseObject> getActivitiesByClassId(@PathVariable Integer classId) {
        return activityService.getActivitiesByClassId(classId);
    }

    @GetMapping("/class/{classId}/day/{dayOfWeek}")
    @Operation(summary = "Get activities for a specific class and day of week")
    public ResponseEntity<ResponseObject> getActivitiesByClassAndDay(
            @PathVariable Integer classId,
            @PathVariable String dayOfWeek) {
        return activityService.getActivitiesByClassAndDay(classId, dayOfWeek);
    }

    @GetMapping
    @Operation(summary = "Get all activities")
    public ResponseEntity<ResponseObject> getAllActivities() {
        return activityService.getAllActivities();
    }

    @DeleteMapping("/{activityId}")
    @Operation(summary = "Delete an activity")
    public ResponseEntity<ResponseObject> deleteActivity(@PathVariable Integer activityId) {
        return activityService.deleteActivity(activityId);
    }

    @PostMapping("/assign")
    @Operation(summary = "Assign activity to a class")
    public ResponseEntity<ResponseObject> assignActivityToClass(@RequestBody AssignActivityToClassRequest request) {
        return activityService.assignActivityToClass(request);
    }
}