package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.requests.SubmitAdmissionFormRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface ParentService {

    ResponseEntity<ResponseObject> viewAdmissionFormList(HttpServletRequest request);

    ResponseEntity<ResponseObject> cancelAdmissionForm(CancelAdmissionForm request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> submitAdmissionForm(SubmitAdmissionFormRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getChildren (HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getParentById(int id, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> updateParent(ParentRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> deleteParent(int id, HttpServletRequest httpRequest);
}
