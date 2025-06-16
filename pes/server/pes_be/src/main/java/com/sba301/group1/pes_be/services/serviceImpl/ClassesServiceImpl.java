package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.requests.ClassRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.response.ClassesResponse;
import com.sba301.group1.pes_be.services.ClassesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassesServiceImpl implements ClassesService {

    private final ClassesRepo classRepo;
    private final AccountRepo accountRepo;
    private final SyllabusRepo syllabusRepo;

    @Override
    public ResponseEntity<ResponseObject> createClass(ClassRequest request) {
        // Validate teacherId is not null
        if (request.getTeacherId() == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Teacher ID cannot be null")
                            .success(false)
                            .build()
            );
        }

        // Validate syllabusId is not null
        if (request.getSyllabusId() == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Syllabus ID cannot be null")
                            .success(false)
                            .build()
            );
        }

        Account teacher = accountRepo.findById(request.getTeacherId()).orElse(null);
        if (teacher == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Teacher not found")
                            .success(false)
                            .build()
            );
        }

        Syllabus syllabus = syllabusRepo.findById(request.getSyllabusId()).orElse(null);
        if (syllabus == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Syllabus not found")
                            .success(false)
                            .build()
            );
        }

        Classes classes = Classes.builder()
                .name(request.getName())
                .teacher(teacher)
                .syllabus(syllabus)
                .numberStudent(request.getNumberStudent())
                .roomNumber(request.getRoomNumber())
                .startDate(request.getStartDate().toString())
                .endDate(request.getEndDate().toString())
                .status(request.getStatus())
                .build();

        classRepo.save(classes);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Create class successfully")
                        .success(true)
                        .data(classes)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewClass(Integer classId) {
        return classRepo.findById(classId)
                .map(classes -> {
                    ClassesResponse classResponse = ClassesResponse.fromEntity(classes);
                    return ResponseEntity.ok().body(
                            ResponseObject.builder()
                                    .message("Class found")
                                    .success(true)
                                    .data(classResponse)
                                    .build()
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ResponseObject> updateClass(Integer classId, ClassRequest request) {
        // Validate teacherId is not null
        if (request.getTeacherId() == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Teacher ID cannot be null")
                            .success(false)
                            .build()
            );
        }

        // Validate syllabusId is not null
        if (request.getSyllabusId() == null) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message("Syllabus ID cannot be null")
                            .success(false)
                            .build()
            );
        }

        return classRepo.findById(classId)
                .map(classes -> {
                    Account teacher = accountRepo.findById(request.getTeacherId()).orElse(null);
                    if (teacher == null) {
                        return ResponseEntity.badRequest().body(
                                ResponseObject.builder()
                                        .message("Teacher not found")
                                        .success(false)
                                        .build()
                        );
                    }

                    Syllabus syllabus = syllabusRepo.findById(request.getSyllabusId()).orElse(null);
                    if (syllabus == null) {
                        return ResponseEntity.badRequest().body(
                                ResponseObject.builder()
                                        .message("Syllabus not found")
                                        .success(false)
                                        .build()
                        );
                    }

                    classes.setName(request.getName());
                    classes.setTeacher(teacher);
                    classes.setSyllabus(syllabus);
                    classes.setNumberStudent(request.getNumberStudent());
                    classes.setRoomNumber(request.getRoomNumber());
                    classes.setStartDate(request.getStartDate().toString());
                    classes.setEndDate(request.getEndDate().toString());
                    classes.setStatus(request.getStatus());

                    classRepo.save(classes);
                    return ResponseEntity.ok().body(
                            ResponseObject.builder()
                                    .message("Update class successfully")
                                    .success(true)
                                    .data(classes)
                                    .build()
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ResponseObject> viewClassList() {
        List<Classes> classes = classRepo.findAll();
        List<ClassesResponse> classesResponses = ClassesResponse.fromEntityList(classes);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Class list retrieved successfully")
                        .success(true)
                        .data(classesResponses)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> deleteClass(Integer classId) {
        return classRepo.findById(classId)
                .map(classes -> {
                    try {
                        classRepo.delete(classes);
                        return ResponseEntity.ok().body(
                                ResponseObject.builder()
                                        .message("Class deleted successfully")
                                        .success(true)
                                        .build()
                        );
                    } catch (Exception e) {
                        // Handle cases where deletion fails due to foreign key constraints
                        return ResponseEntity.status(409).body(
                                ResponseObject.builder()
                                        .message("Cannot delete class. It may have dependencies (students, activities, schedules, etc.)")
                                        .success(false)
                                        .build()
                        );
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
