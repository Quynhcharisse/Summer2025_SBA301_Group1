package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.requests.SaveDraftAdmissionFormRequest;
import com.sba301.group1.pes_be.requests.SubmitAdmissionFormRequest;
import com.sba301.group1.pes_be.services.ParentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/parent")
@RequiredArgsConstructor
public class ParentController {

    private final ParentService parentService;

    @GetMapping("/form/list")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> viewAdmissionFormList(HttpServletRequest request) {
        return parentService.viewAdmissionFormList(request);
    }

    @PutMapping("/form/submit")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> submitAdmissionForm(@RequestBody SubmitAdmissionFormRequest request, HttpServletRequest httpRequest) {
        return parentService.submitAdmissionForm(request, httpRequest);
    }

    @PutMapping("/form/cancel")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> cancelAdmissionForm(@RequestBody int id, HttpServletRequest httpRequest) {
        return parentService.cancelAdmissionForm(id, httpRequest);
    }

    @GetMapping("/children")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> getChildren(HttpServletRequest request) {
        return parentService.getChildren(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> getParentById(@PathVariable int id, HttpServletRequest httpRequest) {
        return parentService.getParentById(id, httpRequest);
    }

    @PutMapping()
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> updateParent(@RequestBody ParentRequest request, HttpServletRequest httpRequest) {
        return parentService.updateParent(request, httpRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('parent')")// update later role can delete parent
    public ResponseEntity<ResponseObject> deleteParent(@PathVariable int id, HttpServletRequest httpRequest) {
        return parentService.deleteParent(id, httpRequest);
    }
}
