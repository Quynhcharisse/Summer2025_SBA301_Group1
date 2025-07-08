package com.sba301.group1.pes_be.dto.response;

import com.sba301.group1.pes_be.models.Schedule;
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
public class ScheduleResponse {
    private Integer id;
    private Integer weekNumber;
    private String note;
    private SimpleClassResponse classes;
    private List<SimpleActivityResponse> activities;

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
    public static class SimpleActivityResponse {
        private Integer id;
        private String topic;
        private String description;
        private String dayOfWeek;
        private String startTime;
        private String endTime;
    }

    public static ScheduleResponse fromEntity(Schedule schedule) {
        if (schedule == null) return null;

        SimpleClassResponse classResponse = null;
        if (schedule.getClasses() != null) {
            classResponse = SimpleClassResponse.builder()
                .id(schedule.getClasses().getId())
                .name(schedule.getClasses().getName())
                .roomNumber(schedule.getClasses().getRoomNumber())
                .status(schedule.getClasses().getStatus())
                .grade(schedule.getClasses().getGrade() != null ? 
                    schedule.getClasses().getGrade().toString() : null)
                .build();
        }

        List<SimpleActivityResponse> activityResponses = null;
        if (schedule.getActivities() != null) {
            activityResponses = schedule.getActivities().stream()
                .map(activity -> SimpleActivityResponse.builder()
                    .id(activity.getId())
                    .topic(activity.getTopic())
                    .description(activity.getDescription())
                    .dayOfWeek(activity.getDayOfWeek())
                    .startTime(activity.getStartTime())
                    .endTime(activity.getEndTime())
                    .build())
                .collect(Collectors.toList());
        }

        return ScheduleResponse.builder()
            .id(schedule.getId())
            .weekNumber(schedule.getWeekNumber())
            .note(schedule.getNote())
            .classes(classResponse)
            .activities(activityResponses)
            .build();
    }

    public static List<ScheduleResponse> fromEntityList(List<Schedule> schedules) {
        if (schedules == null) return null;
        return schedules.stream()
            .map(ScheduleResponse::fromEntity)
            .collect(Collectors.toList());
    }

    // Convenience methods for flattened access (for frontend compatibility)
    public Integer getClassId() {
        return classes != null ? classes.getId() : null;
    }

    public String getClassName() {
        return classes != null ? classes.getName() : null;
    }

    public String getClassRoomNumber() {
        return classes != null ? classes.getRoomNumber() : null;
    }

    public String getClassStatus() {
        return classes != null ? classes.getStatus() : null;
    }

    public String getClassGrade() {
        return classes != null ? classes.getGrade() : null;
    }
}