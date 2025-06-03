package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.AdmissionTerm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdmissionTermRepo extends JpaRepository<AdmissionTerm, Integer> {
    Optional<AdmissionTerm> findByYear(int year);
    boolean existsByYear(int year);
}
