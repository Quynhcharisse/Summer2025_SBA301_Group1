package com.sba301.group1.pes_be.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessAdmissionFormRequest {
    int id;
    boolean isApproved; // true = approve, false = reject
    String reason; // Lý do từ chối nếu rejected
}
