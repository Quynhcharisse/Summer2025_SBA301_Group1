package com.sba301.group1.pes_be.services;

import com.sba301.group1.pes_be.requests.AssignActivityToClassRequest;
import com.sba301.group1.pes_be.requests.BulkCreateActivityRequest;
import com.sba301.group1.pes_be.requests.CreateActivitiesFromLessonsRequest;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;
import com.sba301.group1.pes_be.requests.CreateScheduleRequest;
import com.sba301.group1.pes_be.requests.UpdateActivityRequest;
import com.sba301.group1.pes_be.requests.UpdateScheduleRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import org.springframework.http.ResponseEntity;

/**
 * Consolidated education service interface that encompasses all education-related operations
 * including activities, classes, lessons, schedules, and syllabus management.
 */
public interface EducationService {
    
    // Activity Service Methods
    
    /**
     * Creates a new activity
     * @param request the activity creation request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> createActivity(CreateActivityRequest request);
    
    /**
     * Updates an existing activity
     * @param activityId the ID of the activity to update
     * @param request the activity update request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> updateActivity(Integer activityId, UpdateActivityRequest request);
    
    /**
     * Retrieves an activity by its ID
     * @param activityId the ID of the activity
     * @return ResponseEntity containing the activity data
     */
    ResponseEntity<ResponseObject> getActivityById(Integer activityId);
    
    /**
     * Retrieves all activities associated with a specific schedule
     * @param scheduleId the ID of the schedule
     * @return ResponseEntity containing the list of activities
     */
    ResponseEntity<ResponseObject> getActivitiesByScheduleId(Integer scheduleId);
    
    /**
     * Retrieves all activities associated with a specific class
     * @param classId the ID of the class
     * @return ResponseEntity containing the list of activities
     */
    ResponseEntity<ResponseObject> getActivitiesByClassId(Integer classId);
    
    /**
     * Retrieves all activities in the system
     * @return ResponseEntity containing the list of all activities
     */
    ResponseEntity<ResponseObject> getAllActivities();
    
    /**
     * Deletes an activity by its ID
     * @param activityId the ID of the activity to delete
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> deleteActivity(Integer activityId);
    
    /**
     * Assigns an activity to a class
     * @param request the assignment request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> assignActivityToClass(AssignActivityToClassRequest request);
    
    /**
     * Retrieves activities for a specific class on a specific day
     * @param classId the ID of the class
     * @param dayOfWeek the day of the week
     * @return ResponseEntity containing the list of activities
     */
    ResponseEntity<ResponseObject> getActivitiesByClassAndDay(Integer classId, String dayOfWeek);
    
    /**
     * Creates multiple activities in bulk
     * @param request the bulk creation request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> bulkCreateActivities(BulkCreateActivityRequest request);
    
    /**
     * Creates activities from existing lessons
     * @param request the creation request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> createActivitiesFromLessons(CreateActivitiesFromLessonsRequest request);
    
    /**
     * Retrieves all activities associated with a specific lesson
     * @param lessonId the ID of the lesson
     * @return ResponseEntity containing the list of activities
     */
    ResponseEntity<ResponseObject> getActivitiesByLessonId(Integer lessonId);
    
    // Classes Service Methods
    
    /**
     * Retrieves all classes in the system
     * @return ResponseEntity containing the list of all classes
     */
    ResponseEntity<ResponseObject> getAllClasses();
    
    /**
     * Retrieves a class by its ID
     * @param classId the ID of the class
     * @return ResponseEntity containing the class data
     */
    ResponseEntity<ResponseObject> getClassById(Integer classId);
    
    /**
     * Retrieves the syllabus associated with a specific class
     * @param classId the ID of the class
     * @return ResponseEntity containing the syllabus data
     */
    ResponseEntity<ResponseObject> getSyllabusByClassId(Integer classId);
    
    /**
     * Retrieves all lessons associated with a specific class
     * @param classId the ID of the class
     * @return ResponseEntity containing the list of lessons
     */
    ResponseEntity<ResponseObject> getLessonsByClassId(Integer classId);
    
