package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.dto.requests.LoginRequest;
import com.sba301.group1.pes_be.dto.requests.RegisterRequest;
import com.sba301.group1.pes_be.dto.response.ResponseObject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ResponseObject> login  (LoginRequest request, HttpServletResponse response);

    ResponseEntity<ResponseObject> logout(HttpServletResponse response);

    ResponseEntity<ResponseObject> refresh  (HttpServletRequest request, HttpServletResponse response);

    ResponseEntity<ResponseObject> register(RegisterRequest request);
}
