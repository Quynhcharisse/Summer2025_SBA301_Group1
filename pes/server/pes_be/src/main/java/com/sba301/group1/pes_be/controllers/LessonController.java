package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
@Tag(name = "Lesson Management", description = "APIs for managing lessons")
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    @Operation(summary = "Get all lessons")
    public ResponseEntity<ResponseObject> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @GetMapping("/{lessonId}")
    @Operation(summary = "Get lesson by ID")
    public ResponseEntity<ResponseObject> getLessonById(@PathVariable Integer lessonId) {
        return lessonService.getLessonById(lessonId);
    }

    @GetMapping("/search")
    @Operation(summary = "Search lessons by topic")
    public ResponseEntity<ResponseObject> getLessonsByTopic(@RequestParam String topic) {
        return lessonService.getLessonsByTopic(topic);
    }

    @GetMapping("/syllabus/{syllabusId}")
    @Operation(summary = "Get lessons by syllabus ID")
    public ResponseEntity<ResponseObject> getLessonsBySyllabusId(@PathVariable Integer syllabusId) {
        return lessonService.getLessonsBySyllabusId(syllabusId);
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get lessons by class ID")
    public ResponseEntity<ResponseObject> getLessonsByClassId(@PathVariable Integer classId) {
        return lessonService.getLessonsByClassId(classId);
    }
}