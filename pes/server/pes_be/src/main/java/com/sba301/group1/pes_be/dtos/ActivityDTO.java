package com.sba301.group1.pes_be.dtos;

import com.sba301.group1.pes_be.models.Activity;
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
public class ActivityDTO {
    
    Integer id;
    String topic;
    String description;
    String dayOfWeek;
    String startTime;
    String endTime;
    
    // Schedule-related fields (flattened)
    Integer scheduleId;
    Integer weekNumber;
    String scheduleNote;
    
    // Class-related fields (flattened)
    Integer classId;
    String className;
    String classRoomNumber;
    String classStatus;
    String classGrade;
    
    // Lesson-related fields (flattened)
    Integer lessonId;
    String lessonTopic;
    String lessonDescription;
    
    // Constructor that accepts an Activity entity
    public ActivityDTO(Activity activity) {
        this.id = activity.getId();
        this.topic = activity.getTopic();
        this.description = activity.getDescription();
        this.dayOfWeek = activity.getDayOfWeek();
        this.startTime = activity.getStartTime();
        this.endTime = activity.getEndTime();
        
        // Extract schedule information if available
        if (activity.getSchedule() != null) {
            this.scheduleId = activity.getSchedule().getId();
            this.weekNumber = activity.getSchedule().getWeekNumber();
            this.scheduleNote = activity.getSchedule().getNote();
            
            // Extract class information if available through schedule
            if (activity.getSchedule().getClasses() != null) {
                this.classId = activity.getSchedule().getClasses().getId();
                this.className = activity.getSchedule().getClasses().getName();
                this.classRoomNumber = activity.getSchedule().getClasses().getRoomNumber();
                this.classStatus = activity.getSchedule().getClasses().getStatus();
                this.classGrade = activity.getSchedule().getClasses().getGrade() != null ? 
                    activity.getSchedule().getClasses().getGrade().toString() : null;
            }
        }
        
        // Extract lesson information if available
        if (activity.getLesson() != null) {
            this.lessonId = activity.getLesson().getId();
            this.lessonTopic = activity.getLesson().getTopic();
            this.lessonDescription = activity.getLesson().getDescription();
        }
    }
}