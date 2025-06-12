package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.ClassRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ClassesService {
    ResponseEntity<ResponseObject> createClass(ClassRequest request);

    ResponseEntity<ResponseObject> viewClass(Integer classId);

    ResponseEntity<ResponseObject> updateClass(Integer classId, ClassRequest request);

    ResponseEntity<ResponseObject> viewClassList();
}
