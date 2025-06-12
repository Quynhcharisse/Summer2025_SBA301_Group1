package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.SyllabusRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface SyllabusService {
    ResponseEntity<ResponseObject> createSyllabus(SyllabusRequest request);

    ResponseEntity<ResponseObject> viewSyllabus(Integer id);

    ResponseEntity<ResponseObject> updateSyllabus(Integer id, SyllabusRequest request);

    ResponseEntity<ResponseObject> viewSyllabusList();

}
