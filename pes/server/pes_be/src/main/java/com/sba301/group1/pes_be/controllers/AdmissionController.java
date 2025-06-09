package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.requests.UpdateAdmissionTermRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.AdmissionService;
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
@RequestMapping("api/v1/admission")
@RequiredArgsConstructor
public class AdmissionController {

    private final AdmissionService admissionService;

    @PostMapping("/term")
    @PreAuthorize("hasRole('admission')")
    public ResponseEntity<ResponseObject> createAdmissionTerm(@RequestBody CreateAdmissionTermRequest request) {
        return admissionService.createAdmissionTerm(request);
    }

    @PutMapping("/term")
    @PreAuthorize("hasRole('admission')")
    public ResponseEntity<ResponseObject> updateAdmissionTerm(@RequestBody UpdateAdmissionTermRequest request) {
        return admissionService.updateAdmissionTerm(request);
    }

    @GetMapping("/term")
    @PreAuthorize("hasRole('admission')")
    public ResponseEntity<ResponseObject> viewAdmissionTerm(int year) {
        return admissionService.viewAdmissionTerm(year);
    }

    @GetMapping("/form/list")
    @PreAuthorize("hasRole('admission')")
    public ResponseEntity<ResponseObject> viewAdmissionFormList() {
        return admissionService.viewAdmissionFormList();
    }

    @PutMapping("/form/process")
    @PreAuthorize("hasRole('admission')")
    public ResponseEntity<ResponseObject> processAdmissionFormList(@RequestBody ProcessAdmissionFormRequest request) {
        return admissionService.processAdmissionFormList(request);
    }
}
