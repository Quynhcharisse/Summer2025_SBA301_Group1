package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.*;
import com.sba301.group1.pes_be.response.ResponseObject;
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

    @PostMapping("/form/submit")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> submitAdmissionForm(@RequestBody SubmitAdmissionFormRequest request, HttpServletRequest httpRequest) {
        return parentService.submitAdmissionForm(request, httpRequest);
    }

    @PutMapping("/form/cancel")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> cancelAdmissionForm(@RequestBody CancelAdmissionForm request, HttpServletRequest httpRequest) {
        return parentService.cancelAdmissionForm(request, httpRequest);
    }

                                    //------- Child Management ---------//
    // gôp getChild + submit vô chung tránh gọi API quá nhiều lần

    @PostMapping("/child")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> addChild(@RequestBody AddChildRequest request, HttpServletRequest httpRequest) {
        return parentService.addChild(request, httpRequest);
    }

    @PutMapping("/child")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> updateChild(@RequestBody UpdateChildRequest request, HttpServletRequest httpRequest) {
        return parentService.updateChild(request, httpRequest);
    }

    @GetMapping("/child")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> getChildrenByParent(HttpServletRequest request) {
        return parentService.getChildrenByParent(request);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getParentById(@PathVariable int id, HttpServletRequest request) {
        return parentService.getParentById(id, request);
    }

    @PutMapping("/update")
    public ResponseEntity<ResponseObject> updateParent(@RequestBody UpdateParentRequest request, HttpServletRequest httpRequest) {
        return parentService.updateParent(request, httpRequest);
    }
}
