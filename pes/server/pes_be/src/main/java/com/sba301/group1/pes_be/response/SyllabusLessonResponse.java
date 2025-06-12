package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.SyllabusLesson;
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
public class SyllabusLessonResponse {
    private Integer id;
    private String note;
    private SimpleSyllabusResponse syllabus;
    private SimpleLessonResponse lesson;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleSyllabusResponse {
        private Integer id;
        private String title;
        private String description;
        private String note;
        private SimpleSyllabusResponse syllabus;
        private SimpleLessonResponse lesson;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleLessonResponse {
        private Integer id;
        private String topic;
        private String description;
    }

    public static SyllabusLessonResponse fromEntity(SyllabusLesson syllabusLesson) {
        if (syllabusLesson == null) return null;

        SimpleSyllabusResponse syllabusResponse = null;
        if (syllabusLesson.getSyllabus() != null) {
            syllabusResponse = SimpleSyllabusResponse.builder()
                .id(syllabusLesson.getSyllabus().getId())
                .title(syllabusLesson.getSyllabus().getTitle())
                .description(syllabusLesson.getSyllabus().getDescription())
                .build();
        }

        SimpleLessonResponse lessonResponse = null;
        if (syllabusLesson.getLesson() != null) {
            lessonResponse = SimpleLessonResponse.builder()
                .id(syllabusLesson.getLesson().getId())
                .topic(syllabusLesson.getLesson().getTopic())
                .description(syllabusLesson.getLesson().getDescription())
                .build();
        }

        return SyllabusLessonResponse.builder()
            .id(syllabusLesson.getId())
            .note(syllabusLesson.getNote())
            .syllabus(syllabusResponse)
            .lesson(lessonResponse)
            .build();
    }

    public static List<SyllabusLessonResponse> fromEntityList(List<SyllabusLesson> syllabusLessons) {
        if (syllabusLessons == null) return null;
        return syllabusLessons.stream()
            .map(SyllabusLessonResponse::fromEntity)
            .collect(Collectors.toList());
    }
}
