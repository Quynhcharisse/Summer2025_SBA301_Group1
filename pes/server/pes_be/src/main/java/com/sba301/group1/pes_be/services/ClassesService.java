package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface ClassesService {
    
    ResponseEntity<ResponseObject> getAllClasses();
    
    ResponseEntity<ResponseObject> getClassById(Integer classId);
    
    ResponseEntity<ResponseObject> getSyllabusByClassId(Integer classId);
    
    ResponseEntity<ResponseObject> getLessonsByClassId(Integer classId);
    
    ResponseEntity<ResponseObject> getClassesByStatus(String status);
    
    ResponseEntity<ResponseObject> getClassesByTeacherId(Integer teacherId);
    
    ResponseEntity<ResponseObject> getClassesByGrade(String grade);
}