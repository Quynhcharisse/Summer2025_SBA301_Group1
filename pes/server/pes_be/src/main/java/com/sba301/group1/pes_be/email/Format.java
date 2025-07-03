package com.sba301.group1.pes_be.email;

public class Format {
    /** Fragment khi phụ huynh nộp đơn lần đầu */
    public static String getAdmissionSubmittedBody(String parentName, String dateTime) {
        return
                "<p>Dear " + parentName + ",</p>\n" +
                        "<p>We have received your admission form on <strong>" + dateTime + "</strong>.</p>" +
                        "<p>Please wait while our Admission Manager reviews your submission.</p>" +
                        "<p>For any questions, feel free to contact us at <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a> or (555) 123-4567.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }

    /** Fragment khi phụ huynh refill đơn (resubmit) */
    public static String getAdmissionRefilledBody(String parentName, String dateTime) {
        return
                "<p>Dear " + parentName + ",</p>\n" +
                        "<p>Your admission form has been <strong>resubmitted</strong> on <strong>" + dateTime + "</strong>.</p>" +
                        "<p>Our Admissions Team will review the updated information and get back to you shortly.</p>" +
                        "<p>If you need further assistance, contact us at <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a> or (555) 123-4567.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }


    /** Fragment khi đơn được duyệt */
    public static String getAdmissionApprovedBody(String studentName) {
        return
                "<p>Congratulations!</p>" +
                        "<p>The admission form for <strong>" + studentName + "</strong> has been <strong>approved</strong>.</p>" +
                        "<p>We are excited to welcome your child to Sunshine Preschool! Our team will reach out soon with enrollment details.</p>" +
                        "<p>For any questions, please email <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a> or call (555) 123-4567.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }

    /** Fragment khi đơn bị từ chối */
    public static String getAdmissionRejectedBody(String studentName, String reason) {
        return
                "<p>Dear Parent,</p>" +
                        "<p>We are sorry to inform you that the admission form for <strong>" + studentName + "</strong> has been <strong>rejected</strong>.</p>" +
                        "<p><strong>Reason:</strong> " + reason + "</p>" +
                        "<p>If you have any questions or wish to discuss this decision, please contact us at <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a> or (555) 123-4567.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }

    /** Fragment khi đơn bị hủy */
    public static String getAdmissionCancelledBody(String parentName) {
        return
                "<p>Dear " + parentName + ",</p>\n" +
                        "<p>Your admission form has been <strong>cancelled</strong> successfully.</p>" +
                        "<p>If this was a mistake or you wish to reapply, you may submit a new form via our portal.</p>" +
                        "<p>For assistance, contact <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a> or (555) 123-4567.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }

    /** Fragment cho trường hợp tài khoản bị khoá */
    public static String getAccountBannedBody(String name) {
        return
                "<p>Dear " + name + ",</p>\n" +
                        "<p>Your account has been <strong>suspended</strong> due to a violation of our terms of service.</p>" +
                        "<p>If you believe this is a mistake or require further information, please contact support at <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a>.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }

    /** Fragment cho trường hợp tài khoản được kích hoạt lại */
    public static String getAccountReactivatedBody(String name) {
        return
                "<p>Dear " + name + ",</p>\n" +
                        "<p>Your account has been <strong>reactivated</strong> successfully. You may now log in and continue using our services.</p>" +
                        "<p>If you experience any issues, please contact our support team at <a href=\"mailto:info@sunshinepreschool.edu\">info@sunshinepreschool.edu</a> or (555) 123-4567.</p>" +
                        "<p>Best regards,<br/>Sunshine Preschool</p>";
    }
}
