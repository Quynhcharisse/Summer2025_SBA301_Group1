package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.SyllabusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/syllabi")
@RequiredArgsConstructor
@Tag(name = "Syllabus Management", description = "APIs for managing syllabi")
public class SyllabusController {

    private final SyllabusService syllabusService;

    @GetMapping
    @Operation(summary = "Get all syllabi")
    public ResponseEntity<ResponseObject> getAllSyllabi() {
        return syllabusService.getAllSyllabi();
    }

    @GetMapping("/{syllabusId}")
    @Operation(summary = "Get syllabus by ID")
    public ResponseEntity<ResponseObject> getSyllabusById(@PathVariable Integer syllabusId) {
        return syllabusService.getSyllabusById(syllabusId);
    }

    @GetMapping("/{syllabusId}/lessons")
    @Operation(summary = "Get lessons for a syllabus")
    public ResponseEntity<ResponseObject> getLessonsBySyllabusId(@PathVariable Integer syllabusId) {
        return syllabusService.getLessonsBySyllabusId(syllabusId);
    }

    @GetMapping("/search")
    @Operation(summary = "Search syllabi by title")
    public ResponseEntity<ResponseObject> getSyllabusByTitle(@RequestParam String title) {
        return syllabusService.getSyllabusByTitle(title);
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get syllabus for a class")
    public ResponseEntity<ResponseObject> getSyllabusByClassId(@PathVariable Integer classId) {
        return syllabusService.getSyllabusByClassId(classId);
    }
}