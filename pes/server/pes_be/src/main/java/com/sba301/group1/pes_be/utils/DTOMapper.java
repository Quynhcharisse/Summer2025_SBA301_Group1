package com.sba301.group1.pes_be.utils;

import com.sba301.group1.pes_be.dto.*;
import com.sba301.group1.pes_be.models.*;
import java.util.List;
import java.util.stream.Collectors;

public class DTOMapper {

    // Syllabus to DTO conversion
    public static SyllabusDTO toSyllabusDTO(Syllabus syllabus) {
        if (syllabus == null) return null;

        List<SyllabusDTO.SimpleLessonDTO> lessonDTOs = null;
        if (syllabus.getSyllabusLessonList() != null) {
            lessonDTOs = syllabus.getSyllabusLessonList().stream()
                .filter(sl -> sl.getLesson() != null)
                .map(sl -> SyllabusDTO.SimpleLessonDTO.builder()
                    .id(sl.getLesson().getId())
                    .topic(sl.getLesson().getTopic())
                    .description(sl.getLesson().getDescription())
                    .build())
                .collect(Collectors.toList());
        }

        List<SyllabusDTO.SimpleClassDTO> classDTOs = null;
        if (syllabus.getClassesList() != null) {
            classDTOs = syllabus.getClassesList().stream()
                .map(c -> SyllabusDTO.SimpleClassDTO.builder()
                    .id(c.getId())
                    .name(c.getName())
                    .grade(c.getGrade() != null ? c.getGrade().toString() : null)
                    .status(c.getStatus())
                    .build())
                .collect(Collectors.toList());
        }

        return SyllabusDTO.builder()
            .id(syllabus.getId())
            .title(syllabus.getTitle())
            .description(syllabus.getDescription())
            .lessons(lessonDTOs)
            .classes(classDTOs)
            .build();
    }

    // Lesson to DTO conversion
    public static LessonDTO toLessonDTO(Lesson lesson) {
        if (lesson == null) return null;

        List<LessonDTO.SimpleSyllabusDTO> syllabusDTOs = null;
        if (lesson.getSyllabusLessonList() != null) {
            syllabusDTOs = lesson.getSyllabusLessonList().stream()
                .filter(sl -> sl.getSyllabus() != null)
                .map(sl -> LessonDTO.SimpleSyllabusDTO.builder()
                    .id(sl.getSyllabus().getId())
                    .title(sl.getSyllabus().getTitle())
                    .description(sl.getSyllabus().getDescription())
                    .build())
                .collect(Collectors.toList());
        }

        return LessonDTO.builder()
            .id(lesson.getId())
            .topic(lesson.getTopic())
            .description(lesson.getDescription())
            .syllabuses(syllabusDTOs)
            .build();
    }

    // Classes to DTO conversion
    public static ClassesDTO toClassesDTO(Classes classes) {
        if (classes == null) return null;

        ClassesDTO.SimpleSyllabusDTO syllabusDTO = null;
        if (classes.getSyllabus() != null) {
            syllabusDTO = ClassesDTO.SimpleSyllabusDTO.builder()
                .id(classes.getSyllabus().getId())
                .title(classes.getSyllabus().getTitle())
                .description(classes.getSyllabus().getDescription())
                .build();
        }

        ClassesDTO.SimpleTeacherDTO teacherDTO = null;
        if (classes.getTeacher() != null) {
            teacherDTO = ClassesDTO.SimpleTeacherDTO.builder()
                .id(classes.getTeacher().getId())
                .email(classes.getTeacher().getEmail())
                .firstName(classes.getTeacher().getName())
                .lastName("") // Account model only has name field
                .build();
        }

        return ClassesDTO.builder()
            .id(classes.getId())
            .name(classes.getName())
            .numberStudent(classes.getNumberStudent())
            .roomNumber(classes.getRoomNumber())
            .startDate(classes.getStartDate())
            .endDate(classes.getEndDate())
            .status(classes.getStatus())
            .grade(classes.getGrade() != null ? classes.getGrade().toString() : null)
            .syllabus(syllabusDTO)
            .teacher(teacherDTO)
            .build();
    }

    // SyllabusLesson to DTO conversion
    public static SyllabusLessonDTO toSyllabusLessonDTO(SyllabusLesson syllabusLesson) {
        if (syllabusLesson == null) return null;

        SyllabusLessonDTO.SimpleSyllabusDTO syllabusDTO = null;
        if (syllabusLesson.getSyllabus() != null) {
            syllabusDTO = SyllabusLessonDTO.SimpleSyllabusDTO.builder()
                .id(syllabusLesson.getSyllabus().getId())
                .title(syllabusLesson.getSyllabus().getTitle())
                .description(syllabusLesson.getSyllabus().getDescription())
                .build();
        }

        SyllabusLessonDTO.SimpleLessonDTO lessonDTO = null;
        if (syllabusLesson.getLesson() != null) {
            lessonDTO = SyllabusLessonDTO.SimpleLessonDTO.builder()
                .id(syllabusLesson.getLesson().getId())
                .topic(syllabusLesson.getLesson().getTopic())
                .description(syllabusLesson.getLesson().getDescription())
                .build();
        }

        return SyllabusLessonDTO.builder()
            .id(syllabusLesson.getId())
            .note(syllabusLesson.getNote())
            .syllabus(syllabusDTO)
            .lesson(lessonDTO)
            .build();
    }

    // List conversion methods
    public static List<SyllabusDTO> toSyllabusDTOList(List<Syllabus> syllabi) {
        if (syllabi == null) return null;
        return syllabi.stream()
            .map(DTOMapper::toSyllabusDTO)
            .collect(Collectors.toList());
    }

    public static List<LessonDTO> toLessonDTOList(List<Lesson> lessons) {
        if (lessons == null) return null;
        return lessons.stream()
            .map(DTOMapper::toLessonDTO)
            .collect(Collectors.toList());
    }

    public static List<ClassesDTO> toClassesDTOList(List<Classes> classesList) {
        if (classesList == null) return null;
        return classesList.stream()
            .map(DTOMapper::toClassesDTO)
            .collect(Collectors.toList());
    }

    public static List<SyllabusLessonDTO> toSyllabusLessonDTOList(List<SyllabusLesson> syllabusLessons) {
        if (syllabusLessons == null) return null;
        return syllabusLessons.stream()
            .map(DTOMapper::toSyllabusLessonDTO)
            .collect(Collectors.toList());
    }
}