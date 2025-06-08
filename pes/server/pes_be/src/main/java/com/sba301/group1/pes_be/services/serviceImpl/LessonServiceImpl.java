package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.requests.LessonRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepo lessonRepo;

    @Override
    public ResponseEntity<ResponseObject> createLesson(LessonRequest request) {
        Lesson lesson =  Lesson.builder().topic(request.getTopic()).description(request.getDescription()).build();

        lessonRepo.save(lesson);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Create lesson successfully")
                        .success(true)
                        .data(lesson)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> updateLesson(Integer lessonId, LessonRequest request) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        if (lesson == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Lesson not found")
                            .success(false)
                            .build()
            );
        }

        lesson.setTopic(request.getTopic());
        lesson.setDescription(request.getDescription());
        lessonRepo.save(lesson);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Update lesson successfully")
                        .success(true)
                        .data(lesson)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewLesson(Integer lessonId) {
        Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
        if (lesson == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Lesson not found")
                            .success(false)
                            .build()
            );
        }

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("View lesson successfully")
                        .success(true)
                        .data(lesson)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewAllLessons() {
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("View all lessons successfully")
                        .success(true)
                        .data(lessonRepo.findAll())
                        .build()
        );
    }
}
