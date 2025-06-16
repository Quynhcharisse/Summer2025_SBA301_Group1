package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.models.ReversionRequestTerm;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.ReversionRequestTermRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.requests.CreateReversionTermRequest;
import com.sba301.group1.pes_be.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.AdmissionService;
import com.sba301.group1.pes_be.services.MailService;
import com.sba301.group1.pes_be.validations.AdmissionValidation.AdmissionTermValidation;
import com.sba301.group1.pes_be.validations.AdmissionValidation.ProcessAdmissionFormValidation;
import com.sba301.group1.pes_be.validations.AdmissionValidation.ReversionRequestTermValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdmissionServiceImpl implements AdmissionService {

    private final StudentRepo studentRepo;
    private final AdmissionFormRepo admissionFormRepo;
    private final AdmissionTermRepo admissionTermRepo;
    private final MailService mailService;
    private final ReversionRequestTermRepo reversionRequestTermRepo;

    @Override
    public ResponseEntity<ResponseObject> createAdmissionTerm(CreateAdmissionTermRequest request) {
        // 1. Validate các field cơ bản (ngày, số lượng, grade rỗng...)
        String error = AdmissionTermValidation.createTermValidate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 2. Chuyển đổi grade và tính năm hiện tại
        Grade grade = Grade.valueOf(request.getGrade().toUpperCase());
        int currentYear = LocalDate.now().getYear();
        String name = "Admission Term " + grade.getName() + " " + currentYear;

        // 3. Mỗi năm, mỗi grade chỉ được phép có 1 đợt tuyển sinh
        long termCountThisYear = admissionTermRepo.countByYearAndGrade(currentYear, grade);
        if (termCountThisYear >= 1) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                            .message("Admission term already exists for grade " + grade + " in year " + currentYear)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 4. Kiểm tra trùng thời gian với cùng grade
        List<AdmissionTerm> termsWithSameGrade = admissionTermRepo.findByGrade(grade);
        for (AdmissionTerm t : termsWithSameGrade) {
            if (datesOverlap(request.getStartDate(), request.getEndDate(), t.getStartDate(), t.getEndDate())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        ResponseObject.builder()
                                .message("Time period overlaps with another term of the same grade")
                                .success(false)
                                .data(null)
                                .build()
                );
            }
        }

        // 5. Đếm số đơn đã được duyệt cho grade + year
        long approvedCount = admissionFormRepo
                .countByStatusAndAdmissionTerm_YearAndAdmissionTerm_Grade(Status.APPROVED.getValue(), currentYear, grade);

        // Nếu hợp lệ, tiếp tục tạo term
        AdmissionTerm term = admissionTermRepo.save(
                AdmissionTerm.builder()
                        .name(name)
                        .grade(Grade.valueOf(request.getGrade().toUpperCase()))
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .year(LocalDateTime.now().getYear())
                        .maxNumberRegistration(request.getMaxNumberRegistration())
                        .registeredCount((int) approvedCount)
                        .status(Status.INACTIVE_TERM.getValue())
                        .build()
        );

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("Create term successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    private boolean datesOverlap(LocalDateTime start1, LocalDateTime end1, LocalDateTime start2, LocalDateTime end2) {
        return !(end1.isBefore(start2) || start1.isAfter(end2));
    }

    @Override
    public ResponseEntity<ResponseObject> viewAdmissionTerm() {
        List<AdmissionTerm> terms = admissionTermRepo.findAll();

        LocalDateTime today = LocalDateTime.now();

        for (AdmissionTerm term : terms) {
            String updateStatus = updateTermStatus(term, today);
            if (!term.getStatus().equals(updateStatus)) {
                term.setStatus(updateStatus);
                admissionTermRepo.save(term);
            }
        }

        List<Map<String, Object>> termList = terms.stream()
                .map(term -> {
                            Map<String, Object> data = new HashMap<>();
                            data.put("id", term.getId());
                            data.put("name", term.getName());
                            data.put("startDate", term.getStartDate());
                            data.put("endDate", term.getEndDate());
                            data.put("year", LocalDate.now().getYear());
                            data.put("maxNumberRegistration", term.getMaxNumberRegistration());
                            data.put("registeredCount", term.getRegisteredCount());
                            data.put("grade", term.getGrade());
                            data.put("status", term.getStatus());
                            return data;
                        }
                )
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(termList)
                        .build()
        );
    }

    private String updateTermStatus(AdmissionTerm term, LocalDateTime today) {
        if (today.isBefore(term.getStartDate())) {
            return Status.INACTIVE_TERM.getValue();
        } else if (!today.isAfter(term.getEndDate())) {
            return Status.ACTIVE_TERM.getValue();
        } else {
            return Status.LOCKED_TERM.getValue();
        }
    }


    @Override
    public ResponseEntity<ResponseObject> createReversionRequestTerm(CreateReversionTermRequest request) {

        // 1. Validate các field cơ bản (ngày, số lượng, grade rỗng...)
        String error = ReversionRequestTermValidation.createReversionRequestTerm(request);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 2. Kiểm tra AdmissionTerm tồn tại
        AdmissionTerm term = admissionTermRepo.findById(request.getAdmissionTermId()).orElse(null);
        if (term == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Admission term not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 3. Kiểm tra status và chỉ tiêu
        if (!term.getStatus().equals(Status.LOCKED_TERM.getValue())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message("Only locked terms can have reversion requests")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        if (term.getRegisteredCount() >= term.getMaxNumberRegistration()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message("Term has already reached maximum registration")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // 4. Tạo ReversionRequestTerm
        ReversionRequestTerm reversion = ReversionRequestTerm.builder()
                .name("Reversion Term - " + term.getGrade().getName() + " " + term.getYear())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .maxNumberRegistration(request.getMaxNumberRegistration())
                .reason(request.getReason())
                .admissionTerm(term)
                .build();

        reversionRequestTermRepo.save(reversion);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .message("Reversion request term created successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewReversionRequestTerm() {
        List<ReversionRequestTerm> reversions = reversionRequestTermRepo.findAll();

        List<Map<String, Object>> reversionList = reversions.stream()
                .map(rev -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", rev.getId());
                    data.put("name", rev.getName());
                    data.put("startDate", rev.getStartDate());
                    data.put("endDate", rev.getEndDate());
                    data.put("maxNumberRegistration", rev.getMaxNumberRegistration());
                    data.put("reason", rev.getReason());
                    data.put("admissionTermId", rev.getAdmissionTerm().getId());
                    data.put("grade", rev.getAdmissionTerm().getGrade());
                    data.put("year", rev.getAdmissionTerm().getYear());
                    return data;
                })
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(reversionList)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewAdmissionFormList() {
        List<Map<String, Object>> formList = admissionFormRepo.findAll().stream()
                .sorted(Comparator.comparing(AdmissionForm::getSubmittedDate).reversed()) // sort form theo ngày chỉnh sửa mới nhất
                .map(form -> {
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
                )
                .toList();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(formList)
                        .build()
        );
    }


    @Override
    public ResponseEntity<ResponseObject> processAdmissionFormList(ProcessAdmissionFormRequest request) {
        String error = ProcessAdmissionFormValidation.processFormByManagerValidate(request, admissionFormRepo);
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
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Form not found")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        //lấy email ph từ account
        String parentEmail = form.getParent().getAccount().getEmail();//account phải có email

        if (form.getStudent() == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Form has no associated student.")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        if (request.isApproved()) {
            form.setStatus(Status.APPROVED.getValue());

            Student student = form.getStudent();
            student.setStudent(true);// Đánh dấu đã trở thành học sinh chính thức
            studentRepo.save(student);

            //gửi email thành công
            mailService.sendMail(
                    parentEmail,
                    "Admission Approved",
                    "Congratulations!\n\nThe admission form for " + form.getStudent().getName() +
                            " has been approved.\nWe look forward to seeing you at our school!"
            );
        } else {
            form.setStatus(Status.REJECTED.getValue());
            form.setCancelReason(request.getReason());

            //gửi email từ chối
            mailService.sendMail(
                    parentEmail,
                    "Admission Rejected",
                    "We're sorry.\n\nThe admission form for " + form.getStudent().getName() +
                            " has been rejected.\nReason: " + request.getReason()
            );
        }

        admissionFormRepo.save(form);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message(request.isApproved() ? "Form Approved" : "Form Rejected")
                        .success(true)
                        .data(null)
                        .build()
        );
    }
}
