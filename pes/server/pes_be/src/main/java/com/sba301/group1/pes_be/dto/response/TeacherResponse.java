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
import java.time.format.DateTimeFormatter;
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

    public static TeacherResponse fromEntity(Account account, Integer startYear) {
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

        List<Classes> filteredClasses = account.getClassesList() != null ? account.getClassesList().stream()
                .filter(classEntity -> {
                    if (startYear == null) {
                        return true;
                    }
                    try {
                        LocalDate startDate = LocalDate.parse(classEntity.getStartDate(), DateTimeFormatter.ISO_LOCAL_DATE);
                        return startDate.getYear() == startYear;
                    } catch (Exception e) {
                        return false;
                    }
                })
                .collect(Collectors.toList()) : java.util.Collections.emptyList();

        boolean isOccupied = !filteredClasses.isEmpty();

        if (!filteredClasses.isEmpty()) {
            Classes classEntity = filteredClasses.get(0); // Or handle multiple classes appropriately
            ClassInfo classInfo = ClassInfo.builder()
                    .id(classEntity.getId())
                    .name(classEntity.getName())
                    .numberStudent(classEntity.getNumberStudent())
                    .roomNumber(classEntity.getRoomNumber())
                    .startDate(classEntity.getStartDate().toString())
                    .endDate(classEntity.getEndDate().toString())
                    .status(classEntity.getStatus().toString())
                    .grade(classEntity.getGrade() != null ? classEntity.getGrade().name() : null)
                    .build();
            builder.classes(classInfo);
        }

        builder.isOccupied(isOccupied);

        return builder.build();
    }

    public static TeacherResponse fromEntity(Account account) {
        return fromEntity(account, null);
    }

    public static List<TeacherResponse> fromEntityList(List<Account> accounts, Integer startYear) {
        return accounts.stream()
                .map(account -> fromEntity(account, startYear))
                .collect(Collectors.toList());
    }

    public static List<TeacherResponse> fromEntityList(List<Account> accounts) {
        return accounts.stream()
                .map(account -> fromEntity(account, null))
                .collect(Collectors.toList());
    }
}