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
public class LessonDTO {
    private Integer id;
    private String topic;
    private String description;
    private List<SimpleSyllabusDTO> syllabuses;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleSyllabusDTO {
        private Integer id;
        private String title;
        private String description;
    }
}