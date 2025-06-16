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
public class AddChildRequest {
    String name;
    String gender;
    LocalDate dateOfBirth;
    String placeOfBirth;
    
    // Form information
    String profileImage;
    String householdRegistrationAddress;
    String birthCertificateImg;
    String householdRegistrationImg;
    String commitmentImg;
}
