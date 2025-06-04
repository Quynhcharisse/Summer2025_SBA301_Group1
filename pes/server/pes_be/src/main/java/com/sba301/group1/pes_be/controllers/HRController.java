package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.EducationService;
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

    private final EducationService educationService;

    // Get All Methods
    @GetMapping("/api/activities")
    @Operation(summary = "Get all activities")
    public ResponseEntity<ResponseObject> getAllActivities() {
        return educationService.getAllActivities();
    }

    @GetMapping("/api/schedules")
    @Operation(summary = "Get all schedules")
    public ResponseEntity<ResponseObject> getAllSchedules() {
        return educationService.getAllSchedules();
    }

    @GetMapping("/api/classes")
    @Operation(summary = "Get all classes")
    public ResponseEntity<ResponseObject> getAllClasses() {
        return educationService.getAllClasses();
    }

    @GetMapping("/api/lessons")
    @Operation(summary = "Get all lessons")
    public ResponseEntity<ResponseObject> getAllLessons() {
        return educationService.getAllLessons();
    }

    @GetMapping("/api/syllabus")
    @Operation(summary = "Get all syllabi")
    public ResponseEntity<ResponseObject> getAllSyllabi() {
        return educationService.getAllSyllabi();
    }
}