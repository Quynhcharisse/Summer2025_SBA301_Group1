package com.sba301.group1.pes_be.requests;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClassRequest {
    private String classId;
    private String teacherId;
    private String syllabusId;
    private String name;
    private int numberStudent;
    private String roomNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String grade;
}
