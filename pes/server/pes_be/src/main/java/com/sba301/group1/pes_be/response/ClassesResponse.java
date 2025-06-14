package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.Classes;
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
public class ClassesResponse {
    private Integer id;
    private String name;
    private int numberStudent;
    private String roomNumber;
    private String startDate;
    private String endDate;
    private String status;
    private String grade;
    private SimpleSyllabusResponse syllabus;
    private SimpleTeacherResponse teacher;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleSyllabusResponse {
        private Integer id;
        private String title;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleTeacherResponse {
        private Integer id;
        private String email;
        private String firstName;
        private String lastName;
    }

    public static ClassesResponse fromEntity(Classes classes) {
        if (classes == null) return null;

        SimpleSyllabusResponse syllabusResponse = null;
        if (classes.getSyllabus() != null) {
            syllabusResponse = SimpleSyllabusResponse.builder()
                .id(classes.getSyllabus().getId())
                .title(classes.getSyllabus().getTitle())
                .description(classes.getSyllabus().getDescription())
                .build();
        }

        SimpleTeacherResponse teacherResponse = null;
        if (classes.getTeacher() != null) {
            teacherResponse = SimpleTeacherResponse.builder()
                .id(classes.getTeacher().getId())
                .email(classes.getTeacher().getEmail())
                .firstName(classes.getTeacher().getName())
                .lastName("") // Account model only has name field
                .build();
        }

        return ClassesResponse.builder()
            .id(classes.getId())
            .name(classes.getName())
            .numberStudent(classes.getNumberStudent())
            .roomNumber(classes.getRoomNumber())
            .startDate(classes.getStartDate())
            .endDate(classes.getEndDate())
            .status(classes.getStatus())
            .grade(classes.getGrade() != null ? classes.getGrade().toString() : null)
            .syllabus(syllabusResponse)
            .teacher(teacherResponse)
            .build();
    }

    public static List<ClassesResponse> fromEntityList(List<Classes> classesList) {
        if (classesList == null) return null;
        return classesList.stream()
            .map(ClassesResponse::fromEntity)
            .collect(Collectors.toList());
    }
}