package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepo extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailAndPassword(String email, String password);
    Optional<Account> findByEmailAndStatus(String email, String status);
    boolean existsByEmail(String email);

}
