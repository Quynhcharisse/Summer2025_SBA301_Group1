package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.ChildRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ChildService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/child")
@RequiredArgsConstructor
public class ChildController {

    private final ChildService childService;

    @PostMapping
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> addChild(@RequestBody ChildRequest childRequest, HttpServletRequest request) {
        return childService.addChild(childRequest, request);
    }

    @PutMapping
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> updateChild(@RequestBody ChildRequest childRequest, HttpServletRequest request) {
        return childService.updateChild(childRequest, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> deleteChild(@PathVariable int id, HttpServletRequest request) {
        return childService.deleteChild(id, request);
    }
}
