package com.sba301.group1.pes_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyllabusLessonDTO {
    private Integer id;
    private String note;
    private SimpleSyllabusDTO syllabus;
    private SimpleLessonDTO lesson;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleSyllabusDTO {
        private Integer id;
        private String title;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleLessonDTO {
        private Integer id;
        private String topic;
        private String description;
    }
}