package com.sba301.group1.pes_be.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterRequest {
    String email;
    String password;
    String name;
    String phone;
    String gender;
    String identityNumber;
    String address;
    String job;
    String relationshipToChild;
    LocalDate dayOfBirth;
}
