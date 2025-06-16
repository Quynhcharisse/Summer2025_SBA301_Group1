package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.models.AdmissionForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdmissionFormRepo extends JpaRepository<AdmissionForm, Integer> {
    List<AdmissionForm> findAllByParent_IdAndStudent_Id(int parentId, int studentId);
    long countByStatusAndAdmissionTerm_YearAndAdmissionTerm_Grade(String status, int year, Grade grade);
}
