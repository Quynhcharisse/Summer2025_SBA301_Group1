package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.SyllabusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SyllabusServiceImpl implements SyllabusService {

    private final SyllabusRepo syllabusRepo;
    private final LessonRepo lessonRepo;

    @Override
    public ResponseEntity<ResponseObject> getAllSyllabi() {
        try {
            List<Syllabus> syllabi = syllabusRepo.findAll();
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All syllabi retrieved successfully")
                    .success(true)
                    .data(syllabi)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabi: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusById(Integer syllabusId) {
        try {
            Optional<Syllabus> syllabusOpt = syllabusRepo.findById(syllabusId);
            if (syllabusOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Syllabus not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Syllabus retrieved successfully")
                    .success(true)
                    .data(syllabusOpt.get())
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabus: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getLessonsBySyllabusId(Integer syllabusId) {
        try {
            if (!syllabusRepo.existsById(syllabusId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Syllabus not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<Lesson> lessons = lessonRepo.findBySyllabusId(syllabusId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Lessons retrieved successfully")
                    .success(true)
                    .data(lessons)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving lessons: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusByTitle(String title) {
        try {
            List<Syllabus> syllabi = syllabusRepo.findByTitleContaining(title);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Syllabi retrieved successfully")
                    .success(true)
                    .data(syllabi)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabi: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusByClassId(Integer classId) {
        try {
            Syllabus syllabus = syllabusRepo.findByClassId(classId);
            if (syllabus == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No syllabus found for this class")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Syllabus retrieved successfully")
                    .success(true)
                    .data(syllabus)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabus: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }
}