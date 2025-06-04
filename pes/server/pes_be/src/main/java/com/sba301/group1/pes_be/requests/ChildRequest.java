package com.sba301.group1.pes_be.requests;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChildRequest {
    int id;
    String name;
    String gender;
    LocalDate dateOfBirth;
    String placeOfBirth;
    String profileImage;
    String householdRegistrationAddress;
    String householdRegistrationImg;
    String birthCertificateImg;
    String commitmentImg;
    boolean isStudent;
    int parentId;
}
