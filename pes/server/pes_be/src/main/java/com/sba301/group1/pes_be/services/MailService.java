package com.sba301.group1.pes_be.services;

public interface MailService {
    void sendMail(String to, String subject, String body);
}
