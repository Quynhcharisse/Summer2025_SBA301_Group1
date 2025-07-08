package com.sba301.group1.pes_be.dto.requests;

import lombok.Data;

@Data
public class UpdateScheduleRequest {
    private int weekNumber;
    private String note;
}