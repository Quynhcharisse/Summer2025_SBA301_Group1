package com.sba301.group1.pes_be.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`activity`")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`activity_id`")
    Integer id;

    @Column(length = 50)
    String topic;

    @Column(length = 150)
    String description;

    @Column(name = "`day_of_week`")
    String dayOfWeek;

    @Column(name = "`start_time`")
    String startTime;

    @Column(name = "`end_time`")
    String endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`schedule_id`")
    @JsonIgnore
    Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`lesson_id`")
    Lesson lesson;

}
