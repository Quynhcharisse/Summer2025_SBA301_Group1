package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.HRService;
import com.sba301.group1.pes_be.services.JWTService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HRServiceImpl implements HRService {

    private final ParentRepo parentRepo;

    private final JWTService jwtService;


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
        parentData.put("passwordChanged", parent.isPasswordChanged());
        parentData.put("account", parent.getAccount());
        parentData.put("address", parent.getAddress());
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

        // Update fields (giả sử ParentRequest có các trường tương ứng)
        parent.setJob(request.getJob());
        parent.setRelationshipToChild(request.getRelationshipToChild());
        parent.setDayOfBirth(request.getDayOfBirth());
        parent.setAddress(request.getAddress());
        // Thêm các trường khác nếu cần

        parentRepo.save(parent);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent updated successfully")
                        .success(true)
                        .data(parent)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> deleteParent(int id, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Delete parent failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findById(id).orElse(null);
        if (parent == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Có thể kiểm tra quyền xóa ở đây nếu cần

        parentRepo.delete(parent);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent deleted successfully")
                        .success(true)
                        .data(null)
                        .build());
    }
}
