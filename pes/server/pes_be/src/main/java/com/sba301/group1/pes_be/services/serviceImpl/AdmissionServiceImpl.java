package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.dto.requests.CreateAdmissionTermRequest;
import com.sba301.group1.pes_be.dto.requests.CreateExtraTermRequest;
import com.sba301.group1.pes_be.dto.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import com.sba301.group1.pes_be.email.Format;
import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.services.AdmissionService;
import com.sba301.group1.pes_be.services.MailService;
import com.sba301.group1.pes_be.validations.AdmissionValidation.AdmissionTermValidation;
import com.sba301.group1.pes_be.validations.AdmissionValidation.ExtraTermValidation;
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
        String error = AdmissionTermValidation.createTermValidate(request, admissionTermRepo);
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
                        .name("Admission Term " + Grade.valueOf(request.getGrade().toUpperCase()).getName() + " " + LocalDate.now().getYear())
                        .grade(Grade.valueOf(request.getGrade().toUpperCase()))
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .year(Integer.parseInt(LocalDate.now().getYear() + "-" + (LocalDate.now().getYear() + 1)))
                        .maxNumberRegistration(request.getMaxNumberRegistration())
                        .status(Status.INACTIVE_TERM)
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

    @Override
    public ResponseEntity<ResponseObject> viewAdmissionTerm() {
        List<AdmissionTerm> terms = admissionTermRepo.findAll();

        for (AdmissionTerm term : terms) {
            Status timeStatus = updateTermStatus(term);

            //if đủ → cần "khóa" lại dù chưa hết hạn
            boolean isFull = countApprovedFormByTerm(term) >= term.getMaxNumberRegistration();

            //term đang ACTIVE nhưng đã đủ số lượng → chuyển sang LOCKED_TERM
            //trường hợp khác giữ nguyên status tính từ thời gian
            Status finalStatus = (timeStatus.equals(Status.ACTIVE_TERM) && isFull)
                    ? Status.LOCKED_TERM
                    : timeStatus;

            if (!term.getStatus().equals(finalStatus)) {
                term.setStatus(finalStatus);
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
                            data.put("year", term.getYear());
                            data.put("maxNumberRegistration", term.getMaxNumberRegistration());
                            data.put("approvedForm", countApprovedFormByTerm(term));
                            data.put("grade", term.getGrade());
                            data.put("status", term.getStatus().getValue());

                            //gọi lai extra term
                            if (!admissionTermRepo.findAllByParentTerm_Id(term.getId()).isEmpty()) {
                                data.put("extraTerms", viewExtraTerm(term));
                            }
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

    private Status updateTermStatus(AdmissionTerm term) {
        if (LocalDateTime.now().isBefore(term.getStartDate())) {
            return Status.INACTIVE_TERM;
        } else if (!LocalDateTime.now().isAfter(term.getEndDate())) {
            return Status.ACTIVE_TERM;
        } else {
            return Status.LOCKED_TERM;
        }
    }

    @Override
    public ResponseEntity<ResponseObject> createExtraTerm(CreateExtraTermRequest request) {
        String error = ExtraTermValidation.createExtraTerm(request, admissionTermRepo);
        if (!error.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        AdmissionTerm term = admissionTermRepo.findById(request.getAdmissionTermId()).orElse(null);
        assert term != null;

        AdmissionTerm extraTerm = admissionTermRepo.save(AdmissionTerm.builder()
                .name("Extra Term - " + term.getGrade().getName() + " " + term.getYear())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .maxNumberRegistration(countMissingFormAmountByTerm(term))
                .year(term.getYear())
                .grade(term.getGrade())
                .parentTerm(term)
                .status(Status.INACTIVE_TERM)
                .build());

        extraTerm.setStatus(updateTermStatus(extraTerm));
        admissionTermRepo.save(extraTerm);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .message("Extra term created successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    private int countApprovedFormByTerm(AdmissionTerm term) {
        return (int) term.getAdmissionFormList().stream().filter(form -> form.getStatus().equals(Status.APPROVED)).count();
    }

    private int countMissingFormAmountByTerm(AdmissionTerm term) {
        return term.getMaxNumberRegistration() - countApprovedFormByTerm(term);
    }

    private List<Map<String, Object>> viewExtraTerm(AdmissionTerm parentTerm) {

        return admissionTermRepo.findAllByParentTerm_Id(parentTerm.getId()).stream()
                .map(extraTerm -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", extraTerm.getId());
                    data.put("name", extraTerm.getName());
                    data.put("startDate", extraTerm.getStartDate());
                    data.put("endDate", extraTerm.getEndDate());
                    data.put("maxNumberRegistration", extraTerm.getMaxNumberRegistration());
                    data.put("approvedForm", countApprovedFormByTerm(extraTerm));
                    data.put("status", extraTerm.getStatus().getValue());
                    return data;
                })
                .toList();

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
                            data.put("profileImage", form.getStudent().getAdmissionFormList());
                            data.put("householdRegistrationAddress", form.getHouseholdRegistrationAddress());
                            data.put("householdRegistrationImg", form.getHouseholdRegistrationImg());
                            data.put("birthCertificateImg", form.getBirthCertificateImg());
                            data.put("commitmentImg", form.getCommitmentImg());
                            data.put("childCharacteristicsFormImg", form.getChildCharacteristicsFormImg());
                            data.put("submittedDate", form.getSubmittedDate());
                            data.put("cancelReason", form.getCancelReason());
                            data.put("note", form.getNote());
                            data.put("status", form.getStatus().getValue());
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        AdmissionForm form = admissionFormRepo.findById(request.getId()).orElse(null);
        assert form != null;

        Student student = form.getStudent();
        assert student != null;

        //lấy email ph từ account
        String parentEmail = form.getParent().getAccount().getEmail();//account phải có email
        if (request.isApproved()) {
            form.setStatus(Status.APPROVED);

            student.setStudent(true);// Đánh dấu đã trở thành học sinh chính thức
            studentRepo.save(student);

            String subject = "[PES] Admission Approved";
            String heading = "Admission Approved";
            String bodyHtml = Format.getAdmissionApprovedBody(student.getName());
            mailService.sendMail(parentEmail, subject, heading, bodyHtml);

        } else {
            form.setStatus(Status.REJECTED);
            form.setCancelReason(request.getReason());

            String subject = "[PES] Admission Rejected";
            String heading = "Admission Rejected";
            String bodyHtml = Format.getAdmissionRejectedBody(student.getName(), request.getReason());
            mailService.sendMail(parentEmail, subject, heading, bodyHtml);
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
