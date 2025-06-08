package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.ClassRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ClassesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/class")
@RequiredArgsConstructor
@Tag(name = "Classes", description = "Class management APIs")
public class ClassesController {

    private final ClassesService classService;

    @PostMapping()
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a class", description = "Allows educations to create a new class")
    public ResponseEntity<ResponseObject> createClass(@RequestBody ClassRequest request) {
        return classService.createClass(request);
    }

    @PutMapping("/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Update a class", description = "Allows educations to update an existing class")
    public ResponseEntity<ResponseObject> updateClass(@PathVariable Integer classId, @RequestBody ClassRequest request) {
        return classService.updateClass(classId, request);
    }

    @GetMapping("/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "View class", description = "Allows educations to view class details")
    public ResponseEntity<ResponseObject> viewClass(@PathVariable Integer classId) {
        return classService.viewClass(classId);
    }

    @GetMapping("")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "View class list", description = "Allows education staff to view all classes for a specific year")
    public ResponseEntity<ResponseObject> viewClassList() {
        return classService.viewClassList();
    }
}