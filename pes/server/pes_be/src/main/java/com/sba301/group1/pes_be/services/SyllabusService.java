package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface SyllabusService {
    
    ResponseEntity<ResponseObject> getAllSyllabi();
    
    ResponseEntity<ResponseObject> getSyllabusById(Integer syllabusId);
    
    ResponseEntity<ResponseObject> getLessonsBySyllabusId(Integer syllabusId);
    
    ResponseEntity<ResponseObject> getSyllabusByTitle(String title);
    
    ResponseEntity<ResponseObject> getSyllabusByClassId(Integer classId);
}