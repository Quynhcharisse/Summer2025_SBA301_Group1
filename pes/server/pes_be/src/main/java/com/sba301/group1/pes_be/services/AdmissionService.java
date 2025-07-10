package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.dto.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.dto.requests.CreateExtraTermRequest;
import com.sba301.group1.pes_be.dto.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateAdmissionTermRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface AdmissionService {
    ResponseEntity<ResponseObject> createAdmissionTerm(CreateAdmissionTermRequest request);

    ResponseEntity<ResponseObject> updateTermStatus(UpdateAdmissionTermRequest request);

    ResponseEntity<ResponseObject> viewAdmissionTerm();

    ResponseEntity<ResponseObject> createExtraTerm(CreateExtraTermRequest request);

    ResponseEntity<ResponseObject> viewAdmissionFormList();

    ResponseEntity<ResponseObject> processAdmissionFormList(ProcessAdmissionFormRequest request);
}
