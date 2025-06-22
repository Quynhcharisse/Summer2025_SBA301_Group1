package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepo extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailAndPassword(String email, String password);
    Optional<Account> findByEmailAndStatus(String email, String status);
    boolean existsByEmail(String email);
    List<Account> findByRole(Role role);

}
