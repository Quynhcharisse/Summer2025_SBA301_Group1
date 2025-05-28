package com.sba301.group1.pes_be.requests;

import lombok.Data;

@Data
public class UpdateActivityRequest {
    private String topic;
    private String description;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private Integer lessonId;
}