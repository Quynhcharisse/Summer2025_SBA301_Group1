package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.dto.requests.AddTeacherRequest;
import com.sba301.group1.pes_be.dto.requests.ParentRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateTeacherRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface HRService {
    ResponseEntity<ResponseObject> getParentById(int id, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> updateParent(ParentRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> banParent(int id, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> unbanParent(int id, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getParentList(HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getAllTeachers(HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> addTeacher(AddTeacherRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> updateTeacherProfile(int id, UpdateTeacherRequest request, HttpServletRequest httpRequest);
}
