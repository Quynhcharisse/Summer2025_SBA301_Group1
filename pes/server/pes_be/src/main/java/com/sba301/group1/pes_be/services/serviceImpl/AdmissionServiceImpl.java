package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.models.AdmissionTerm;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.requests.AdmissionTermRequest;
import com.sba301.group1.pes_be.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.AdmissionService;
import com.sba301.group1.pes_be.validations.AdmissionValidation.AdmissionTermValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdmissionServiceImpl implements AdmissionService {

    private final AdmissionTermRepo admissionTermRepo;

    private final AdmissionFormRepo admissionFormRepo;

    @Override
    public ResponseEntity<ResponseObject> createAdmissionTerm(AdmissionTermRequest request) {

        String error = AdmissionTermValidation.validate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        AdmissionTerm term = admissionTermRepo.save(
                AdmissionTerm.builder()
                        .name(request.getName())
                        .grade(Grade.valueOf(request.getGrade()))
                        .startDate(request.getStartDate())
                        .endDate(request.getEndDate())
                        .year(request.getYear())
                        .maxNumberRegistration(request.getMaxNumberRegistration())
                        .status(Status.INACTIVE_TERM.getValue())
                        .build()
        );

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Create term successfully")
                        .success(true)
                        .data(term)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> viewAdmissionTerm() {

        List<AdmissionTerm> terms = admissionTermRepo.findAll();

        LocalDate today = LocalDate.now();

        for (AdmissionTerm term : terms) {
            String updateStatus = updateTermStatus(term, today);
            if (!term.getStatus().equals(updateStatus)) {
                term.setStatus(updateStatus);
            }
        }
        admissionTermRepo.saveAll(terms);

        List<Map<String, Object>> result = terms.stream()
                .map(
                        term -> {
                            Map<String, Object> data = new HashMap<>();
                            data.put("id", term.getId());
                            data.put("name", term.getName());
                            data.put("startDate", term.getStartDate());
                            data.put("endDate", term.getEndDate());
                            data.put("year", term.getYear());
                            data.put("maxNumberRegistration", term.getMaxNumberRegistration());
                            data.put("grade", term.getGrade().toString());
                            data.put("status", term.getStatus());
                            return data;
                        }
                )
                .toList();

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("")
                        .success(true)
                        .data(result)
                        .build()
        );
    }

    private String updateTermStatus(AdmissionTerm term, LocalDate today) {
        if (today.isBefore(term.getStartDate())) {
            return Status.INACTIVE_TERM.getValue();
        } else if (!today.isAfter(term.getEndDate())) {
            return Status.ACTIVE_TERM.getValue();
        } else {
            return Status.LOCKED_TERM.getValue();
        }
    }

    @Override
    public ResponseEntity<ResponseObject> updateAdmissionTerm(AdmissionTermRequest request) {

        String error = AdmissionTermValidation.validate(request);
        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        AdmissionTerm term = admissionTermRepo.findById(request.getId()).orElse(null);

        if (term == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        term.setName(request.getName());
        term.setStartDate(request.getStartDate());
        term.setEndDate(request.getEndDate());
        term.setYear(request.getYear());
        term.setMaxNumberRegistration(request.getMaxNumberRegistration());
        term.setGrade(Grade.valueOf(request.getGrade().toLowerCase()));
        admissionTermRepo.save(term);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Update term successfully")
                        .success(true)
                        .data(term)
                        .build()
        );
    }


    @Override
    public ResponseEntity<ResponseObject> viewAdmissionFormList() {

        List<Map<String, Object>> formList = admissionFormRepo.findAll().stream()
                .filter(form -> form.getAdmissionTerm() != null
                        && form.getAdmissionTerm().getYear() == LocalDate.now().getYear())
                .map(
                        form -> {
                            Map<String, Object> data = new HashMap<>();
                            data.put("id", form.getId());
                            data.put("childName", form.getChildName());
                            data.put("childGender", form.getChildGender());
                            data.put("dateOfBirth", form.getDateOfBirth());
                            data.put("placeOfBirth", form.getPlaceOfBirth());
                            data.put("profileImage", form.getProfileImage());
                            data.put("householdRegistrationAddress", form.getHouseholdRegistrationAddress());
                            data.put("householdRegistrationImg", form.getHouseholdRegistrationImg());
                            data.put("birthCertificateImg", form.getBirthCertificateImg());
                            data.put("commitmentImg", form.getCommitmentImg());
                            data.put("submittedDate", form.getSubmittedDate());
                            data.put("cancelReason", form.getCancelReason());
                            data.put("note", form.getNote());
                            data.put("status", form.getStatus());

                            Map<String, Object> admissionTermData = new HashMap<>();
                            if (form.getAdmissionTerm() != null) {
                                admissionTermData.put("admissionTermStatus", form.getAdmissionTerm().getStatus());
                            }
                            data.put("admissionTerm", admissionTermData);
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
        String error = AdmissionTermValidation.processFormByManagerValidate(request, admissionFormRepo);
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

        AdmissionTerm term = form.getAdmissionTerm();
        if (term == null) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Admission term is missing")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        //Cập nhật lại trạng thái term real-time
        String updatedStatus = updateTermStatus(term, LocalDate.now());
        if (!term.getStatus().equals(updatedStatus)) {
            term.setStatus(updatedStatus);
            admissionTermRepo.save(term);
        }

        if (!updatedStatus.equals(Status.LOCKED_TERM.getValue())) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("You can only approve or reject forms after the admission term is locked.")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        if (request.isApproved()) {
            form.setStatus(Status.APPROVED.getValue());
        } else {
            form.setStatus(Status.REJECTED.getValue());
            form.setCancelReason(request.getReason());
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
