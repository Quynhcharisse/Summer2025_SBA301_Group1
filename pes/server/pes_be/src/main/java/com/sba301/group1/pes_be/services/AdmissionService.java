package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.requests.CreateExtraTermRequest;
import com.sba301.group1.pes_be.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface AdmissionService {
    ResponseEntity<ResponseObject> createAdmissionTerm(CreateAdmissionTermRequest request);

    ResponseEntity<ResponseObject> viewAdmissionTerm();

    ResponseEntity<ResponseObject> createExtraTerm(CreateExtraTermRequest request);

    ResponseEntity<ResponseObject> viewAdmissionFormList();

    ResponseEntity<ResponseObject> processAdmissionFormList(ProcessAdmissionFormRequest request);
}
