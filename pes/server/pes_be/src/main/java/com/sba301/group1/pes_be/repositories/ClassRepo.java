package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRepo extends JpaRepository<Classes, Integer> {
}
