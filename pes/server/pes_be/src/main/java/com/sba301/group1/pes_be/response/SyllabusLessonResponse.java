package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.SyllabusLesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyllabusLessonResponse {
    private Integer id;
    private LessonResponse lesson;
    private String note;

    public static SyllabusLessonResponse fromEntity(SyllabusLesson syllabusLesson) {
        if (syllabusLesson == null) {
            return null;
        }

        return SyllabusLessonResponse.builder()
                .id(syllabusLesson.getId())
                .lesson(LessonResponse.fromEntity(syllabusLesson.getLesson()))
                .note(syllabusLesson.getNote())
                .build();
    }
}
