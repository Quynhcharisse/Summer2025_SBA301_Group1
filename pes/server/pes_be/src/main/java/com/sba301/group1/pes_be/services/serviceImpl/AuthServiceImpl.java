package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.requests.LoginRequest;
import com.sba301.group1.pes_be.requests.RegisterRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.AuthService;
import com.sba301.group1.pes_be.services.JWTService;
import com.sba301.group1.pes_be.utils.CookieUtil;
import com.sba301.group1.pes_be.validations.AuthValidation.LoginValidation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Value("${security-access-expiration}")
    private long accessExpiration;

    @Value("${security-refresh-expiration}")
    private long refreshExpiration;

    private final AccountRepo accountRepo;

    private final ParentRepo parentRepo;

    private final JWTService jwtService;

    @Override
    public ResponseEntity<ResponseObject> login(LoginRequest request, HttpServletResponse response) {
        String error = LoginValidation.validate(request, accountRepo);

        if (!error.isEmpty()) {
            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        Account account = accountRepo.findByEmailAndStatus(request.getEmail(), Status.ACCOUNT_ACTIVE.getValue()).orElse(null);
        System.out.println(account);
        assert account != null;

        String newAccess = jwtService.generateAccessToken(account);
        String newRefresh = jwtService.generateRefreshToken(account);

        CookieUtil.createCookie(response, newAccess, newRefresh, accessExpiration, refreshExpiration);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Login successfully")
                        .success(true)
                        .data(buildLoginBody(account))
                        .build()
        );
    }

    private Map<String, Object> buildLoginBody(Account account) {
        Map<String, Object> body = new HashMap<>();
        body.put("parentId", account.getParent().getId());
        body.put("name", account.getName());
        body.put("email", account.getEmail());
        body.put("role", account.getRole().name());
        return body;
    }

    @Override
    public ResponseEntity<ResponseObject> logout(HttpServletResponse response) {
        CookieUtil.removeCookie(response);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Logout successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> refresh(HttpServletRequest request, HttpServletResponse response) {
        Cookie refreshToken = CookieUtil.getCookie(request, "refresh");

        if (refreshToken != null && jwtService.checkIfNotExpired(refreshToken.getValue())) {
            String email = jwtService.extractEmailFromJWT(refreshToken.getValue());
            Account account = accountRepo.findByEmail(email).orElse(null);

            if (account != null) {

                String newAccessToken = jwtService.generateAccessToken(account);
                CookieUtil.createCookie(response, newAccessToken, refreshToken.getValue(), accessExpiration, refreshExpiration);

                return ResponseEntity.ok().body(
                        ResponseObject.builder()
                                .message("Refresh access token successfully")
                                .success(true)
                                .data(null)
                                .build()
                );
            }
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ResponseObject.builder()
                        .message("Refresh invalid")
                        .success(false)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> register(RegisterRequest parentRegisterRequest, HttpServletRequest request) {
        if (parentRegisterRequest.getEmail() == null || parentRegisterRequest.getPassword() == null) {
            return ResponseEntity.status(400).body(
                    ResponseObject.builder()
                            .message("Email and password are required")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // Check if email already exists
        if (parentRepo.existsByAccount_Email(parentRegisterRequest.getEmail())) {
            return ResponseEntity.status(400).body(
                    ResponseObject.builder()
                            .message("Email is already in use")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        // Create Account
        Account account = Account.builder()
                .email(parentRegisterRequest.getEmail())
                .password(parentRegisterRequest.getPassword()) // Consider encrypting the password
                .role(Role.PARENT)
                .status("active")
                .createdAt(LocalDate.now())
                .name(parentRegisterRequest.getName())
                .phone(parentRegisterRequest.getPhone())
                .gender(parentRegisterRequest.getGender())
                .identityNumber(parentRegisterRequest.getIdentityNumber())
                .build();

        // Save Account
        accountRepo.save(account);

        // Create Parent
        Parent parent = Parent.builder()
                .account(account)
                .address(parentRegisterRequest.getAddress())
                .job(parentRegisterRequest.getJob())
                .relationshipToChild(parentRegisterRequest.getRelationshipToChild())
                .dayOfBirth(parentRegisterRequest.getDayOfBirth())
                .build();

        // Save Parent
        parentRepo.save(parent);

        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .message("Parent registered successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }
}
