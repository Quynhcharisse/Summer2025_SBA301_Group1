package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.requests.ParentRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.requests.SubmitAdmissionFormRequest;
import com.sba301.group1.pes_be.services.JWTService;
import com.sba301.group1.pes_be.services.ParentService;
import com.sba301.group1.pes_be.validations.ParentValidation.FormByParentValidation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final JWTService jwtService;

    private final AdmissionFormRepo admissionFormRepo;

    private final AdmissionTermRepo admissionTermRepo;

    private final ParentRepo parentRepo;

    private final StudentRepo studentRepo;

    @Override
    public ResponseEntity<ResponseObject> viewAdmissionFormList(HttpServletRequest request) {

        Account acc = jwtService.extractAccountFromCookie(request);

        if (acc == null || acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Get list failed")
                            .success(false)
                            .data(null)
                            .build());
        }

        List<Map<String, Object>> admissionForms = admissionFormRepo.findAll().stream()
                .filter(form -> form.getParent().getId().equals(acc.getParent().getId()))
                .sorted(Comparator.comparing(AdmissionForm::getSubmittedDate).reversed()) // sort form theo ngày chỉnh
                                                                                          // sửa mới nhất
                .map(this::getFormDetail)
                .toList();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(admissionForms)
                        .build());
    }

    private Map<String, Object> getFormDetail(AdmissionForm form) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", form.getId());
        data.put("childName", form.getStudentName());
        data.put("childGender", form.getGender());
        data.put("dateOfBirth", form.getDateOfBirth());
        data.put("placeOfBirth", form.getPlaceOfBirth());
        data.put("profileImage", form.getProfileImage());
        data.put("householdRegistrationAddress", form.getHouseholdRegistrationAddress());
        data.put("householdRegistrationImg", form.getHouseholdRegistrationImg());
        data.put("birthCertificateImg", form.getChildBirthCertificateImg());
        data.put("commitmentImg", form.getCommitmentImg());
        data.put("submittedDate", form.getSubmittedDate());
        data.put("cancelReason", form.getCancelReason());
        data.put("note", form.getNote());
        data.put("status", form.getStatus());
        return data;
    }

    @Override
    public ResponseEntity<ResponseObject> cancelAdmissionForm(int id, HttpServletRequest httpRequest) {

        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Cancelled admission form failed")
                            .success(false)
                            .data(null)
                            .build());
        }

        String error = FormByParentValidation.canceledValidate(id, acc, admissionFormRepo);

        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }

        AdmissionForm form = admissionFormRepo.findById(id).orElse(null);
        assert form != null;

        form.setStatus(Status.CANCELLED.getValue());
        admissionFormRepo.save(form);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Successfully cancelled")
                        .success(true)
                        .data(null)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> submitAdmissionForm(SubmitAdmissionFormRequest request,
            HttpServletRequest httpRequest) {

        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || account.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Submitted admission form failed")
                            .success(false)
                            .data(null)
                            .build());
        }

        String error = FormByParentValidation.submittedForm(request);

        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }

        List<AdmissionForm> formList = admissionFormRepo.findAllByParent_IdAndStudentName(account.getParent().getId(),
                request.getName());

        if (!formList.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("This student was already registered")
                            .success(false)
                            .data(null)
                            .build());
        }

        AdmissionTerm term = admissionTermRepo.findByYear(LocalDate.now().getYear()).orElse(null);

        if (term == null || !(term.getStatus().equalsIgnoreCase(Status.ACTIVE_TERM.getValue()))) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Invalid term")
                            .success(false)
                            .data(null)
                            .build());
        }

        admissionFormRepo.save(
                AdmissionForm.builder()
                        .studentName(request.getName())
                        .gender(request.getGender())
                        .dateOfBirth(request.getDateOfBirth())
                        .placeOfBirth(request.getPlaceOfBirth())
                        .householdRegistrationAddress(request.getHouseholdRegistrationAddress())
                        .profileImage(request.getProfileImage())
                        .householdRegistrationImg(request.getHouseholdRegistrationImg())
                        .childBirthCertificateImg(request.getBirthCertificateImg())
                        .commitmentImg(request.getCommitmentImg())
                        .note(request.getNote())
                        .submittedDate(LocalDate.now())
                        .status(Status.PENDING_APPROVAL.getValue())
                        .admissionTerm(term)
                        .build());

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Successfully submitted")
                        .success(true)
                        .data(null)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> getChildren(HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);

        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Only parents can access the list of children.")
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        if (parent == null || !parent.getId().equals(acc.getParent().getId())) {
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .message("Access denied: You are not allowed to view children of this parent.")
                            .success(false)
                            .data(null)
                            .build());
        }

        List<Student> children = studentRepo.findAllByParent_Id(parent.getId());

        if (children == null) {
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .message("No children found for this parent.")
                            .success(false)
                            .data(null)
                            .build());
        }

        List<Map<String, Object>> childrenData = children.stream().map(
                child -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", child.getId());
                    data.put("name", child.getName());
                    data.put("gender", child.getGender());
                    data.put("dateOfBirth", child.getDateOfBirth());
                    data.put("placeOfBirth", child.getPlaceOfBirth());
                    return data;
                })
                .toList();

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .message("Children retrieved successfully.")
                        .success(true)
                        .data(childrenData)
                        .build());
    }

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
