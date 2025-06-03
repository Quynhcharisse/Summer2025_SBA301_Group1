package com.sba301.group1.pes_be.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ParentRequest {
    int id;
    String address;
    String job;
    String relationshipToChild;
    boolean passwordChanged;
    LocalDate dayOfBirth;
    int accountId;
}
