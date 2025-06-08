package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.Syllabus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyllabusResponse {
    private Integer id;
    private String title;
    private String description;
    private List<SyllabusLessonResponse> syllabusLessonList;

    public static SyllabusResponse fromEntity(Syllabus syllabus) {
        if (syllabus == null) {
            return null;
        }

        List<SyllabusLessonResponse> syllabusLessonDTOs = null;
        if (syllabus.getSyllabusLessonList() != null) {
            syllabusLessonDTOs = syllabus.getSyllabusLessonList().stream()
                    .map(SyllabusLessonResponse::fromEntity)
                    .collect(Collectors.toList());
        }

        return SyllabusResponse.builder()
                .id(syllabus.getId())
                .title(syllabus.getTitle())
                .description(syllabus.getDescription())
                .syllabusLessonList(syllabusLessonDTOs)
                .build();
    }

    public static List<SyllabusResponse> fromEntities(List<Syllabus> syllabi) {
        if (syllabi == null) {
            return null;
        }
        return syllabi.stream()
                .map(SyllabusResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
