package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.requests.ChildRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ChildService;
import com.sba301.group1.pes_be.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChildServiceImpl implements ChildService {

    private final JWTService jwtService;

    private final StudentRepo studentRepo;

    private final ParentRepo parentRepo;

    @Override
    public ResponseEntity<ResponseObject> addChild(ChildRequest childRequest, HttpServletRequest request) {
        Account acc = jwtService.extractAccountFromCookie(request);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Add child failed: Unauthorized")
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

        Student student = Student.builder()
                .name(childRequest.getName())
                .gender(childRequest.getGender())
                .dateOfBirth(childRequest.getDateOfBirth())
                .placeOfBirth(childRequest.getPlaceOfBirth())
                .profileImage(childRequest.getProfileImage())
                .isStudent(false)
                .parent(parent)
                .build();

        studentRepo.save(student);

        Map<String, Object> childData = new HashMap<>();
        childData.put("id", student.getId());
        childData.put("name", student.getName());
        childData.put("gender", student.getGender());
        childData.put("dateOfBirth", student.getDateOfBirth());
        childData.put("placeOfBirth", student.getPlaceOfBirth());
        childData.put("profileImage", student.getProfileImage());
        childData.put("isStudent", student.isStudent());
        childData.put("parentId", parent.getId());

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Child added successfully")
                        .success(true)
                        .data(childData)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> updateChild(ChildRequest childRequest, HttpServletRequest request) {
        Account acc = jwtService.extractAccountFromCookie(request);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Update child failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Tìm parent từ account
        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Tìm student theo id và parent
        Student student = studentRepo.findById(childRequest.getId()).orElse(null);
        if (student == null || !student.getParent().getId().equals(parent.getId())) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Child not found or access denied")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Cập nhật thông tin
        student.setName(childRequest.getName());
        student.setGender(childRequest.getGender());
        student.setDateOfBirth(childRequest.getDateOfBirth());
        student.setPlaceOfBirth(childRequest.getPlaceOfBirth());
        // Thêm các trường khác nếu có

        studentRepo.save(student);

        Map<String, Object> childData = new HashMap<>();
        childData.put("id", student.getId());
        childData.put("name", student.getName());
        childData.put("gender", student.getGender());
        childData.put("dateOfBirth", student.getDateOfBirth());
        childData.put("placeOfBirth", student.getPlaceOfBirth());
        childData.put("profileImage", student.getProfileImage());
        childData.put("isStudent", student.isStudent());
        childData.put("parentId", parent.getId());

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Child updated successfully")
                        .success(true)
                        .data(childData)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> deleteChild(int id, HttpServletRequest request) {
        Account acc = jwtService.extractAccountFromCookie(request);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Delete child failed: Unauthorized")
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

        Student student = studentRepo.findById(id).orElse(null);
        if (student == null || !student.getParent().getId().equals(parent.getId())) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Child not found or access denied")
                            .success(false)
                            .data(null)
                            .build());
        }

        studentRepo.delete(student);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Child deleted successfully")
                        .success(true)
                        .data(null)
                        .build());
    }
}
