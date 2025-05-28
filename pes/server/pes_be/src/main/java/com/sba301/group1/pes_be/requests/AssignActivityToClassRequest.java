package com.sba301.group1.pes_be.requests;

import lombok.Data;

@Data
public class AssignActivityToClassRequest {
    private Integer activityId;
    private Integer classId;
    private Integer weekNumber;
}