    /**
     * Retrieves classes filtered by status
     * @param status the status to filter by
     * @return ResponseEntity containing the list of classes
     */
    ResponseEntity<ResponseObject> getClassesByStatus(String status);
    
    /**
     * Retrieves classes assigned to a specific teacher
     * @param teacherId the ID of the teacher
     * @return ResponseEntity containing the list of classes
     */
    ResponseEntity<ResponseObject> getClassesByTeacherId(Integer teacherId);
    
    /**
     * Retrieves classes filtered by grade level
     * @param grade the grade level to filter by
     * @return ResponseEntity containing the list of classes
     */
    ResponseEntity<ResponseObject> getClassesByGrade(String grade);
    
    // Lesson Service Methods
    
    /**
     * Retrieves all lessons in the system
     * @return ResponseEntity containing the list of all lessons
     */
    ResponseEntity<ResponseObject> getAllLessons();
    
    /**
     * Retrieves a lesson by its ID
     * @param lessonId the ID of the lesson
     * @return ResponseEntity containing the lesson data
     */
    ResponseEntity<ResponseObject> getLessonById(Integer lessonId);
    
    /**
     * Retrieves lessons filtered by topic
     * @param topic the topic to filter by
     * @return ResponseEntity containing the list of lessons
     */
    ResponseEntity<ResponseObject> getLessonsByTopic(String topic);
    
    /**
     * Retrieves all lessons associated with a specific syllabus
     * @param syllabusId the ID of the syllabus
     * @return ResponseEntity containing the list of lessons
     */
    ResponseEntity<ResponseObject> getLessonsBySyllabusId(Integer syllabusId);
    
    // Schedule Service Methods
    
    /**
     * Creates a new schedule
     * @param request the schedule creation request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> createSchedule(CreateScheduleRequest request);
    
    /**
     * Updates an existing schedule
     * @param scheduleId the ID of the schedule to update
     * @param request the schedule update request
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> updateSchedule(Integer scheduleId, UpdateScheduleRequest request);
    
    /**
     * Retrieves a schedule by its ID
     * @param scheduleId the ID of the schedule
     * @return ResponseEntity containing the schedule data
     */
    ResponseEntity<ResponseObject> getScheduleById(Integer scheduleId);
    
    /**
     * Retrieves all schedules associated with a specific class
     * @param classId the ID of the class
     * @return ResponseEntity containing the list of schedules
     */
    ResponseEntity<ResponseObject> getSchedulesByClassId(Integer classId);
    
    /**
     * Retrieves the weekly schedule for a specific class
     * @param classId the ID of the class
     * @param weekNumber the week number
     * @return ResponseEntity containing the weekly schedule
     */
    ResponseEntity<ResponseObject> getWeeklySchedule(Integer classId, int weekNumber);
    
    /**
     * Deletes a schedule by its ID
     * @param scheduleId the ID of the schedule to delete
     * @return ResponseEntity containing the operation result
     */
    ResponseEntity<ResponseObject> deleteSchedule(Integer scheduleId);
    
    /**
     * Retrieves all schedules in the system
     * @return ResponseEntity containing the list of all schedules
     */
    ResponseEntity<ResponseObject> getAllSchedules();
    
    // Syllabus Service Methods
    
    /**
     * Retrieves all syllabi in the system
     * @return ResponseEntity containing the list of all syllabi
     */
    ResponseEntity<ResponseObject> getAllSyllabi();
    
    /**
     * Retrieves a syllabus by its ID
     * @param syllabusId the ID of the syllabus
     * @return ResponseEntity containing the syllabus data
     */
    ResponseEntity<ResponseObject> getSyllabusById(Integer syllabusId);
    
    /**
     * Retrieves a syllabus filtered by title
     * @param title the title to filter by
     * @return ResponseEntity containing the syllabus data
     */
    ResponseEntity<ResponseObject> getSyllabusByTitle(String title);
    
}