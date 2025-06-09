package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.AdmissionForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdmissionFormRepo extends JpaRepository<AdmissionForm, Integer> {
    List<AdmissionForm> findAllByParent_IdAndStudent_Id(int parentId, int studentId);
    // Lấy tổng số đơn theo termId
    @Query("SELECT f.admissionTerm.id, COUNT(f) FROM AdmissionForm f GROUP BY f.admissionTerm.id")
    List<Object[]> countFormsByTerm();

    // Lấy số đơn có status: approve đã duyệt theo termId
    @Query("SELECT f.admissionTerm.id, COUNT(f) FROM AdmissionForm f WHERE f.status = 'approved' GROUP BY f.admissionTerm.id")
    List<Object[]> countApprovedFormsByTerm();

}
