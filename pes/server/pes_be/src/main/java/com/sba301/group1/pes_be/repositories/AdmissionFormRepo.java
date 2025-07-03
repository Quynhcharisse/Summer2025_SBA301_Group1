package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.AdmissionForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdmissionFormRepo extends JpaRepository<AdmissionForm, Integer> {
    List<AdmissionForm> findAllByParent_IdAndStudent_Id(int parentId, int studentId);
    AdmissionForm findByStudent_IdAndAdmissionTerm_Id(int studentId, int admissionTermId);

    List<AdmissionForm> findAllByStudentNotNullAndParent_IdAndStatusIn(Integer id, List<Status> statusesIncluded);
}
