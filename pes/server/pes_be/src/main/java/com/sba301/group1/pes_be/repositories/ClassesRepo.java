package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.models.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassesRepo extends JpaRepository<Classes, Integer> {
    
    List<Classes> findByStatus(String status);
    
    List<Classes> findByTeacherId(Integer teacherId);
    
    List<Classes> findByGrade(Grade grade);
    
    List<Classes> findBySyllabusId(Integer syllabusId);
    
    @Query("SELECT c FROM Classes c WHERE c.name LIKE %:name%")
    List<Classes> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT c FROM Classes c WHERE c.grade = :grade AND c.status = :status")
    List<Classes> findByGradeAndStatus(@Param("grade") Grade grade, @Param("status") String status);
    
    @Query("SELECT c FROM Classes c WHERE c.syllabus.id = :syllabusId AND c.status = :status")
    List<Classes> findBySyllabusIdAndStatus(@Param("syllabusId") Integer syllabusId, @Param("status") String status);
}