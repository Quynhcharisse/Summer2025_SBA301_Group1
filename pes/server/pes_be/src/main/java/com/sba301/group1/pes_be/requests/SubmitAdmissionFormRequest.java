package com.sba301.group1.pes_be.requests;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubmitAdmissionFormRequest {
    int studentId;
    int admissionTermId;
    String householdRegistrationAddress;
    String childCharacteristicsFormImg;
    String commitmentImg;
    String note;
}
