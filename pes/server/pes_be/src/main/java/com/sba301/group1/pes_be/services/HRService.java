package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface HRService {
    ResponseEntity<ResponseObject> getParentById(int id, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> updateParent(ParentRequest request, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> deleteParent(int id, HttpServletRequest httpRequest);

    ResponseEntity<ResponseObject> getAllParents(HttpServletRequest request);

}
