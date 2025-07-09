package com.sba301.group1.pes_be.dto.requests;

import lombok.Data;

@Data
public class AssignActivityToClassRequest {
    private Integer activityId;
    private Integer classId;
    private Integer weekNumber;
}