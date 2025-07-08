
package com.sba301.group1.pes_be.models;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Status;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`admission_term`")
public class AdmissionTerm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(length = 50)
    String name;

    @Column(name = "`start_date`")
    LocalDateTime startDate; //theo ngày + h

    @Column(name = "`end_date`")
    LocalDateTime endDate; //theo ngày + h

    int year;

    @Column(name = "`max_number_registration`")
    int maxNumberRegistration;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    Grade grade;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    Status status;

    @ManyToOne
    @JoinColumn(name = "parent_term_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    AdmissionTerm parentTerm;

    @OneToMany(mappedBy = "admissionTerm", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    List<AdmissionForm> admissionFormList;
}
