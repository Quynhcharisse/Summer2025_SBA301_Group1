package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Grade;
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
import com.sba301.group1.pes_be.requests.AddChildRequest;
import com.sba301.group1.pes_be.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.requests.SubmitAdmissionFormRequest;
import com.sba301.group1.pes_be.requests.UpdateChildRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.JWTService;
import com.sba301.group1.pes_be.services.MailService;
import com.sba301.group1.pes_be.services.ParentService;
import com.sba301.group1.pes_be.validations.ParentValidation.ChildValidation;
import com.sba301.group1.pes_be.validations.ParentValidation.FormByParentValidation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
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

    private final MailService mailService;

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
                            .message("Unauthorized access")
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

        // 3. Lấy thông tin student
        Student student = studentRepo.findById(request.getStudentId()).orElse(null);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Student not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 4. Tìm kỳ tuyển sinh đang ACTIVE
        AdmissionTerm activeTerm = admissionTermRepo.findAll().stream()
                .filter(t -> t.getStatus().equals(Status.ACTIVE_TERM.getValue()))
                .findFirst()
                .orElse(null);

        if (activeTerm == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("No active admission term currently open")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 5. Kiểm tra độ tuổi phù hợp
        if (!isAgeValidForGrade(student.getDateOfBirth(), activeTerm.getGrade())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message("Student's age does not match the required grade for current term")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 6. Kiểm tra xem học sinh đã nộp form kỳ này chưa
        List<AdmissionForm> existingForms = admissionFormRepo
                .findAllByParent_IdAndStudent_Id(account.getParent().getId(), student.getId()).stream()
                .filter(form -> form.getAdmissionTerm() != null && form.getAdmissionTerm().getId() == activeTerm.getId())
                .toList();

        boolean hasSubmittedForm = existingForms.stream()
                .anyMatch(form -> !form.getStatus().equals(Status.REJECTED.getValue()) && form.getStatus().equals(Status.CANCELLED.getValue()));

        if (hasSubmittedForm) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("This student has already been submit in the current admission term.")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        boolean hasPendingForm = existingForms.stream()
                .anyMatch(form -> form.getStatus().equals(Status.PENDING_APPROVAL.getValue()));

        if (hasPendingForm) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("You have already submitted a pending form for this student in the current term.")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 7. Lưu form mới
        AdmissionForm form = AdmissionForm.builder()
                .parent(account.getParent())
                .student(student)
                .admissionTerm(activeTerm)
                .householdRegistrationAddress(request.getHouseholdRegistrationAddress())
                .note(request.getNote())
                .submittedDate(LocalDate.now())
                .status(Status.PENDING_APPROVAL.getValue())
                .build();

        admissionFormRepo.save(form);

        // 8. Gửi email
        try {
            mailService.sendMail(
                    account.getEmail(),
                    "Admission Form Submitted",
                    "Dear Parent,\n\nYour admission form for your child has been successfully submitted on "
                            + LocalDateTime.now() + ".\n\nRegards,\nSunShine Preschool"
            );
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Successfully submitted")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    private boolean isAgeValidForGrade(LocalDate dateOfBirth, Grade grade) {
        int exactAge = Period.between(dateOfBirth, LocalDate.now()).getYears();
        return exactAge == grade.getAge();
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
                            .message("Forbidden: Only parents can access this resource")
                            .success(false)
                            .data(null)
                            .build());
        }

        String error = ChildValidation.addChildValidate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
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
                        .modifiedDate(LocalDate.now())
                        .isStudent(false)         // mặc định là chưa chính thức
                        .parent(parent)           // gán cha mẹ
                        .build());


        // 7. Lưu form mới
        admissionFormRepo.save(
                AdmissionForm.builder()
                        .student(student)
                        .parent(parent)
                        .status(Status.DRAFT.getValue()) // add child ==> save thì có status = draft
                        .profileImage(request.getProfileImage())
                        .householdRegistrationImg(request.getHouseholdRegistrationImg())
                        .birthCertificateImg(request.getBirthCertificateImg())
                        .commitmentImg(request.getCommitmentImg())
                        .build());

        return ResponseEntity.status(HttpStatus.OK).body(
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
                            .message("Forbidden: Only parents can access this resource")
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
        if (student == null || !student.getParent().getId().equals(parent.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Child not found or access denied")
                            .success(false)
                            .data(null)
                            .build());
        }

        boolean hasSubmittedForm = student.getAdmissionFormList()
                .stream()
                .anyMatch(
                        form -> !form.getStatus().equals(Status.DRAFT.getValue())
                );

        if (student.isStudent() || hasSubmittedForm) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
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
        student.setModifiedDate(LocalDate.now());
        studentRepo.save(student);

        //1 draft
        AdmissionForm draftForm = student.getAdmissionFormList().stream()
                .filter(f -> f.getStatus().equals(Status.DRAFT.getValue()))
                .findFirst().get(); //1 form DRAFT duy nhất cho mỗi student

        draftForm.setProfileImage(request.getProfileImage());
        draftForm.setBirthCertificateImg(request.getBirthCertificateImg());
        draftForm.setHouseholdRegistrationImg(request.getHouseholdRegistrationImg());
        draftForm.setCommitmentImg(request.getCommitmentImg());
        admissionFormRepo.save(draftForm);

        return ResponseEntity.status(HttpStatus.OK).body(
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
                .sorted(Comparator.comparing(Student::getModifiedDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(student -> {
                    Map<String, Object> studentDetail = new HashMap<>();
                    studentDetail.put("id", student.getId());
                    studentDetail.put("name", student.getName());
                    studentDetail.put("gender", student.getGender());
                    studentDetail.put("dateOfBirth", student.getDateOfBirth());
                    studentDetail.put("placeOfBirth", student.getPlaceOfBirth());
                    studentDetail.put("modifiedDate", student.getModifiedDate());
                    studentDetail.put("isStudent", student.isStudent());
                    studentDetail.put("hadForm", !student.getAdmissionFormList().isEmpty());
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

