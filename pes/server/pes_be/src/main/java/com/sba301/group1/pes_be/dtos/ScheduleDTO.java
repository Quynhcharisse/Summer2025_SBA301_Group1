package com.sba301.group1.pes_be.dtos;

import com.sba301.group1.pes_be.models.Schedule;
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
public class ScheduleDTO {
    
    Integer id;
    int weekNumber;
    String note;
    
    // Class-related fields (flattened)
    Integer classId;
    String className;
    String classRoomNumber;
    String classStatus;
    String classGrade;
    
    // Constructor that accepts a Schedule entity
    public ScheduleDTO(Schedule schedule) {
        this.id = schedule.getId();
        this.weekNumber = schedule.getWeekNumber();
        this.note = schedule.getNote();
        
        // Extract class information if available
        if (schedule.getClasses() != null) {
            this.classId = schedule.getClasses().getId();
            this.className = schedule.getClasses().getName();
            this.classRoomNumber = schedule.getClasses().getRoomNumber();
            this.classStatus = schedule.getClasses().getStatus();
            this.classGrade = schedule.getClasses().getGrade() != null ? 
                schedule.getClasses().getGrade().toString() : null;
        }
    }
}