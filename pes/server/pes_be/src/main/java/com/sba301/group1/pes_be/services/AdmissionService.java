package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.AdmissionTermRequest;
import com.sba301.group1.pes_be.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface AdmissionService {
    ResponseEntity<ResponseObject> createAdmissionTerm(AdmissionTermRequest request);

    ResponseEntity<ResponseObject> viewAdmissionTerm();

    ResponseEntity<ResponseObject> updateAdmissionTerm(AdmissionTermRequest request);

    ResponseEntity<ResponseObject> viewAdmissionFormList(int year);

    ResponseEntity<ResponseObject> processAdmissionFormList(ProcessAdmissionFormRequest request);
}
