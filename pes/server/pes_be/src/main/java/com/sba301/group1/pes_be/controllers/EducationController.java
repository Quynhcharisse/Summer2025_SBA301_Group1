package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.AssignActivityToClassRequest;
import com.sba301.group1.pes_be.requests.BulkCreateActivityRequest;
import com.sba301.group1.pes_be.requests.CreateActivitiesFromLessonsRequest;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;
import com.sba301.group1.pes_be.requests.CreateScheduleRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateActivityRequest;
import com.sba301.group1.pes_be.requests.UpdateScheduleRequest;
import com.sba301.group1.pes_be.services.ActivityService;
import com.sba301.group1.pes_be.services.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasRole('education')")
@RequiredArgsConstructor
@Tag(name = "Education Management", description = "APIs for education role to manage activities and schedules")
public class EducationController {

    private final ActivityService activityService;
    private final ScheduleService scheduleService;

    // Activity Management Methods
    @PostMapping("/api/activities")
    @Operation(summary = "Create a new activity")
    public ResponseEntity<ResponseObject> createActivity(@RequestBody CreateActivityRequest request) {
        return activityService.createActivity(request);
    }

    @PutMapping("/api/activities/{activityId}")
    @Operation(summary = "Update an existing activity")
    public ResponseEntity<ResponseObject> updateActivity(
            @PathVariable Integer activityId,
            @RequestBody UpdateActivityRequest request) {
        return activityService.updateActivity(activityId, request);
    }

    @GetMapping("/api/activities/{activityId}")
    @Operation(summary = "Get activity by ID")
    public ResponseEntity<ResponseObject> getActivityById(@PathVariable Integer activityId) {
        return activityService.getActivityById(activityId);
    }

    @GetMapping("/api/activities/schedule/{scheduleId}")
    @Operation(summary = "Get all activities for a specific schedule")
    public ResponseEntity<ResponseObject> getActivitiesByScheduleId(@PathVariable Integer scheduleId) {
        return activityService.getActivitiesByScheduleId(scheduleId);
    }

    @GetMapping("/api/activities/class/{classId}")
    @Operation(summary = "Get all activities for a specific class")
    public ResponseEntity<ResponseObject> getActivitiesByClassId(@PathVariable Integer classId) {
        return activityService.getActivitiesByClassId(classId);
    }

    @GetMapping("/api/activities/class/{classId}/day/{dayOfWeek}")
    @Operation(summary = "Get activities for a specific class and day of week")
    public ResponseEntity<ResponseObject> getActivitiesByClassAndDay(
            @PathVariable Integer classId,
            @PathVariable String dayOfWeek) {
        return activityService.getActivitiesByClassAndDay(classId, dayOfWeek);
    }


    @DeleteMapping("/api/activities/{activityId}")
    @Operation(summary = "Delete an activity")
    public ResponseEntity<ResponseObject> deleteActivity(@PathVariable Integer activityId) {
        return activityService.deleteActivity(activityId);
    }

    @PostMapping("/api/activities/assign")
    @Operation(summary = "Assign activity to a class")
    public ResponseEntity<ResponseObject> assignActivityToClass(@RequestBody AssignActivityToClassRequest request) {
        return activityService.assignActivityToClass(request);
    }

    @PostMapping("/api/activities/bulk-create")
    @Operation(summary = "Create multiple activities")
    public ResponseEntity<ResponseObject> bulkCreateActivities(@RequestBody BulkCreateActivityRequest request) {
        return activityService.bulkCreateActivities(request);
    }

    @PostMapping("/api/activities/create-from-lessons")
    @Operation(summary = "Create activities from lessons")
    public ResponseEntity<ResponseObject> createActivitiesFromLessons(@RequestBody CreateActivitiesFromLessonsRequest request) {
        return activityService.createActivitiesFromLessons(request);
    }

    @GetMapping("/api/activities/lesson/{lessonId}")
    @Operation(summary = "Get activities for a lesson")
    public ResponseEntity<ResponseObject> getActivitiesByLessonId(@PathVariable Integer lessonId) {
        return activityService.getActivitiesByLessonId(lessonId);
    }

    // Schedule Management Methods
    @PostMapping("/api/schedules")
    @Operation(summary = "Create a new schedule")
    public ResponseEntity<ResponseObject> createSchedule(@RequestBody CreateScheduleRequest request) {
        return scheduleService.createSchedule(request);
    }

    @PutMapping("/api/schedules/{scheduleId}")
    @Operation(summary = "Update an existing schedule")
    public ResponseEntity<ResponseObject> updateSchedule(
            @PathVariable Integer scheduleId,
            @RequestBody UpdateScheduleRequest request) {
        return scheduleService.updateSchedule(scheduleId, request);
    }

    @GetMapping("/api/schedules/{scheduleId}")
    @Operation(summary = "Get schedule by ID")
    public ResponseEntity<ResponseObject> getScheduleById(@PathVariable Integer scheduleId) {
        return scheduleService.getScheduleById(scheduleId);
    }

    @GetMapping("/api/schedules/class/{classId}")
    @Operation(summary = "Get all schedules for a specific class")
    public ResponseEntity<ResponseObject> getSchedulesByClassId(@PathVariable Integer classId) {
        return scheduleService.getSchedulesByClassId(classId);
    }

    @GetMapping("/api/schedules/class/{classId}/week/{weekNumber}")
    @Operation(summary = "Get weekly schedule for a specific class and week")
    public ResponseEntity<ResponseObject> getWeeklySchedule(
            @PathVariable Integer classId,
            @PathVariable int weekNumber) {
        return scheduleService.getWeeklySchedule(classId, weekNumber);
    }

    @DeleteMapping("/api/schedules/{scheduleId}")
    @Operation(summary = "Delete a schedule")
    public ResponseEntity<ResponseObject> deleteSchedule(@PathVariable Integer scheduleId) {
        return scheduleService.deleteSchedule(scheduleId);
    }

}