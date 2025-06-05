package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.Lesson;
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
public class LessonResponse {
    private Integer id;
    private String topic;
    private String description;
    private List<SimpleSyllabusResponse> syllabuses;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleSyllabusResponse {
        private Integer id;
        private String title;
        private String description;
    }

    public static LessonResponse fromEntity(Lesson lesson) {
        if (lesson == null) return null;

        List<SimpleSyllabusResponse> syllabusResponses = null;
        if (lesson.getSyllabusLessonList() != null) {
            syllabusResponses = lesson.getSyllabusLessonList().stream()
                .filter(sl -> sl.getSyllabus() != null)
                .map(sl -> SimpleSyllabusResponse.builder()
                    .id(sl.getSyllabus().getId())
                    .title(sl.getSyllabus().getTitle())
                    .description(sl.getSyllabus().getDescription())
                    .build())
                .collect(Collectors.toList());
        }

        return LessonResponse.builder()
            .id(lesson.getId())
            .topic(lesson.getTopic())
            .description(lesson.getDescription())
            .syllabuses(syllabusResponses)
            .build();
    }

    public static List<LessonResponse> fromEntityList(List<Lesson> lessons) {
        if (lessons == null) return null;
        return lessons.stream()
            .map(LessonResponse::fromEntity)
            .collect(Collectors.toList());
    }
}