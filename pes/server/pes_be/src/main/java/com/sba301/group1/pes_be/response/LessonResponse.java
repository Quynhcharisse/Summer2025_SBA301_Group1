package com.sba301.group1.pes_be.response;

import com.sba301.group1.pes_be.models.Lesson;
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
public class LessonResponse {
    private Integer id;
    private String topic;
    private String description;
    private Integer duration;
    private String materials;

    public static LessonResponse fromEntity(Lesson lesson) {
        if (lesson == null) {
            return null;
        }

        return LessonResponse.builder()
                .id(lesson.getId())
                .topic(lesson.getTopic())
                .description(lesson.getDescription())
                .duration(lesson.getDuration())
                .materials(lesson.getMaterials())
                .build();
    }

    public static List<LessonResponse> fromEntities(List<Lesson> lessons) {
        if (lessons == null) {
            return null;
        }
        return lessons.stream()
                .map(LessonResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
