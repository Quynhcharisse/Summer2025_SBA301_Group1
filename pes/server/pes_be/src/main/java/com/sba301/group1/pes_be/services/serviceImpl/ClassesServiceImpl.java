package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ClassesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassesServiceImpl implements ClassesService {

    private final ClassesRepo classesRepo;
    private final SyllabusRepo syllabusRepo;
    private final LessonRepo lessonRepo;

    @Override
    public ResponseEntity<ResponseObject> getAllClasses() {
        try {
            List<Classes> classes = classesRepo.findAll();
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassById(Integer classId) {
        try {
            Optional<Classes> classOpt = classesRepo.findById(classId);
            if (classOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Class retrieved successfully")
                    .success(true)
                    .data(classOpt.get())
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving class: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusByClassId(Integer classId) {
        try {
            if (!classesRepo.existsById(classId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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

    @Override
    public ResponseEntity<ResponseObject> getLessonsByClassId(Integer classId) {
        try {
            if (!classesRepo.existsById(classId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<Lesson> lessons = lessonRepo.findByClassId(classId);
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
    public ResponseEntity<ResponseObject> getClassesByStatus(String status) {
        try {
            List<Classes> classes = classesRepo.findByStatus(status);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassesByTeacherId(Integer teacherId) {
        try {
            List<Classes> classes = classesRepo.findByTeacherId(teacherId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassesByGrade(String grade) {
        try {
            Grade gradeEnum;
            try {
                gradeEnum = Grade.valueOf(grade.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message("Invalid grade value")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<Classes> classes = classesRepo.findByGrade(gradeEnum);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }
}