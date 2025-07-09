package com.sba301.group1.pes_be.validations.AdmissionValidation;

import com.sba301.group1.pes_be.dto.requests.ProcessAdmissionFormRequest;
import com.sba301.group1.pes_be.models.AdmissionForm;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;

public class ProcessAdmissionFormValidation {
    public static String processFormByManagerValidate(ProcessAdmissionFormRequest request, AdmissionFormRepo admissionFormRepo) {
        AdmissionForm form = admissionFormRepo.findById(request.getId()).orElse(null);

        if (form == null) {
            return "Form not found";
        }

        if (form.getStudent() == null) {
            return ("Form has no associated student.");
        }

        //Khi approved == false → nghĩa là đơn bị từ chối
        //bắt buộc phải nhap reason
        if (!request.isApproved()) {
            if (request.getReason().trim().isEmpty()) {
                return "Reject reason is required when form is rejected";
            }

            if (request.getReason().length() > 100) {
                return "Reject reason must not exceed 100 characters";
            }
        }
        return "";
    }
}
