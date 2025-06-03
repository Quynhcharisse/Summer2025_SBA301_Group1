package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.ChildRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface ChildService {
    ResponseEntity<ResponseObject> addChild(ChildRequest childRequest, HttpServletRequest request);

    ResponseEntity<ResponseObject> updateChild(ChildRequest childRequest, HttpServletRequest request);

    ResponseEntity<ResponseObject> deleteChild(int id, HttpServletRequest request);
}
