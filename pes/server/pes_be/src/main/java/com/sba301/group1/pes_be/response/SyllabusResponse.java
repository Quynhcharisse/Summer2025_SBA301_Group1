package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.Syllabus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyllabusResponse {
    private Integer id;
    private String title;
    private String description;
    private List<SimpleLessonResponse> lessons;
    private List<SimpleClassResponse> classes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleLessonResponse {
        private Integer id;
        private String topic;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleClassResponse {
        private Integer id;
        private String name;
        private String grade;
        private String status;
    }

    public static SyllabusResponse fromEntity(Syllabus syllabus) {
        if (syllabus == null) return null;

        List<SimpleLessonResponse> lessonResponses = null;
        if (syllabus.getSyllabusLessonList() != null) {
            lessonResponses = syllabus.getSyllabusLessonList().stream()
                .filter(sl -> sl.getLesson() != null)
                .map(sl -> SimpleLessonResponse.builder()
                    .id(sl.getLesson().getId())
                    .topic(sl.getLesson().getTopic())
                    .description(sl.getLesson().getDescription())
                    .build())
                .collect(Collectors.toList());
        }

        List<SimpleClassResponse> classResponses = null;
        if (syllabus.getClassesList() != null) {
            classResponses = syllabus.getClassesList().stream()
                .map(c -> SimpleClassResponse.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .grade(c.getGrade() != null ? c.getGrade().toString() : null)
                    .status(c.getStatus())
                    .build())
                .collect(Collectors.toList());
        }

        return SyllabusResponse.builder()
            .id(syllabus.getId())
            .title(syllabus.getTitle())
            .description(syllabus.getDescription())
            .lessons(lessonResponses)
            .classes(classResponses)
            .build();
    }

    public static List<SyllabusResponse> fromEntityList(List<Syllabus> syllabi) {
        if (syllabi == null) return null;
        return syllabi.stream()
            .map(SyllabusResponse::fromEntity)
            .collect(Collectors.toList());
    }
}