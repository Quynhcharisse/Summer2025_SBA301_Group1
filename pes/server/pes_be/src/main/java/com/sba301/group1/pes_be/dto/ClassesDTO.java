package com.sba301.group1.pes_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassesDTO {
    private Integer id;
    private String name;
    private int numberStudent;
    private String roomNumber;
    private String startDate;
    private String endDate;
    private String status;
    private String grade;
    private SimpleSyllabusDTO syllabus;
    private SimpleTeacherDTO teacher;

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
    public static class SimpleTeacherDTO {
        private Integer id;
        private String email;
        private String firstName;
        private String lastName;
    }
}