package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentRepo extends JpaRepository<Parent, Integer> {
    Optional<Parent> findByAccount_Id(int id);

    boolean existsByAccount_Email(String accountEmail);
}
