package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.SyllabusRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.SyllabusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/syllabus")
@RequiredArgsConstructor
@PreAuthorize("hasRole('education')")
@Tag(name = "Syllabus", description = "Syllabus management APIs")
public class SyllabusController {

    private final SyllabusService syllabusService;

    @PostMapping()
    @Operation(summary = "Create a syllabus", description = "Allows education staff to create a new syllabus")
    public ResponseEntity<ResponseObject> createSyllabus(@RequestBody SyllabusRequest request) {
        return syllabusService.createSyllabus(request);
    }

    @PutMapping("/{syllabusId}")
    @Operation(summary = "Update a syllabus", description = "Allows education staff to update an existing syllabus")
    public ResponseEntity<ResponseObject> updateSyllabus(@PathVariable Integer syllabusId, @RequestBody SyllabusRequest request) {
        return syllabusService.updateSyllabus(syllabusId, request);
    }

    @GetMapping("/{syllabusId}")
    @Operation(summary = "View a syllabus", description = "Allows education staff to view a specific syllabus by ID")
    public ResponseEntity<ResponseObject> viewSyllabus(@PathVariable Integer syllabusId) {
        return syllabusService.viewSyllabus(syllabusId);
    }

    @GetMapping("/")
    @Operation(summary = "View syllabus list", description = "Allows education staff to view all syllabi")
    public ResponseEntity<ResponseObject> viewSyllabusList() {
        return syllabusService.viewSyllabusList();
    }
}
