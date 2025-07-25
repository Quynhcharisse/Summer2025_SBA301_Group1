package com.sba301.group1.pes_be.dto.requests;

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
public class AddChildRequest {
    String name;
    String gender;
    LocalDate dateOfBirth;
    String placeOfBirth;
    String profileImage;
    String birthCertificateImg;
    String householdRegistrationImg;
    String commitmentImg;
}
