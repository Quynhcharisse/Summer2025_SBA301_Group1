package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ClassRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.requests.ClassRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepo classRepo;
    private final AccountRepo accountRepo;
    private final SyllabusRepo syllabusRepo;

    @Override
    public ResponseEntity<ResponseObject> createClass(ClassRequest request) {
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
                .map(classes -> ResponseEntity.ok().body(
                        ResponseObject.builder()
                                .message("Class found")
                                .success(true)
                                .data(classes)
                                .build()
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ResponseObject> updateClass(Integer classId, ClassRequest request) {
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
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Class list retrieved successfully")
                        .success(true)
                        .data(classRepo.findAll())
                        .build()
        );
    }
}
