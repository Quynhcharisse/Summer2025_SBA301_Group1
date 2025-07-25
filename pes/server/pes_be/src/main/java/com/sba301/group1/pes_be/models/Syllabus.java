package com.sba301.group1.pes_be.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`syllabus`")
public class Syllabus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`syllabus_id`")
    Integer id;

    String title;

    String description;

    @OneToMany(mappedBy = "syllabus", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    List<SyllabusLesson> syllabusLessonList;

    @OneToMany(mappedBy = "syllabus", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @JsonIgnore
    List<Classes> classesList;
}
