
package com.sba301.group1.pes_be.models;

import com.sba301.group1.pes_be.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`admission_form`")
public class AdmissionForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "`household_registration_address`", length = 100)
    String householdRegistrationAddress;

    @Column(name = "`birth_certificate_img`")
    String birthCertificateImg;

    @Column(name = "`household_registration_img`")
    String householdRegistrationImg ;

    @Column(name = "`child_characteristics_form_img`")
    String childCharacteristicsFormImg;

    @Column(name = "`commitment_img`")
    String commitmentImg ;

    @Column(name = "`cancel_reason`", length = 50)
    String cancelReason;

    @Column(name = "`submitted_date`")
    LocalDate submittedDate;

    @Column(length = 50)
    String note;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`parent_id`")
    Parent parent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`student_id`")
    Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`admission_term_id`")
    AdmissionTerm admissionTerm;
}
