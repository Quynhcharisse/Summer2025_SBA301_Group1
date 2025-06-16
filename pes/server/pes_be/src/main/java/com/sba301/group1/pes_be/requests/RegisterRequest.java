package com.sba301.group1.pes_be.requests;

import com.sba301.group1.pes_be.enums.Role;
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
    Role role;
    LocalDate createAt;
    String address;
    String job;
    String relationshipToChild;
    LocalDate dayOfBirth;
}
