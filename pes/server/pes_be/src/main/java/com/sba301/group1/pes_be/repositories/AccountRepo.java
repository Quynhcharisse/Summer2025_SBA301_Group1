package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepo extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailAndStatus(String email, Status status);
    boolean existsByEmail(String email);
    
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.classesList WHERE a.role = :role")
    List<Account> findByRoleWithClasses(@Param("role") Role role);

    List<Account> findAllByRole(Role role);
}
