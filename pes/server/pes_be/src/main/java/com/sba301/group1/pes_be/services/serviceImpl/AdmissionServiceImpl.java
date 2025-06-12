package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.requests.CloneAdmissionTermRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.AdmissionService;
import com.sba301.group1.pes_be.services.MailService;
import com.sba301.group1.pes_be.validations.AdmissionValidation.AdmissionTermValidation;
import com.sba301.group1.pes_be.validations.AdmissionValidation.ProcessAdmissionFormValidation;
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

    @Override
    public ResponseEntity<ResponseObject> createAdmissionTerm(CreateAdmissionTermRequest request) {
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

        admissionTermRepo.save(
                AdmissionTerm.builder()
                        .grade(Grade.valueOf(request.getGrade().toUpperCase()))
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .year(LocalDateTime.now().getYear())
                        .maxNumberRegistration(request.getMaxNumberRegistration())
                        .status(Status.INACTIVE_TERM.getValue())
                        .build()
        );

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("Create term and fee successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
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
                            data.put("startDate", term.getStartDate());
                            data.put("endDate", term.getEndDate());
                            data.put("year", LocalDate.now().getYear());
                            data.put("maxNumberRegistration", term.getMaxNumberRegistration());
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
    public ResponseEntity<ResponseObject> cloneAdmissionTerm(CloneAdmissionTermRequest request) {
        return null;
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
