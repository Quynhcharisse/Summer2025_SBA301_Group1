package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.models.SyllabusLesson;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusLessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.requests.SyllabusRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.response.SyllabusLessonResponse;
import com.sba301.group1.pes_be.response.SyllabusResponse;
import com.sba301.group1.pes_be.services.SyllabusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SyllabusServiceImpl implements SyllabusService {

    private final SyllabusRepo syllabusRepo;
    private final LessonRepo lessonRepo;
    private final SyllabusLessonRepo syllabusLessonRepo;

    @Override
    @Transactional
    public ResponseEntity<ResponseObject> createSyllabus(SyllabusRequest request) {
        Syllabus syllabus = Syllabus.builder().
                title(request.getTitle())
                .description(request.getDescription())
                .build();
        updateSyllabusLessons(request, syllabus);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Create syllabus successfully")
                        .success(true)
                        .data(SyllabusResponse.fromEntity(syllabus))
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
                                .data(SyllabusResponse.fromEntity(syllabus))
                                .build()
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseObject> updateSyllabus(Integer id, SyllabusRequest request) {
        return syllabusRepo.findById(id)
                .map(syllabus -> {
                    syllabus.setTitle(request.getTitle());
                    syllabus.setDescription(request.getDescription());
                    updateSyllabusLessons(request, syllabus);

                    return ResponseEntity.ok().body(
                            ResponseObject.builder()
                                    .message("Update syllabus successfully")
                                    .success(true)
                                    .data(SyllabusResponse.fromEntity(syllabus))
                                    .build()
                    );
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ResponseObject> viewSyllabusList() {
        List<Syllabus> syllabi = syllabusRepo.findAll();
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Syllabus list retrieved successfully")
                        .success(true)
                        .data(SyllabusResponse.fromEntityList(syllabi))
                        .build()
        );
    }

    @Transactional
    protected void updateSyllabusLessons(SyllabusRequest request, Syllabus syllabus) {
        syllabusRepo.save(syllabus);

        if (syllabus.getId() != null) {
            syllabusLessonRepo.deleteSyllabusLessonBySyllabus(syllabus);
        }

        if (request.getLessons() != null) {
            List<SyllabusLesson> syllabusLessons = new ArrayList<>();

            for (var lessonReq : request.getLessons()) {
                Lesson lesson = lessonRepo.findById(lessonReq.getLessonId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found"));

                SyllabusLesson syllabusLesson = SyllabusLesson.builder()
                        .syllabus(syllabus)
                        .lesson(lesson)
                        .note(lessonReq.getNote())
                        .build();

                syllabusLessons.add(syllabusLesson);
            }

            syllabusLessonRepo.saveAll(syllabusLessons);

            syllabus.setSyllabusLessonList(syllabusLessons);
        } else {
            syllabus.setSyllabusLessonList(new ArrayList<>());
        }
    }
}
