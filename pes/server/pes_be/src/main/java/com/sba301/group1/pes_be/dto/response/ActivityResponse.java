package com.sba301.group1.pes_be.dto.response;

import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Activity;
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
public class ActivityResponse {
    private Integer id;
    private String topic;
    private String description;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private SimpleScheduleResponse schedule;
    private SimpleLessonResponse lesson;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleScheduleResponse {
        private Integer id;
        private Integer weekNumber;
        private String note;
        private SimpleClassResponse classes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleClassResponse {
        private Integer id;
        private String name;
        private String roomNumber;
        private String status;
        private String grade;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimpleLessonResponse {
        private Integer id;
        private String topic;
        private String description;
    }

    public static ActivityResponse fromEntity(Activity activity) {
        if (activity == null) return null;

        SimpleScheduleResponse scheduleResponse = null;
        if (activity.getSchedule() != null) {
            SimpleClassResponse classResponse = null;
            if (activity.getSchedule().getClasses() != null) {
                classResponse = SimpleClassResponse.builder()
                    .id(activity.getSchedule().getClasses().getId())
                    .name(activity.getSchedule().getClasses().getName())
                    .roomNumber(activity.getSchedule().getClasses().getRoomNumber())
                    .status(activity.getSchedule().getClasses().getStatus())
                    .grade(activity.getSchedule().getClasses().getGrade() != null ? 
                        activity.getSchedule().getClasses().getGrade().toString() : null)
                    .build();
            }

            scheduleResponse = SimpleScheduleResponse.builder()
                .id(activity.getSchedule().getId())
                .weekNumber(activity.getSchedule().getWeekNumber())
                .note(activity.getSchedule().getNote())
                .classes(classResponse)
                .build();
        }

        SimpleLessonResponse lessonResponse = null;
        if (activity.getLesson() != null) {
            lessonResponse = SimpleLessonResponse.builder()
                .id(activity.getLesson().getId())
                .topic(activity.getLesson().getTopic())
                .description(activity.getLesson().getDescription())
                .build();
        }

        return ActivityResponse.builder()
            .id(activity.getId())
            .topic(activity.getTopic())
            .description(activity.getDescription())
            .dayOfWeek(activity.getDayOfWeek())
            .startTime(activity.getStartTime())
            .endTime(activity.getEndTime())
            .schedule(scheduleResponse)
            .lesson(lessonResponse)
            .build();
    }

    public static List<ActivityResponse> fromEntityList(List<Activity> activities) {
        if (activities == null) return null;
        return activities.stream()
            .map(ActivityResponse::fromEntity)
            .collect(Collectors.toList());
    }

    // Convenience methods for flattened access (for frontend compatibility)
    public Integer getScheduleId() {
        return schedule != null ? schedule.getId() : null;
    }

    public Integer getWeekNumber() {
        return schedule != null ? schedule.getWeekNumber() : null;
    }

    public String getScheduleNote() {
        return schedule != null ? schedule.getNote() : null;
    }

    public Integer getClassId() {
        return schedule != null && schedule.getClasses() != null ? schedule.getClasses().getId() : null;
    }

    public String getClassName() {
        return schedule != null && schedule.getClasses() != null ? schedule.getClasses().getName() : null;
    }

    public String getClassRoomNumber() {
        return schedule != null && schedule.getClasses() != null ? schedule.getClasses().getRoomNumber() : null;
    }

    public String getClassStatus() {
        return schedule != null && schedule.getClasses() != null ? schedule.getClasses().getStatus() : null;
    }

    public String getClassGrade() {
        return schedule != null && schedule.getClasses() != null ? schedule.getClasses().getGrade() : null;
    }

    public Integer getLessonId() {
        return lesson != null ? lesson.getId() : null;
    }

    public String getLessonTopic() {
        return lesson != null ? lesson.getTopic() : null;
    }

    public String getLessonDescription() {
        return lesson != null ? lesson.getDescription() : null;
    }
}