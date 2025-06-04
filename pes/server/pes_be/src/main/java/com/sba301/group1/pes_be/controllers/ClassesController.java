package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ClassesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@Tag(name = "Classes Management", description = "APIs for managing classes")
public class ClassesController {

    private final ClassesService classesService;

    @GetMapping
    @Operation(summary = "Get all classes")
    public ResponseEntity<ResponseObject> getAllClasses() {
        return classesService.getAllClasses();
    }

    @GetMapping("/{classId}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ResponseObject> getClassById(@PathVariable Integer classId) {
        return classesService.getClassById(classId);
    }

    @GetMapping("/{classId}/syllabus")
    @Operation(summary = "Get syllabus for a class")
    public ResponseEntity<ResponseObject> getSyllabusByClassId(@PathVariable Integer classId) {
        return classesService.getSyllabusByClassId(classId);
    }

    @GetMapping("/{classId}/lessons")
    @Operation(summary = "Get lessons for a class via syllabus")
    public ResponseEntity<ResponseObject> getLessonsByClassId(@PathVariable Integer classId) {
        return classesService.getLessonsByClassId(classId);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get classes by status")
    public ResponseEntity<ResponseObject> getClassesByStatus(@PathVariable String status) {
        return classesService.getClassesByStatus(status);
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get classes by teacher ID")
    public ResponseEntity<ResponseObject> getClassesByTeacherId(@PathVariable Integer teacherId) {
        return classesService.getClassesByTeacherId(teacherId);
    }

    @GetMapping("/grade/{grade}")
    @Operation(summary = "Get classes by grade")
    public ResponseEntity<ResponseObject> getClassesByGrade(@PathVariable String grade) {
        return classesService.getClassesByGrade(grade);
    }
}