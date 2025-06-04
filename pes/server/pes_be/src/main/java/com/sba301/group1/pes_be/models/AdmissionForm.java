
package com.sba301.group1.pes_be.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

    @Column(name = "`household_registration_address`")
    String householdRegistrationAddress;

    @Column(name = "`child_birth_certificate_img`")
    String childBirthCertificateImg;

    @Column(name = "`household_registration_img`")
    String householdRegistrationImg;

    @Column(name = "`commitment_img`")
    String commitmentImg;

    @Column(name = "`cancel_reason`")
    String cancelReason;

    @Column(name = "`submitted_date`")
    LocalDate submittedDate;

    String note;

    @Column(name = "`student_name`")
    String studentName;

    String gender;

    @Column(name = "`date_of_birth`")
    LocalDate dateOfBirth;

    @Column(name = "`place_of_birth`")
    String placeOfBirth;

    @Column(name = "`profile_image`")
    String profileImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`parent_id`")
    Parent parent;

    String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`admission_term_id`")
    AdmissionTerm admissionTerm;
}
