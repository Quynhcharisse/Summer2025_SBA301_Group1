package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassesRepo extends JpaRepository<Classes, Integer> {
    
    List<Classes> findByStatus(String status);
    
    List<Classes> findByTeacherId(Integer teacherId);
}