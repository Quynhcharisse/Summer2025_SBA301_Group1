package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.dto.requests.AddTeacherRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateTeacherRequest;
import com.sba301.group1.pes_be.dto.response.TeacherResponse;
import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.dto.requests.ParentRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import com.sba301.group1.pes_be.services.HRService;
import com.sba301.group1.pes_be.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HRServiceImpl implements HRService {

    private final ParentRepo parentRepo;

    private final JWTService jwtService;
    private final AccountRepo accountRepo;


    @Override
    public ResponseEntity<ResponseObject> getParentById(int id, HttpServletRequest httpRequest) {
        Parent parent = parentRepo.findById(id).orElse(null);
        if (parent == null || !parent.getId().equals(id)) {
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .message("Parent not found or access denied.")
                            .success(false)
                            .data(null)
                            .build());
        }
        Map<String, Object> parentData = new HashMap<>();
        parentData.put("id", parent.getId());
        parentData.put("job", parent.getJob());
        parentData.put("relationshipToChild", parent.getRelationshipToChild());
        parentData.put("dayOfBirth", parent.getDayOfBirth());
        parentData.put("address", parent.getAddress());
        parentData.put("status", parent.getAccount().getStatus().getValue());
        parentData.put("phone", parent.getAccount().getPhone());
        parentData.put("name", parent.getAccount().getName());
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .message("Parent retrieved successfully.")
                        .success(true)
                        .data(parentData)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> updateParent(ParentRequest request, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Update parent failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        parent.setJob(request.getJob());
        parent.setRelationshipToChild(request.getRelationshipToChild());
        parent.setDayOfBirth(request.getDayOfBirth());
        parent.setAddress(request.getAddress());

        parentRepo.save(parent);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent updated successfully")
                        .success(true)
                        .data(parent)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> banParent(int id, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.HR)) {
            return ResponseEntity.status(401).body(
                    ResponseObject.builder()
                            .message("Delete parent failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findById(id).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(404).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Kiểm tra nếu parent còn con đang học
        if (parent.getStudentList() != null && parent.getStudentList().stream().anyMatch(Student::isStudent)) {
            return ResponseEntity.status(400).body(
                    ResponseObject.builder()
                            .message("Cannot ban parent: There are still children enrolled in school.")
                            .success(false)
                            .data(null)
                            .build());
        }

        Account parentAccount = accountRepo.getReferenceById(parent.getAccount().getId());
        parentAccount.setStatus(Status.ACCOUNT_BAN);
        accountRepo.save(parentAccount);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent banned successfully")
                        .success(true)
                        .data(null)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> unbanParent(int id, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.HR)) {
            return ResponseEntity.status(403).body(
                    ResponseObject.builder()
                            .message("Delete parent failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findById(id).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(404).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        Account parentAccount = accountRepo.getReferenceById(parent.getAccount().getId());
        System.out.println(parentAccount);
        parentAccount.setStatus(Status.ACCOUNT_ACTIVE);
        accountRepo.save(parentAccount);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent deleted successfully")
                        .success(true)
                        .data(null)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> getParentList(HttpServletRequest httpRequest) {
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.HR)) {
            return ResponseEntity.status(401).body(
                    ResponseObject.builder()
                            .message("Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        List<Parent> parentList = parentRepo.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Parent parent : parentList) {
            Map<String, Object> parentData = new HashMap<>();
            parentData.put("id", parent.getId());
            parentData.put("job", parent.getJob());
            parentData.put("relationshipToChild", parent.getRelationshipToChild());
            parentData.put("dayOfBirth", parent.getDayOfBirth());
            parentData.put("status", parent.getAccount().getStatus().getValue());
            parentData.put("address", parent.getAddress());
            parentData.put("name", parent.getAccount().getName());
            parentData.put("phone", parent.getAccount().getPhone());
            result.add(parentData);
        }
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent retrieved successfully")
                        .success(true)
                        .data(result)
                        .build());

    }

    @Override
    public ResponseEntity<ResponseObject> getAllTeachers(HttpServletRequest httpRequest) {
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.HR)) {
            return ResponseEntity.status(401).body(
                    ResponseObject.builder()
                            .message("Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }
        List<Account> teacherList = accountRepo.findAllByRole(Role.TEACHER);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Account acc : teacherList) {
            TeacherResponse response = new TeacherResponse();
            response.setId(acc.getId());
            response.setEmail(acc.getEmail());
            response.setName(acc.getName());
            response.setPhone(acc.getPhone());
            response.setGender(acc.getGender());
            response.setIdentityNumber(acc.getIdentityNumber());
        }
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Teachers retrieved successfully")
                        .success(true)
                        .data(TeacherResponse.fromEntityList(teacherList))
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> addTeacher(AddTeacherRequest request, HttpServletRequest httpRequest) {
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.HR)) {
            return ResponseEntity.status(401).body(
                    ResponseObject.builder()
                            .message("Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        if (request.getEmail() == null || request.getPassword() == null ||
                request.getName() == null || request.getPhone() == null ||
                request.getGender() == null || request.getIdentityNumber() == null) {
            return ResponseEntity.status(400).body(
                    ResponseObject.builder()
                            .message("All fields are required")
                            .success(false)
                            .data(null)
                            .build());
        }

        if (accountRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(400).body(
                    ResponseObject.builder()
                            .message("Email already exists")
                            .success(false)
                            .data(null)
                            .build());
        }

        Account teacherAccount = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.TEACHER)
                .status(Status.ACCOUNT_ACTIVE)
                .createdAt(java.time.LocalDate.now())
                .name(request.getName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .identityNumber(request.getIdentityNumber())
                .build();
        accountRepo.save(teacherAccount);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Teacher added successfully")
                        .success(true)
                        .data(teacherAccount)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> updateTeacherProfile(int id, UpdateTeacherRequest request, HttpServletRequest httpRequest) {
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.HR)) {
            return ResponseEntity.status(401).body(
                    ResponseObject.builder()
                            .message("Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        Account teacherAccount = accountRepo.findById(id).orElse(null);
        if (teacherAccount == null || !teacherAccount.getRole().equals(Role.TEACHER)) {
            return ResponseEntity.status(404).body(
                    ResponseObject.builder()
                            .message("Teacher not found")
                            .success(false)
                            .data(null)
                            .build());
        }
        if(request.getName().trim().isEmpty() || request.getPhone().trim().isEmpty() ||
                request.getGender().trim().isEmpty() || request.getIdentityNumber().trim().isEmpty()) {
            return ResponseEntity.status(400).body(
                    ResponseObject.builder()
                            .message("All fields are required")
                            .success(false)
                            .data(null)
                            .build());
        }

        teacherAccount.setId(id);
        teacherAccount.setName(request.getName());
        teacherAccount.setPhone(request.getPhone());
        teacherAccount.setGender(request.getGender());
        teacherAccount.setIdentityNumber(request.getIdentityNumber());
        accountRepo.save(teacherAccount);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Teacher profile updated successfully")
                        .success(true)
                        .data(teacherAccount)
                        .build());

    }
}
