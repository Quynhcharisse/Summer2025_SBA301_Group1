package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.CreateScheduleRequest;
import com.sba301.group1.pes_be.requests.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateScheduleRequest;
import com.sba301.group1.pes_be.services.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedule Management", description = "APIs for managing schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    @Operation(summary = "Create a new schedule")
    public ResponseEntity<ResponseObject> createSchedule(@RequestBody CreateScheduleRequest request) {
        return scheduleService.createSchedule(request);
    }

    @PutMapping("/{scheduleId}")
    @Operation(summary = "Update an existing schedule")
    public ResponseEntity<ResponseObject> updateSchedule(
            @PathVariable Integer scheduleId,
            @RequestBody UpdateScheduleRequest request) {
        return scheduleService.updateSchedule(scheduleId, request);
    }

    @GetMapping("/{scheduleId}")
    @Operation(summary = "Get schedule by ID")
    public ResponseEntity<ResponseObject> getScheduleById(@PathVariable Integer scheduleId) {
        return scheduleService.getScheduleById(scheduleId);
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get all schedules for a specific class")
    public ResponseEntity<ResponseObject> getSchedulesByClassId(@PathVariable Integer classId) {
        return scheduleService.getSchedulesByClassId(classId);
    }

    @GetMapping("/class/{classId}/week/{weekNumber}")
    @Operation(summary = "Get weekly schedule for a specific class and week")
    public ResponseEntity<ResponseObject> getWeeklySchedule(
            @PathVariable Integer classId,
            @PathVariable int weekNumber) {
        return scheduleService.getWeeklySchedule(classId, weekNumber);
    }

    @DeleteMapping("/{scheduleId}")
    @Operation(summary = "Delete a schedule")
    public ResponseEntity<ResponseObject> deleteSchedule(@PathVariable Integer scheduleId) {
        return scheduleService.deleteSchedule(scheduleId);
    }

    @GetMapping
    @Operation(summary = "Get all schedules")
    public ResponseEntity<ResponseObject> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }
}