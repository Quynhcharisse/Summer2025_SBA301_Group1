package com.sba301.group1.pes_be.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Status {
    ACCOUNT_ACTIVE("active"),
    ACCOUNT_BAN("ban"),
    ACCOUNT_UNBAN("unban"),

    PENDING_APPROVAL("pending approval"),
    DRAFT("draft"),
    CANCELLED("cancelled"),
    APPROVED("approved"),
    REJECTED("rejected"),

    ACTIVE("active"),
    INACTIVE("inactive"),

    ACTIVE_TERM("active"), // trong khoảng ngày cho phép
    INACTIVE_TERM("inactive"), // chưa đến ngày
    LOCKED_TERM("locked");// đã hết ngày cho phép đăng ký

    private final String value;

    public static Status fromValue(String value) {
        for (Status status : Status.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown enum type " + value);
    }
}
