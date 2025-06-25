package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.HRService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/hr")
@RequiredArgsConstructor
public class HRController {

    private final HRService hrService;

    @GetMapping("/parent/{id}")
    @PreAuthorize("hasRole('hr')")
    public ResponseEntity<ResponseObject> getParentById(@PathVariable int id, HttpServletRequest httpRequest) {
        return hrService.getParentById(id, httpRequest);
    }

    @PutMapping("/parent/update")
    @PreAuthorize("hasRole('hr')")
    public ResponseEntity<ResponseObject> updateParent(@RequestBody ParentRequest request, HttpServletRequest httpRequest) {
        return hrService.updateParent(request, httpRequest);
    }

    @PutMapping("/parent/remove")
    @PreAuthorize("hasRole('hr')")// update later role can delete parent
    public ResponseEntity<ResponseObject> banParent(@RequestParam int id, HttpServletRequest httpRequest) {
        System.out.println("id: "+id);
        return hrService.banParent(id, httpRequest);
    }

    @PutMapping("/parent/unban")
    @PreAuthorize("hasRole('hr')")
    public ResponseEntity<ResponseObject> unbanParent(@RequestParam int id, HttpServletRequest httpRequest) {
        System.out.println("id: "+id);
        return hrService.unbanParent(id, httpRequest);
    }

    @GetMapping("/parent-list")
    @PreAuthorize("hasRole('hr')")
    public ResponseEntity<ResponseObject> getParentList(HttpServletRequest httpRequest) {
        return hrService.getParentList(httpRequest);
    }
}
