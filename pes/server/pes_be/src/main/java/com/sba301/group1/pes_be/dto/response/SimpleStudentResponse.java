package com.sba301.group1.pes_be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimpleStudentResponse {
    private Integer id;
    private String name;
    private String gender;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private String profileImage;
    private boolean isStudent;
    private Integer parentId;
}
