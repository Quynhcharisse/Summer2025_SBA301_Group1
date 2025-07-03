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

    @PostMapping("/form/refill")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> refillForm(@RequestBody RefillFormRequest request, HttpServletRequest httpRequest) {
        return parentService.refillForm(request, httpRequest);
    }

    @GetMapping("/form/refill/list")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> viewRefillFormList(HttpServletRequest request) {
        return parentService.viewRefillFormList(request);
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
    public ResponseEntity<ResponseObject> viewChild(HttpServletRequest request) {
        return parentService.viewChild(request);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> viewProfileParent(HttpServletRequest request) {
        return parentService.viewProfileParent(request);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> updateProfileParent(@RequestBody UpdateParentRequest request, HttpServletRequest httpRequest) {
        return parentService.updateProfileParent(request, httpRequest);
    }

    @GetMapping("/student-classes/{studentId}")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> getStudentClasses(@PathVariable int studentId, HttpServletRequest request) {
        return parentService.getStudentClasses(studentId, request);
    }

    @GetMapping("/activities/{classId}")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> getActivitiesByClassId(@PathVariable int classId, HttpServletRequest request) {
        return parentService.getActivitiesByClassId(classId, request);
    }

    @GetMapping("/syllabus/{classId}")
    @PreAuthorize("hasRole('parent')")
    public ResponseEntity<ResponseObject> getSyllabusByClassId(@PathVariable int classId, HttpServletRequest request) {
        return parentService.getSyllabusByClassId(classId, request);
    }
}
