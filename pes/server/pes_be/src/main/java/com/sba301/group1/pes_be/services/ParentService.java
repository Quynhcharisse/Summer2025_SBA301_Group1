package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.AddChildRequest;
import com.sba301.group1.pes_be.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.requests.SubmitAdmissionFormRequest;
import com.sba301.group1.pes_be.requests.UpdateChildRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface ParentService {

    ResponseEntity<ResponseObject> viewAdmissionFormList(HttpServletRequest request);

    ResponseEntity<ResponseObject> cancelAdmissionForm(CancelAdmissionForm request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> submitAdmissionForm(SubmitAdmissionFormRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> addChild(AddChildRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> updateChild(UpdateChildRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getChildrenByParent(HttpServletRequest request);
}