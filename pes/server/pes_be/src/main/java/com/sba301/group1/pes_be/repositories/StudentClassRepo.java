package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentClassRepo extends JpaRepository<StudentClass, Integer> {
    
    List<StudentClass> findByStudentId(Integer studentId);
    
    List<StudentClass> findByClassesId(Integer classesId);
    
    Optional<StudentClass> findByStudentIdAndClassesId(Integer studentId, Integer classesId);
}