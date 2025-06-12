package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.AdmissionTerm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdmissionTermRepo extends JpaRepository<AdmissionTerm, Integer> {
}
