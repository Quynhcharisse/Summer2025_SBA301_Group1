package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.dto.requests.AddChildRequest;
import com.sba301.group1.pes_be.dto.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.dto.requests.RefillFormRequest;
import com.sba301.group1.pes_be.dto.requests.SubmitAdmissionFormRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateChildRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateParentRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface ParentService {

    ResponseEntity<ResponseObject> viewAdmissionFormList(HttpServletRequest request);

    ResponseEntity<ResponseObject> cancelAdmissionForm(CancelAdmissionForm request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> refillForm(RefillFormRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> submitAdmissionForm(SubmitAdmissionFormRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> addChild(AddChildRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> updateChild(UpdateChildRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> viewChild(HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> viewProfileParent(HttpServletRequest request);

    ResponseEntity<ResponseObject> updateProfileParent(UpdateParentRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getStudentClasses(int studentId, HttpServletRequest request);

    ResponseEntity<ResponseObject> getActivitiesByClassId(int classId, HttpServletRequest request);

    ResponseEntity<ResponseObject> getSyllabusByClassId(int classId, HttpServletRequest request);
}