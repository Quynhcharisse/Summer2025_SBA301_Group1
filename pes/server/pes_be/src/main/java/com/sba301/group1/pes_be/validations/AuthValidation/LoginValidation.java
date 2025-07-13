package com.sba301.group1.pes_be.validations.AuthValidation;

import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.dto.requests.LoginRequest;

public class LoginValidation {
    public static String validate(LoginRequest request, AccountRepo accountRepo) {
        Account account = accountRepo.findByEmailAndStatus(request.getEmail(), Status.ACCOUNT_ACTIVE).orElse(null);

        if (account == null) {
            return "Email or password is in correct";
        }

        if (account.getStatus().equals(Status.ACCOUNT_BAN)) {
            return "Email or password is in correct";
        }

        if (!account.getEmail().equals(request.getEmail())) {
            return "Email or password is in correct";
        }

        if (!account.getPassword().equals(request.getPassword())) {
            return "Email or password is in correct";
        }
        return "";
    }
}
