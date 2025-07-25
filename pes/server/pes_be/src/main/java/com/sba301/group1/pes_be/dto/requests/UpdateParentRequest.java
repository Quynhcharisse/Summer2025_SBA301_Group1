package com.sba301.group1.pes_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateParentRequest {
    int id;
    String address;
    String job;
    String relationshipToChild;
    LocalDate dayOfBirth;
    String password;
    String name;
    String phone;
    String gender;
}
