package com.sba301.group1.pes_be.repositories;


import com.sba301.group1.pes_be.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepo extends JpaRepository<Student, Integer> {
    List<Student> findAllByParent_Id(int id);
}
