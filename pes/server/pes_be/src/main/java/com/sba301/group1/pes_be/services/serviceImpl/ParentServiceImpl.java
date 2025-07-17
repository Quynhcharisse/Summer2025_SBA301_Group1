package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.dto.requests.AddChildRequest;
import com.sba301.group1.pes_be.dto.requests.CancelAdmissionForm;
import com.sba301.group1.pes_be.dto.requests.RefillFormRequest;
import com.sba301.group1.pes_be.dto.requests.SubmitAdmissionFormRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateChildRequest;
import com.sba301.group1.pes_be.dto.requests.UpdateParentRequest;
import com.sba301.group1.pes_be.dto.response.ActivityResponse;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import com.sba301.group1.pes_be.dto.response.ScheduleResponse;
import com.sba301.group1.pes_be.dto.response.SyllabusResponse;
import com.sba301.group1.pes_be.email.Format;
import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Activity;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Schedule;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.models.StudentClass;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.models.SyllabusLesson;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ActivityRepo;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.repositories.SyllabusLessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.services.EducationService;
import com.sba301.group1.pes_be.services.JWTService;
import com.sba301.group1.pes_be.services.MailService;
import com.sba301.group1.pes_be.services.ParentService;
import com.sba301.group1.pes_be.validations.ParentValidation.ChildValidation;
import com.sba301.group1.pes_be.validations.ParentValidation.FormByParentValidation;
import com.sba301.group1.pes_be.validations.ParentValidation.UpdateProfileValidation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {

    private final JWTService jwtService;

    private final AdmissionFormRepo admissionFormRepo;

    private final AdmissionTermRepo admissionTermRepo;

    private final ParentRepo parentRepo;

    private final StudentRepo studentRepo;

    private final AccountRepo accountRepo;

    private final MailService mailService;

    private final ActivityRepo activityRepo;

    private final SyllabusRepo syllabusRepo;

    private final ScheduleRepo scheduleRepo;

    private final SyllabusLessonRepo syllabusLessonRepo;

    private final ClassesRepo classesRepo;

    // Private helper method to convert list of Activity entities to Responses
    private List<ActivityResponse> convertToResponse(List<Activity> activities) {
        return ActivityResponse.fromEntityList(activities);
    }

    // Private helper method to convert list of Schedule entities to Responses
    private List<ScheduleResponse> convertScheduleToResponse(List<Schedule> schedules) {
        return ScheduleResponse.fromEntityList(schedules);
    }

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
                    studentDetail.put("profileImage", student.getProfileImage());
                    studentDetail.put("householdRegistrationImg", student.getHouseholdRegistrationImg());
                    studentDetail.put("birthCertificateImg", student.getBirthCertificateImg());
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
        data.put("profileImage", form.getStudent().getProfileImage());
        data.put("householdRegistrationImg", form.getStudent().getHouseholdRegistrationImg());
        data.put("birthCertificateImg", form.getStudent().getBirthCertificateImg());
        data.put("childCharacteristicsFormImg", form.getChildCharacteristicsFormImg());
        data.put("commitmentImg", form.getCommitmentImg());
        data.put("householdRegistrationAddress", form.getHouseholdRegistrationAddress());
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
                .filter(t -> t.getStatus().equals(Status.ACTIVE_TERM))
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
        if (!isAgeValidForGrade(student.getDateOfBirth(), activeTerm.getYear())) {
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
                .filter(form -> form.getAdmissionTerm() != null && Objects.equals(form.getAdmissionTerm().getId(), activeTerm.getId()))
                .toList();

        boolean hasSubmittedForm = existingForms.stream()
                .anyMatch(form ->
                        form.getStatus().equals(Status.PENDING_APPROVAL) ||
                                form.getStatus().equals(Status.APPROVED)
                );

        if (hasSubmittedForm) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("You already have a submitted or approved form for this student in the current term.")
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
                .commitmentImg(request.getCommitmentImg())
                .childCharacteristicsFormImg(request.getChildCharacteristicsFormImg())
                .note(request.getNote())
                .submittedDate(LocalDate.now())
                .status(Status.PENDING_APPROVAL)
                .build();

        admissionFormRepo.save(form);

        //Gửi email thông báo hủy
        try {
            String subject = "[PES] Admission Form Cancelled";
            String heading = "Admission Form Cancelled";
            String bodyHtml = Format.getAdmissionCancelledBody(account.getName());
            mailService.sendMail(
                    account.getEmail(),
                    subject,
                    heading,
                    bodyHtml
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

    private boolean isAgeValidForGrade(LocalDate dob, int admissionYear) {
        int birthYear = dob.getYear();
        int ageAtAdmission = admissionYear - birthYear;

        System.out.println(birthYear);
        System.out.println(ageAtAdmission);
        return ageAtAdmission >= 3 && ageAtAdmission <= 5;
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

        form.setStatus(Status.CANCELLED);
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
    public ResponseEntity<ResponseObject> viewChild(HttpServletRequest httpRequest) {
        Account account = jwtService.extractAccountFromCookie(httpRequest);
        if (account == null || !account.getRole().equals(Role.PARENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Forbidden: Only parents can access this resource")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

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

        List<Map<String, Object>> studentList = parent.getStudentList().stream()
                .sorted(Comparator.comparing(Student::getModifiedDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(student -> {
                    Map<String, Object> studentDetail = new HashMap<>();
                    studentDetail.put("id", student.getId());
                    studentDetail.put("name", student.getName());
                    studentDetail.put("gender", student.getGender());
                    studentDetail.put("dateOfBirth", student.getDateOfBirth());
                    studentDetail.put("placeOfBirth", student.getPlaceOfBirth());
                    studentDetail.put("profileImage", student.getProfileImage());
                    studentDetail.put("birthCertificateImg", student.getBirthCertificateImg());
                    studentDetail.put("householdRegistrationImg", student.getHouseholdRegistrationImg());
                    studentDetail.put("modifiedDate", student.getModifiedDate());
                    studentDetail.put("isStudent", student.isStudent());
                    studentDetail.put("hadForm", !student.getAdmissionFormList().isEmpty());
                    studentDetail.put("updateCount", student.getUpdateCount() != null ? student.getUpdateCount() : 0);
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

        String error = ChildValidation.addChildValidate(request, httpRequest, parentRepo, jwtService);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findByAccount_Id(acc.getId()).orElse(null);
        assert parent != null;

        studentRepo.save(
                Student.builder()
                        .name(request.getName())
                        .gender(request.getGender())
                        .dateOfBirth(request.getDateOfBirth())
                        .placeOfBirth(request.getPlaceOfBirth())
                        .profileImage(request.getProfileImage())
                        .birthCertificateImg(request.getBirthCertificateImg())
                        .householdRegistrationImg(request.getHouseholdRegistrationImg())
                        .modifiedDate(LocalDate.now())
                        .isStudent(false)         // mặc định là chưa chính thức
                        .parent(parent)           // gán cha mẹ
                        .updateCount(0)           // khởi tạo số lần cập nhật là 0
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

        String error = ChildValidation.updateChildValidate(request, httpRequest, parentRepo, jwtService, studentRepo);
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
        assert parent != null;

        // KHÔNG cho update nếu đã là học sinh chính thức
        Student student = studentRepo.findById(request.getId()).orElse(null);
        assert student != null;

        // tránh bị null
        int count = student.getUpdateCount() == null ? 0 : student.getUpdateCount();
        // Deny if update limit exceeded
        if (count >= 5) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("This is critical information and can only be updated 5 times. You have reached the limit.")
                            .success(false)
                            .data(null)
                            .build());
        }

        boolean hasSubmittedForm = student.getAdmissionFormList()
                .stream()
                .anyMatch(
                        form -> !form.getStatus().equals(Status.DRAFT)
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
        student.setProfileImage(request.getProfileImage());
        student.setBirthCertificateImg(request.getBirthCertificateImg());
        student.setHouseholdRegistrationImg(request.getHouseholdRegistrationImg());
        student.setModifiedDate(LocalDate.now());
        student.setUpdateCount(count + 1); // safe increment // Tăng số lần cập nhật
        studentRepo.save(student);

        int remaining = 5 - student.getUpdateCount();

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("Update successful. You have " + remaining + " update(s) remaining.")
                        .success(true)
                        .data(null)
                        .build());
    }

    @Override
    public ResponseEntity<ResponseObject> viewProfileParent(HttpServletRequest request) {
        Account acc = jwtService.extractAccountFromCookie(request);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Forbidden: Only parents can access this resource")
                            .success(false)
                            .data(null)
                            .build());
        }

        // Retrieve parent by ID
        Parent parent = parentRepo.findById(acc.getParent().getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(404).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        Map<String, Object> parentData = new HashMap<>();
        parentData.put("id", parent.getId());
        parentData.put("name", parent.getAccount().getName());
        parentData.put("email", parent.getAccount().getEmail());
        parentData.put("phone", parent.getAccount().getPhone());
        parentData.put("gender", parent.getAccount().getGender());
        parentData.put("identityNumber", maskIdentityNumber(parent.getAccount().getIdentityNumber()));
        parentData.put("address", parent.getAddress());
        parentData.put("job", parent.getJob());
        parentData.put("relationshipToChild", parent.getRelationshipToChild());
        parentData.put("dayOfBirth", parent.getDayOfBirth());

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(parentData)
                        .build()
        );
    }

    private String maskIdentityNumber(String identityNumber) {
        if (identityNumber == null || identityNumber.length() < 4) {
            return "****"; // hoặc xử lý phù hợp nếu quá ngắn
        }

        int visibleDigits = 4;
        String masked = "*".repeat(identityNumber.length() - visibleDigits);
        String last4 = identityNumber.substring(identityNumber.length() - visibleDigits);
        return masked + last4;
    }


    @Override
    public ResponseEntity<ResponseObject> updateProfileParent(UpdateParentRequest request, HttpServletRequest httpRequest) {
        Account acc = jwtService.extractAccountFromCookie(httpRequest);
        if (acc == null || !acc.getRole().equals(Role.PARENT)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    ResponseObject.builder()
                            .message("Forbidden: Only parents can update their own profile")
                            .success(false)
                            .data(null)
                            .build());
        }

        Parent parent = parentRepo.findById(acc.getParent().getId()).orElse(null);
        if (parent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Parent not found")
                            .success(false)
                            .data(null)
                            .build());
        }

        String error = UpdateProfileValidation.validate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build());
        }

        // Update account
        Account account = parent.getAccount();
        account.setName(request.getName());
        account.setPhone(request.getPhone());
        account.setGender(request.getGender());
        accountRepo.save(account);

        // Update parent
        parent.setAddress(request.getAddress());
        parent.setJob(request.getJob());
        parent.setDayOfBirth(request.getDayOfBirth());
        parent.setRelationshipToChild(request.getRelationshipToChild());
        parentRepo.save(parent);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Profile updated successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> refillForm(RefillFormRequest request, HttpServletRequest httpRequest) {
        AdmissionForm form = admissionFormRepo.findById(request.getFormId()).orElse(null);

        if (form == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message("Form not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // Chỉ cho phép refill nếu form đang ở trạng thái REJECTED hoặc CANCELLED
        if (!(form.getStatus().equals(Status.REJECTED) || form.getStatus().equals(Status.CANCELLED))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("Only rejected or cancelled forms can be refilled.")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        form.setStatus(Status.PENDING_APPROVAL);
        form.setChildCharacteristicsFormImg(request.getChildCharacteristicsFormImg());
        form.setHouseholdRegistrationAddress(request.getHouseholdRegistrationAddress());
        form.setCommitmentImg(request.getCommitmentImg());
        form.setNote(request.getNote());
        form.setSubmittedDate(LocalDate.now());
        admissionFormRepo.save(form);

//        SubmitAdmissionFormRequest submitRequest = SubmitAdmissionFormRequest.builder()
//                .studentId(request.getStudentId())
//                .childCharacteristicsFormImg(request.getChildCharacteristicsFormImg())
//                .householdRegistrationAddress(request.getHouseholdRegistrationAddress())
//                .commitmentImg(request.getCommitmentImg())
//                .note(request.getNote())
//                .build();
//        return submitAdmissionForm(submitRequest, httpRequest);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Form refilled successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }
//
//    @Override
//    public ResponseEntity<ResponseObject> getStudentClasses(int studentId, HttpServletRequest request) {
//        Account account = jwtService.extractAccountFromCookie(request);
//        if (account == null || !account.getRole().equals(Role.PARENT)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
//                    ResponseObject.builder()
//                            .message("Forbidden: Only parents can access this resource")
//                            .success(false)
//                            .data(null)
//                            .build());
//        }
//
//        // Tìm học sinh theo ID
//        Student student = studentRepo.findById(studentId).orElse(null);
//        if (student == null || !Objects.equals(student.getParent().getId(), account.getParent().getId())) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
//                    ResponseObject.builder()
//                            .message("Student not found or access denied")
//                            .success(false)
//                            .data(null)
//                            .build());
//        }
//
//        // Lấy danh sách lớp học của học sinh
//        List<Map<String, Object>> classes = student.getStudentClassList().stream()
//                .map(studentClass -> {
//                    Map<String, Object> classData = new HashMap<>();
//                    classData.put("id", studentClass.getId());
//                    classData.put("class", studentClass.getClasses().getName());
//                    classData.put("student", studentClass.getStudent().getName());
//                    classData.put("grade", studentClass.getClasses().getGrade());
//                    classData.put("startDate", studentClass.getClasses().getStartDate());
//                    classData.put("endDate", studentClass.getClasses().getEndDate());
//                    classData.put("room", studentClass.getClasses().getRoomNumber());
//                    classData.put("syllabus", Objects.requireNonNull(getSyllabusByClassId(studentClass.getClasses().getId(), request).getBody()).getData()); //
//                    classData.put("activities", Objects.requireNonNull(getActivitiesByClassId(studentClass.getClasses().getId(), request).getBody()).getData()); //
//                    return classData;
//                })
//                .toList();
//
//        return ResponseEntity.status(HttpStatus.OK).body(
//                ResponseObject.builder()
//                        .message("Student classes retrieved successfully")
//                        .success(true)
//                        .data(classes)
//                        .build()
//        );
//    }
//
//    @Override
//    public ResponseEntity<ResponseObject> getActivitiesByClassId(int classId, HttpServletRequest request) {
//        try {
//            List<Activity> activities = activityRepo.findByClassId(classId);
//            List<ActivityResponse> activityResponses = convertToResponse(activities);
//            return ResponseEntity.ok().body(
//                    ResponseObject.builder()
//                            .message("Activities retrieved successfully")
//                            .success(true)
//                            .data(activityResponses)
//                            .build()
//            );
//
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    ResponseObject.builder()
//                            .message("Error retrieving activities: " + e.getMessage())
//                            .success(false)
//                            .data(null)
//                            .build()
//            );
//        }
//    }
//
//    @Override
//    public ResponseEntity<ResponseObject> getSyllabusByClassId(int classId, HttpServletRequest request) {
//        try {
//            if (!classesRepo.existsById(classId)) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
//                        ResponseObject.builder()
//                                .message("Class not found")
//                                .success(false)
//                                .data(null)
//                                .build()
//                );
//            }
//
//            Syllabus syllabus = syllabusRepo.findByClassId(classId);
//            if (syllabus == null) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
//                        ResponseObject.builder()
//                                .message("No syllabus found for this class")
//                                .success(false)
//                                .data(null)
//                                .build()
//                );
//            }
//
//            SyllabusResponse syllabusResponse = SyllabusResponse.fromEntity(syllabus);
//            return ResponseEntity.ok().body(
//                    ResponseObject.builder()
//                            .message("Syllabus retrieved successfully")
//                            .success(true)
//                            .data(syllabusResponse)
//                            .build()
//            );
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                    ResponseObject.builder()
//                            .message("Error retrieving syllabus: " + e.getMessage())
//                            .success(false)
//                            .data(null)
//                            .build()
//            );
//        }
//    }

    @Override
    public ResponseEntity<ResponseObject> getStudentClassDetailsGroupedByWeek(int studentId, HttpServletRequest request) {
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

        Student student = studentRepo.findById(studentId).orElse(null);
        if (student == null || !Objects.equals(student.getParent().getId(), account.getParent().getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Student not found or access denied")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        List<Map<String, Object>> classDetails = new ArrayList<>();

        for (StudentClass sc : student.getStudentClassList()) {
            Classes cls = sc.getClasses();
            Integer classId = cls.getId();

            Map<String, Object> detail = new HashMap<>();
            detail.put("classId", classId);
            detail.put("className", cls.getName());
            detail.put("grade", cls.getGrade());
            detail.put("room", cls.getRoomNumber());

            Syllabus syllabus = syllabusRepo.findById(cls.getSyllabus().getId()).orElse(null);
            detail.put("syllabus", syllabus);

            assert syllabus != null;
            List<SyllabusLesson> syllabusLessons = syllabusLessonRepo.findBySyllabusId(syllabus.getId());
            List<Map<String, Object>> lessonList = syllabusLessons.stream()
                    .map(sl -> {
                        Lesson lesson = sl.getLesson();
                        Map<String, Object> l = new HashMap<>();
                        l.put("lessonId", lesson.getId());
                        l.put("topic", lesson.getTopic());
                        l.put("description", lesson.getDescription());
                        return l;
                    }).collect(Collectors.toList());

            List<Schedule> schedules = scheduleRepo.findByClassesIdOrderByWeekNumber(classId);
            List<Map<String, Object>> scheduleData = new ArrayList<>();

            LocalDate classStart = LocalDate.parse(cls.getStartDate());

            for (Schedule schedule : schedules) {
                Map<String, Object> weekInfo = new HashMap<>();
                int weekNumber = schedule.getWeekNumber();
                LocalDate weekStart = classStart.plusWeeks(weekNumber - 1);
                LocalDate weekEnd = weekStart.plusDays(4);

                weekInfo.put("weekNumber", weekNumber);
                weekInfo.put("startDate", weekStart);
                weekInfo.put("endDate", weekEnd);
                weekInfo.put("lessons", lessonList);

                List<Activity> activities = activityRepo.findByScheduleId(schedule.getId());
                List<Map<String, Object>> activityData = new ArrayList<>();
                for (Activity act : activities) {
                    Map<String, Object> actMap = new HashMap<>();
                    actMap.put("dayOfWeek", act.getDayOfWeek());
                    actMap.put("startTime", act.getStartTime());
                    actMap.put("endTime", act.getEndTime());

                    if (act.getLesson() != null) {
                        actMap.put("type", "lesson");
                        actMap.put("lessonId", act.getLesson().getId());
                        actMap.put("topic", act.getLesson().getTopic());
                        actMap.put("description", act.getLesson().getDescription());
                    } else {
                        actMap.put("type", "extra");
                        actMap.put("topic", act.getTopic());
                        actMap.put("description", act.getDescription());
                    }
                    activityData.add(actMap);
                }

                weekInfo.put("activities", activityData);
                scheduleData.add(weekInfo);
            }

            detail.put("schedules", scheduleData);
            classDetails.add(detail);
        }

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Student class detail retrieved successfully")
                .success(true)
                .data(classDetails)
                .build());
    }
}

