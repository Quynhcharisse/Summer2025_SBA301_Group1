package com.sba301.group1.pes_be.utils;

import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseUtil {
    public static ResponseEntity<ResponseObject> build(
            HttpStatus status,
            String message,
            boolean isSuccess,
            Object data
    ) {
        return ResponseEntity
                .status(status)
                .body(
                        ResponseObject.builder()
                                .message(message)
                                .success(isSuccess)
                                .data(data)
                                .build());
    }
}
