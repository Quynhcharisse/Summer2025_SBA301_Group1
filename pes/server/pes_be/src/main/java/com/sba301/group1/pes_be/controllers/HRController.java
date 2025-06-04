package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ActivityService;
import com.sba301.group1.pes_be.services.ClassesService;
import com.sba301.group1.pes_be.services.LessonService;
import com.sba301.group1.pes_be.services.ScheduleService;
import com.sba301.group1.pes_be.services.SyllabusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasRole('hr')")
@RequiredArgsConstructor
@Tag(name = "HR Management", description = "APIs for HR role to view all data")
public class HRController {

    private final ActivityService activityService;
    private final ScheduleService scheduleService;
    private final ClassesService classesService;
    private final LessonService lessonService;
    private final SyllabusService syllabusService;

    // Get All Methods
    @GetMapping("/api/activities")
    @Operation(summary = "Get all activities")
    public ResponseEntity<ResponseObject> getAllActivities() {
        return activityService.getAllActivities();
    }

    @GetMapping("/api/schedules")
    @Operation(summary = "Get all schedules")
    public ResponseEntity<ResponseObject> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/api/classes")
    @Operation(summary = "Get all classes")
    public ResponseEntity<ResponseObject> getAllClasses() {
        return classesService.getAllClasses();
    }

    @GetMapping("/api/lessons")
    @Operation(summary = "Get all lessons")
    public ResponseEntity<ResponseObject> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @GetMapping("/api/syllabi")
    @Operation(summary = "Get all syllabi")
    public ResponseEntity<ResponseObject> getAllSyllabi() {
        return syllabusService.getAllSyllabi();
    }
}