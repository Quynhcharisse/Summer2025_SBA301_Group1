package com.sba301.group1.pes_be.requests;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateActivitiesFromLessonsRequest {
    
    Integer scheduleId;
    List<Integer> lessonIds;
    String dayOfWeek;
    String startTime;
    String endTime;
}