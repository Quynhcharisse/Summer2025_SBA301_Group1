package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.requests.SyllabusRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.SyllabusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SyllabusServiceImpl implements SyllabusService {

    private final SyllabusRepo syllabusRepo;

    @Override
    public ResponseEntity<ResponseObject> createSyllabus(SyllabusRequest request) {
        Syllabus syllabus = Syllabus.builder().
                title(request.getTitle())
                .description(request.getDescription())
                .build();
        syllabusRepo.save(syllabus);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Create syllabus successfully")
                        .success(true)
                        .data(syllabus)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewSyllabus(Integer id) {
        return syllabusRepo.findById(id)
                .map(syllabus -> ResponseEntity.ok().body(
                        ResponseObject.builder()
                                .message("Syllabus found")
                                .success(true)
                                .data(syllabus)
                                .build()
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ResponseObject> updateSyllabus(Integer id, SyllabusRequest request) {
        return syllabusRepo.findById(id)
                .map(syllabus -> {
                    syllabus.setTitle(request.getTitle());
                    syllabus.setDescription(request.getDescription());
                    syllabusRepo.save(syllabus);
                    return ResponseEntity.ok().body(
                            ResponseObject.builder()
                                    .message("Update syllabus successfully")
                                    .success(true)
                                    .data(syllabus)
                                    .build()
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ResponseObject> viewSyllabusList() {
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Syllabus list retrieved successfully")
                        .success(true)
                        .data(syllabusRepo.findAll())
                        .build()
        );
    }
}
