package com.sba301.group1.pes_be.dto.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddTeacherRequest {
    String email;
    String password;
    String name;
    String phone;
    String gender;
    String identityNumber;
}
