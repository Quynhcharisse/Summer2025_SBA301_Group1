package com.sba301.group1.pes_be.dto.response;

import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Student;
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
    private int numberOfStudents;
    private int numberStudent; // This is the capacity of the class, not the actual number of students
    private String roomNumber;
    private String startDate;
    private String endDate;
    private String status;
    private String grade;
    private SimpleSyllabusResponse syllabus;
    private SimpleTeacherResponse teacher;
    private List<SimpleStudentResponse> students;

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
        private String name;

        // Add a name property for frontend compatibility
        public String getName() {
            if (name != null && !name.trim().isEmpty()) {
                return name;
            }
            if (firstName != null && !firstName.trim().isEmpty()) {
                return firstName;
            }
            return null;
        }
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
                .name(classes.getTeacher().getName()) // Set explicit name field
                .build();
        }
        List<SimpleStudentResponse> studentResponse = null;
        if (classes.getStudentClassList() != null && !classes.getStudentClassList().isEmpty()) {
            studentResponse = classes.getStudentClassList().stream()
                .map(studentClass -> {
                    Student student = studentClass.getStudent();
                    return SimpleStudentResponse.builder()
                            .id(student.getId())
                    .name(student.getName())
                    .gender(student.getGender())
                    .placeOfBirth(student.getPlaceOfBirth())
                    .dateOfBirth(student.getDateOfBirth())
                        .profileImage(student.getProfileImage())
                    .isStudent(true) // Assuming all students in this context are active students
                    .build();
                }).toList();
        }

        // Calculate the actual number of students dynamically from the StudentClass relationship
        int actualStudentCount = classes.getStudentClassList() != null ? classes.getStudentClassList().size() : 0;

        return ClassesResponse.builder()
            .id(classes.getId())
            .name(classes.getName())
            .numberOfStudents(actualStudentCount) // Actual number of students enrolled
            .numberStudent(classes.getNumberStudent()) // Capacity of the class
            .roomNumber(classes.getRoomNumber())
            .startDate(classes.getStartDate().toString())
            .endDate(classes.getEndDate().toString())
            .status(classes.getStatus().toString())
            .grade(classes.getGrade() != null ? classes.getGrade().toString() : null)
            .syllabus(syllabusResponse)
            .teacher(teacherResponse)
            .students(studentResponse)
            .build();
    }

    public static List<ClassesResponse> fromEntityList(List<Classes> classesList) {
        if (classesList == null) return null;
        return classesList.stream()
            .map(ClassesResponse::fromEntity)
            .collect(Collectors.toList());
    }
}