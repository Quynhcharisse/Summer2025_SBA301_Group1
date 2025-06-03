package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.HRService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/hr")
@RequiredArgsConstructor
public class HRController {

    private final HRService hrService;

    @GetMapping("/parent")
    @PreAuthorize("hasRole('hr')")
    public ResponseEntity<ResponseObject> getParentById(@RequestBody int id, HttpServletRequest httpRequest) {
        return hrService.getParentById(id, httpRequest);
    }

    @PutMapping("/parent/update")
    @PreAuthorize("hasRole('hr')")
    public ResponseEntity<ResponseObject> updateParent(@RequestBody ParentRequest request, HttpServletRequest httpRequest) {
        return hrService.updateParent(request, httpRequest);
    }

    @PostMapping("/parent/remove")
    @PreAuthorize("hasRole('hr')")// update later role can delete parent
    public ResponseEntity<ResponseObject> deleteParent(@RequestBody int id, HttpServletRequest httpRequest) {
        return hrService.deleteParent(id, httpRequest);
    }
}
