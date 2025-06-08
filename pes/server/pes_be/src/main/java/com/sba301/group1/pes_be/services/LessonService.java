package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.LessonRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

public interface LessonService {

    ResponseEntity<ResponseObject> createLesson(LessonRequest request);
    ResponseEntity<ResponseObject> updateLesson(Integer lessonId, LessonRequest request);
    ResponseEntity<ResponseObject> viewLesson(Integer lessonId);
    ResponseEntity<ResponseObject> viewAllLessons();
}
