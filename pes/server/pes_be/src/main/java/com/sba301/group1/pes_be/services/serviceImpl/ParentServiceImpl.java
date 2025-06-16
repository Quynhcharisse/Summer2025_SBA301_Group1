package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.requests.*;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.JWTService;
import com.sba301.group1.pes_be.services.ParentService;
import com.sba301.group1.pes_be.validations.ParentValidation.ChildValidation;
import com.sba301.group1.pes_be.validations.ParentValidation.FormByParentValidation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    private final ParentRepo parentRepo;

    private final StudentRepo studentRepo;
    
    private final AccountRepo accountRepo;

    @Override
    public ResponseEntity<ResponseObject> viewAdmissionFormList(HttpServletRequest request) {

        //xac thuc nguoi dung
        Account account = jwtService.extractAccountFromCookie(request);
        if (account == null || !account.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Get list failed")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        List<Map<String, Object>> admissionFormList = admissionFormRepo.findAll().stream()
                //kiểm tra, nếu form ko cos thì vẫn hiện, chứ ko bị crash, //Crash tại form.getParent().getId() ==> trước khi tạo form phải save parent
                .filter(form -> form.getParent() != null && form.getParent().getId().equals(account.getParent().getId()))
                .filter(form -> form.getStudent() != null) // bỏ qua các AdmissionForm không có học sinh ==> tránh bị lỗi null
                .sorted(Comparator.comparing(AdmissionForm::getSubmittedDate).reversed()) // sort form theo ngày chỉnh sửa mới nhất
                .map(this::getFormDetail)
                .toList();

        List<Map<String, Object>> studentList = studentRepo.findAllByParent_Id(account.getParent().getId()).stream()
                .map(student -> {
                    Map<String, Object> studentDetail = new HashMap<>();
                    studentDetail.put("id", student.getId());
                    studentDetail.put("name", student.getName());
                    studentDetail.put("gender", student.getGender().toLowerCase());
                    studentDetail.put("dateOfBirth", student.getDateOfBirth());
                    studentDetail.put("placeOfBirth", student.getPlaceOfBirth());
                    studentDetail.put("isStudent", student.isStudent());
                    studentDetail.put("hadForm", !student.getAdmissionFormList().isEmpty());//trong từng học sinh check đã tạo form chưa
                    return studentDetail;
                })
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("admissionFormList", admissionFormList);
        data.put("studentList", studentList);


        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(data)
                        .build()
        );
    }

    private Map<String, Object> getFormDetail(AdmissionForm form) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", form.getId());
        data.put("studentId", form.getStudent().getId());
        data.put("studentName", form.getStudent().getName());
        data.put("studentGender", form.getStudent().getGender());
        data.put("studentDateOfBirth", form.getStudent().getDateOfBirth());
        data.put("studentPlaceOfBirth", form.getStudent().getPlaceOfBirth());
        data.put("profileImage", form.getProfileImage());
        data.put("householdRegistrationAddress", form.getHouseholdRegistrationAddress());
        data.put("householdRegistrationImg", form.getHouseholdRegistrationImg());
        data.put("birthCertificateImg", form.getBirthCertificateImg());
        data.put("commitmentImg", form.getCommitmentImg());
        data.put("submittedDate", form.getSubmittedDate());
        data.put("cancelReason", form.getCancelReason());
        data.put("note", form.getNote());
        data.put("status", form.getStatus());
        return data;
    }

    //submit form
    @Override
    public ResponseEntity<ResponseObject> submitAdmissionForm(SubmitAdmissionFormRequest request, HttpServletRequest httpRequest) {

        // 1. Lấy account từ cookie
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Submitted admission form failed")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        String error = FormByParentValidation.submittedForm(request);

        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        List<AdmissionForm> formList = admissionFormRepo.findAllByParent_IdAndStudent_Id(account.getParent().getId(), request.getStudentId());

        if (!formList.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("This student was already registered")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        admissionFormRepo.save(
                AdmissionForm.builder()
                        .parent(account.getParent()) // tránh lỗi bị crash null
                        .student(studentRepo.findById(request.getStudentId()).orElse(null)) //mỗi form phải gắn với đúng Student để biết phiếu đó là của ai
                        .householdRegistrationAddress(request.getHouseholdRegistrationAddress())
                        .profileImage(request.getProfileImage())
                        .householdRegistrationImg(request.getHouseholdRegistrationImg())
                        .birthCertificateImg(request.getBirthCertificateImg())
                        .commitmentImg(request.getCommitmentImg())
                        .note(request.getNote())
                        .submittedDate(LocalDate.now())
                        .status(Status.PENDING_APPROVAL.getValue())
                        .build()
        );


        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Successfully submitted")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    // cancel form
    @Override
    public ResponseEntity<ResponseObject> cancelAdmissionForm(CancelAdmissionForm request, HttpServletRequest httpRequest) {

        // 1. Lấy account từ cookie
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.PARENT)) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Cancelled admission form failed")
                            .success(false)
                            .data(null)
                            .build()
            );
        }


        String error = FormByParentValidation.canceledValidate(request, account, admissionFormRepo);

        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        AdmissionForm form = admissionFormRepo.findById(request.getId()).orElse(null);

        if (form == null) {
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .success(false)
                            .message("Admission form not found")
                            .data(null)
                            .build()
            );
        }

        form.setStatus(Status.CANCELLED.getValue());
        admissionFormRepo.save(form);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Successfully cancelled")
                        .success(true)
                        .data(null) //ko cần thiết trả về chỉ quan tâm là thông báo thành công hay thất bại
                        .build()
        );
    }


    @Override
    public ResponseEntity<ResponseObject> addChild(AddChildRequest request, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Add child failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        String error = ChildValidation.addChildValidate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(404).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        Student student = studentRepo.save(
                Student.builder()
                        .name(request.getName())
                        .gender(request.getGender())
                        .dateOfBirth(request.getDateOfBirth())
                        .placeOfBirth(request.getPlaceOfBirth())
                        .isStudent(false)         // mặc định là chưa chính thức
                        .parent(parent)           // gán cha mẹ
                        .build());

        // Save admission form if provided
        if (request.getProfileImage() != null) {
            AdmissionForm form = AdmissionForm.builder()
                    .parent(parent)
                    .student(student)
                    .profileImage(request.getProfileImage())
                    .householdRegistrationAddress(request.getHouseholdRegistrationAddress())
                    .birthCertificateImg(request.getBirthCertificateImg())
                    .householdRegistrationImg(request.getHouseholdRegistrationImg())
                    .commitmentImg(request.getCommitmentImg())
                    .submittedDate(LocalDate.now())
                    .build();
            
            admissionFormRepo.save(form);
        }

        Map<String, Object> childData = new HashMap<>();
        childData.put("id", student.getId());
        childData.put("name", student.getName());
        childData.put("gender", student.getGender());
        childData.put("dateOfBirth", student.getDateOfBirth());
        childData.put("placeOfBirth", student.getPlaceOfBirth());
        childData.put("isStudent", student.isStudent());

        // Add form information to response if exists
        if (!student.getAdmissionFormList().isEmpty()) {
            AdmissionForm latestForm = student.getAdmissionFormList().stream()
                    .max(Comparator.comparing(AdmissionForm::getSubmittedDate))
                    .orElse(null);
            
            if (latestForm != null) {
                Map<String, Object> formDetail = new HashMap<>();
                formDetail.put("profileImage", latestForm.getProfileImage());
                formDetail.put("householdRegistrationAddress", latestForm.getHouseholdRegistrationAddress());
                formDetail.put("birthCertificateImg", latestForm.getBirthCertificateImg());
                formDetail.put("householdRegistrationImg", latestForm.getHouseholdRegistrationImg());
                formDetail.put("commitmentImg", latestForm.getCommitmentImg());
                childData.put("admissionForm", formDetail);
            }
        }

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Child added successfully")
                        .success(true)
                        .data(null)
                        .build()
        );

    }

    @Override
    public ResponseEntity<ResponseObject> updateChild(UpdateChildRequest request, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Update child failed: Unauthorized")
                            .success(false)
                            .data(null)
                            .build());
        }

        String error = ChildValidation.updateChildValidate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }


        // Tìm parent từ account
        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        // KHÔNG cho update nếu đã là học sinh chính thức
        Student student = studentRepo.findById(request.getId()).orElse(null);
        System.out.println(request);
        if (student == null || !student.getParent().getId().equals(parent.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Child not found or access denied")
                            .success(false)
                            .data(null)
                            .build());
        }

        if (student.isStudent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Cannot update child info after submitting admission form")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Cập nhật thông tin nếu chưa là học sinh
        student.setName(request.getName());
        student.setGender(request.getGender());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setPlaceOfBirth(request.getPlaceOfBirth());

        studentRepo.save(student);

        // Update or create admission form if provided
        if (request.getProfileImage() != null) {
            AdmissionForm existingForm = null;
            if (!student.getAdmissionFormList().isEmpty()) {
                existingForm = student.getAdmissionFormList().stream()
                        .max(Comparator.comparing(AdmissionForm::getSubmittedDate))
                        .orElse(null);
            }

            if (existingForm != null) {
                existingForm.setProfileImage(request.getProfileImage());
                existingForm.setHouseholdRegistrationAddress(request.getHouseholdRegistrationAddress());
                existingForm.setBirthCertificateImg(request.getBirthCertificateImg());
                existingForm.setHouseholdRegistrationImg(request.getHouseholdRegistrationImg());
                existingForm.setCommitmentImg(request.getCommitmentImg());
                admissionFormRepo.save(existingForm);
            } else {
                AdmissionForm newForm = AdmissionForm.builder()
                        .parent(parent)
                        .student(student)
                        .profileImage(request.getProfileImage())
                        .householdRegistrationAddress(request.getHouseholdRegistrationAddress())
                        .birthCertificateImg(request.getBirthCertificateImg())
                        .householdRegistrationImg(request.getHouseholdRegistrationImg())
                        .commitmentImg(request.getCommitmentImg())
                        .submittedDate(LocalDate.now())
                        .build();
                
                admissionFormRepo.save(newForm);
            }
        }

        Map<String, Object> childData = new HashMap<>();
        childData.put("id", student.getId());
        childData.put("name", student.getName());
        childData.put("gender", student.getGender());
        childData.put("dateOfBirth", student.getDateOfBirth());
        childData.put("placeOfBirth", student.getPlaceOfBirth());

        // Add form information to response if exists
        if (!student.getAdmissionFormList().isEmpty()) {
            AdmissionForm latestForm = student.getAdmissionFormList().stream()
                    .max(Comparator.comparing(AdmissionForm::getSubmittedDate))
                    .orElse(null);
            
            if (latestForm != null) {
                Map<String, Object> formDetail = new HashMap<>();
                formDetail.put("profileImage", latestForm.getProfileImage());
                formDetail.put("householdRegistrationAddress", latestForm.getHouseholdRegistrationAddress());
                formDetail.put("birthCertificateImg", latestForm.getBirthCertificateImg());
                formDetail.put("householdRegistrationImg", latestForm.getHouseholdRegistrationImg());
                formDetail.put("commitmentImg", latestForm.getCommitmentImg());
                childData.put("admissionForm", formDetail);
            }
        }

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Child updated successfully")
                        .success(true)
                        .data(null)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> getChildrenByParent(HttpServletRequest request) {
        //xac thuc nguoi dung
        Account account = jwtService.extractAccountFromCookie(request);
        if (account == null || !account.getRole().equals(Role.PARENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Forbidden: Only parents can access this resource")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // Tìm parent dựa vào account ID
        Parent parent = parentRepo.findByAccount_Id(account.getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // Lấy danh sách student của parent đó
        List<Map<String, Object>> studentList = parent.getStudentList().stream()
                .map(student -> {
                    Map<String, Object> studentDetail = new HashMap<>();
                    studentDetail.put("id", student.getId());
                    studentDetail.put("name", student.getName());
                    studentDetail.put("gender", student.getGender());
                    studentDetail.put("dateOfBirth", student.getDateOfBirth());
                    studentDetail.put("placeOfBirth", student.getPlaceOfBirth());
                    studentDetail.put("isStudent", student.isStudent());
                    studentDetail.put("hadForm", !student.getAdmissionFormList().isEmpty());

                    // Add admission form information if exists
                    if (!student.getAdmissionFormList().isEmpty()) {
                        AdmissionForm latestForm = student.getAdmissionFormList().stream()
                                .max(Comparator.comparing(AdmissionForm::getSubmittedDate))
                                .orElse(null);
                        
                        if (latestForm != null) {
                            Map<String, Object> formDetail = new HashMap<>();
                            formDetail.put("profileImage", latestForm.getProfileImage());
                            formDetail.put("householdRegistrationAddress", latestForm.getHouseholdRegistrationAddress());
                            formDetail.put("birthCertificateImg", latestForm.getBirthCertificateImg());
                            formDetail.put("householdRegistrationImg", latestForm.getHouseholdRegistrationImg());
                            formDetail.put("commitmentImg", latestForm.getCommitmentImg());
                            studentDetail.put("admissionForm", formDetail);
                        }
                    }

                    return studentDetail;
                })
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(studentList)
                        .build()
        );
    }
}

