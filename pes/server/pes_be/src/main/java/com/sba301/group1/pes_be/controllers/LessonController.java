package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.LessonRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.LessonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/lesson")
@RequiredArgsConstructor
@PreAuthorize("hasRole('education')")
@Tag(name = "Lesson", description = "Lesson management APIs")
public class LessonController {

    private final LessonService lessonService;

    @PostMapping()
    @Operation(summary = "Create a lesson", description = "Allows education staff to create a new lesson")
    public ResponseEntity<ResponseObject> createLesson(@RequestBody LessonRequest request) {
        return lessonService.createLesson(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a lesson", description = "Allows education staff to update an existing lesson")
    public ResponseEntity<ResponseObject> updateLesson(@PathVariable int id, @RequestBody LessonRequest request) {
        return lessonService.updateLesson(id, request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "View a lesson", description = "Allows education staff to view a specific lesson by ID")
    public ResponseEntity<ResponseObject> viewLesson(@PathVariable int id) {
        return lessonService.viewLesson(id);
    }

    @GetMapping("/")
    @Operation(summary = "View lesson list", description = "Allows education staff to view all lessons")
    public ResponseEntity<ResponseObject> viewLessonList() {
        return lessonService.viewAllLessons();
    }
}