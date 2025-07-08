package com.sba301.group1.pes_be.dto.response;

import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Classes;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TeacherResponse {
    Integer id;
    String email;
    String role;
    String status;
    LocalDate createdAt;
    String name;
    String phone;
    String gender;
    String identityNumber;
    ClassInfo classes;
    Boolean isOccupied;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ClassInfo {
        Integer id;
        String name;
        int numberStudent;
        String roomNumber;
        String startDate;
        String endDate;
        String status;
        String grade;
    }

    public static TeacherResponse fromEntity(Account account) {
        TeacherResponse.TeacherResponseBuilder builder = TeacherResponse.builder()
                .id(account.getId())
                .email(account.getEmail())
                .role(account.getRole() != null ? account.getRole().name() : null)
                .status(account.getStatus().getValue())
                .createdAt(account.getCreatedAt())
                .name(account.getName())
                .phone(account.getPhone())
                .gender(account.getGender())
                .identityNumber(account.getIdentityNumber());

        boolean isOccupied = account.getClassesList() != null && account.getClassesList().stream()
                .anyMatch(classEntity -> {
                    try {
                        LocalDate endDate = LocalDate.parse(classEntity.getEndDate());
                        return endDate.isAfter(LocalDate.now());
                    } catch (Exception e) {
                        return false;
                    }
                });

        if (account.getClassesList() != null && !account.getClassesList().isEmpty()) {
            Classes classEntity = account.getClassesList().get(0);
            
            ClassInfo classInfo = ClassInfo.builder()
                    .id(classEntity.getId())
                    .name(classEntity.getName())
                    .numberStudent(classEntity.getNumberStudent())
                    .roomNumber(classEntity.getRoomNumber())
                    .startDate(classEntity.getStartDate())
                    .endDate(classEntity.getEndDate())
                    .status(classEntity.getStatus())
                    .grade(classEntity.getGrade() != null ? classEntity.getGrade().name() : null)
                    .build();
            builder.classes(classInfo);
        }
        
        builder.isOccupied(isOccupied);

        return builder.build();
    }

    public static List<TeacherResponse> fromEntityList(List<Account> accounts) {
        return accounts.stream()
                .map(TeacherResponse::fromEntity)
                .collect(Collectors.toList());
    }
}