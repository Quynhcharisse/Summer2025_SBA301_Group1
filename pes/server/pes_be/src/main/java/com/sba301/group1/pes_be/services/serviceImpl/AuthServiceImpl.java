package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.dto.requests.LoginRequest;
import com.sba301.group1.pes_be.dto.requests.RegisterRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import com.sba301.group1.pes_be.services.AuthService;
import com.sba301.group1.pes_be.services.JWTService;
import com.sba301.group1.pes_be.utils.CookieUtil;
import com.sba301.group1.pes_be.validations.AuthValidation.LoginValidation;
import com.sba301.group1.pes_be.validations.AuthValidation.RegisterValidation;
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

        Account account = accountRepo.findByEmailAndStatus(request.getEmail(), Status.ACCOUNT_ACTIVE).orElse(null);
        System.out.println(account);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ResponseObject.builder()
                            .message("Invalid email or password")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

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
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ResponseObject.builder()
                        .message("Refresh token is invalid or expired")
                        .success(false)
                        .data(null)
                        .build()
        );
    }

    @Override
    public ResponseEntity<ResponseObject> register(RegisterRequest request) {

        String error = RegisterValidation.validate(request, accountRepo);
        if(!error.isEmpty()){

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message(error)
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        if (accountRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                            .message("Email is already in use")
                            .success(false)
                            .data(null)
                            .build()
            );
        }

        Account account = Account.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.PARENT)
                .status(Status.ACCOUNT_ACTIVE)
                .createdAt(LocalDate.now())
                .name(request.getName())
                .phone(request.getPhone())
                .gender(request.getGender())
                .identityNumber(request.getIdentityNumber())
                .build();

        accountRepo.save(account);

        Parent parent = Parent.builder()
                .account(account)
                .address(request.getAddress())
                .job(request.getJob())
                .relationshipToChild(request.getRelationshipToChild())
                .dayOfBirth(request.getDayOfBirth())
                .build();

        parentRepo.save(parent);

        return ResponseEntity.status(HttpStatus.OK).body(
                ResponseObject.builder()
                        .message("Parent registered successfully")
                        .success(true)
                        .data(null)
                        .build()
        );
    }
}
