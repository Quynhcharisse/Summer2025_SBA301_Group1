package com.sba301.group1.pes_be.dto.requests;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassRequest {
    private Integer classId;
    private Integer teacherId;
    private Integer syllabusId;
    private String name;
    private int numberStudent;
    private String roomNumber;
    private String startDate;
    private String endDate;
    private String status;
    private String grade;
}
