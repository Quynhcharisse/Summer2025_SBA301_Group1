package com.sba301.group1.pes_be.dto.requests;
import java.util.List;

import lombok.Data;

@Data
public class CreateScheduleRequest {
    private int weekNumber;
    private String note;
    private Integer classId;
    private List<CreateActivityRequest> activities;
}