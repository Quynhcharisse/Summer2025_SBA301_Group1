package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.AdmissionForm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdmissionFormRepo extends JpaRepository<AdmissionForm, Integer> {

    List<AdmissionForm> findAllByParent_IdAndStudentName(int parentId, String studentName);
}
