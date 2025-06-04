package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface LessonService {
    
    ResponseEntity<ResponseObject> getAllLessons();
    
    ResponseEntity<ResponseObject> getLessonById(Integer lessonId);
    
    ResponseEntity<ResponseObject> getLessonsByTopic(String topic);
    
    ResponseEntity<ResponseObject> getLessonsBySyllabusId(Integer syllabusId);
    
    ResponseEntity<ResponseObject> getLessonsByClassId(Integer classId);
}