package com.sba301.group1.pes_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SyllabusDTO {
    private Integer id;
    private String title;
    private String description;
    private List<SimpleLessonDTO> lessons;
    private List<SimpleClassDTO> classes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleLessonDTO {
        private Integer id;
        private String topic;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleClassDTO {
        private Integer id;
        private String name;
        private String grade;
        private String status;
    }
}