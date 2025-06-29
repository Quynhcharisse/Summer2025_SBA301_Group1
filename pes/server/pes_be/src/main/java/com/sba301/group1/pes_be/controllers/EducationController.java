package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.requests.AssignActivityToClassRequest;
import com.sba301.group1.pes_be.requests.ClassRequest;
import com.sba301.group1.pes_be.requests.CreateActivitiesFromLessonsRequest;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;
import com.sba301.group1.pes_be.requests.CreateScheduleRequest;
import com.sba301.group1.pes_be.requests.LessonRequest;
import com.sba301.group1.pes_be.requests.StudentClassRequest;
import com.sba301.group1.pes_be.requests.SyllabusRequest;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.response.RoomResponse;
import java.util.List;
import com.sba301.group1.pes_be.requests.UpdateActivityRequest;
import com.sba301.group1.pes_be.requests.UpdateScheduleRequest;
import com.sba301.group1.pes_be.services.EducationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/education")
@RequiredArgsConstructor
@Tag(name = "Education Management", description = "APIs for education role to manage activities and schedules")
public class EducationController {

    private final EducationService educationService;

    // Activity Management Methods
    @PostMapping("/activities")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a new activity")
    public ResponseEntity<ResponseObject> createActivity(@RequestBody CreateActivityRequest request) {
        return educationService.createActivity(request);
    }

    @PutMapping("/activities/{activityId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Update an existing activity")
    public ResponseEntity<ResponseObject> updateActivity(
            @PathVariable Integer activityId,
            @RequestBody UpdateActivityRequest request) {
        return educationService.updateActivity(activityId, request);
    }

    @GetMapping("/activities/{activityId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get activity by ID")
    public ResponseEntity<ResponseObject> getActivityById(@PathVariable Integer activityId) {
        return educationService.getActivityById(activityId);
    }

    @GetMapping("/activities/schedule/{scheduleId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all activities for a specific schedule")
    public ResponseEntity<ResponseObject> getActivitiesByScheduleId(@PathVariable Integer scheduleId) {
        return educationService.getActivitiesByScheduleId(scheduleId);
    }

    @GetMapping("/activities/class/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all activities for a specific class")
    public ResponseEntity<ResponseObject> getActivitiesByClassId(@PathVariable Integer classId) {
        return educationService.getActivitiesByClassId(classId);
    }

    @GetMapping("/activities/class/{classId}/day/{dayOfWeek}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get activities for a specific class and day of week")
    public ResponseEntity<ResponseObject> getActivitiesByClassAndDay(
            @PathVariable Integer classId,
            @PathVariable String dayOfWeek) {
        return educationService.getActivitiesByClassAndDay(classId, dayOfWeek);
    }


    @GetMapping("/activities/{activityId}/deletion-impact")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Check activity deletion impact on schedules")
    public ResponseEntity<ResponseObject> checkActivityDeletionImpact(@PathVariable Integer activityId) {
        return educationService.checkActivityDeletionImpact(activityId);
    }

    @DeleteMapping("/activities/{activityId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Delete an activity")
    public ResponseEntity<ResponseObject> deleteActivity(@PathVariable Integer activityId) {
        return educationService.deleteActivity(activityId);
    }

    @PostMapping("/activities/assign")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Assign activity to a class")
    public ResponseEntity<ResponseObject> assignActivityToClass(@RequestBody AssignActivityToClassRequest request) {
        return educationService.assignActivityToClass(request);
    }


    @PostMapping("/activities/create-from-lessons")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create activities from lessons")
    public ResponseEntity<ResponseObject> createActivitiesFromLessons(@RequestBody CreateActivitiesFromLessonsRequest request) {
        return educationService.createActivitiesFromLessons(request);
    }

    @GetMapping("/activities/lesson/{lessonId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get activities for a lesson")
    public ResponseEntity<ResponseObject> getActivitiesByLessonId(@PathVariable Integer lessonId) {
        return educationService.getActivitiesByLessonId(lessonId);
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all activities")
    public ResponseEntity<ResponseObject> getAllActivities() {
        return educationService.getAllActivities();
    }

    // Schedule Management Methods
    @PostMapping("/schedules")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a new schedule")
    public ResponseEntity<ResponseObject> createSchedule(@RequestBody CreateScheduleRequest request) {
        return educationService.createSchedule(request);
    }

    @PostMapping("/schedules/with-activities")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a new schedule with associated activities")
    public ResponseEntity<ResponseObject> createScheduleWithActivities(@RequestBody CreateScheduleRequest request) {
        return educationService.createScheduleWithActivities(request);
    }

    @PutMapping("/schedules/{scheduleId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Update an existing schedule")
    public ResponseEntity<ResponseObject> updateSchedule(
            @PathVariable Integer scheduleId,
            @RequestBody UpdateScheduleRequest request) {
        return educationService.updateSchedule(scheduleId, request);
    }

    @GetMapping("/schedules/{scheduleId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get schedule by ID")
    public ResponseEntity<ResponseObject> getScheduleById(@PathVariable Integer scheduleId) {
        return educationService.getScheduleById(scheduleId);
    }

    @GetMapping("/schedules/class/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all schedules for a specific class")
    public ResponseEntity<ResponseObject> getSchedulesByClassId(@PathVariable Integer classId) {
        return educationService.getSchedulesByClassId(classId);
    }

    @GetMapping("/schedules/class/{classId}/week/{weekNumber}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get weekly schedule for a specific class and week")
    public ResponseEntity<ResponseObject> getWeeklySchedule(
            @PathVariable Integer classId,
            @PathVariable int weekNumber) {
        return educationService.getWeeklySchedule(classId, weekNumber);
    }

    @DeleteMapping("/schedules/{scheduleId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Delete a schedule")
    public ResponseEntity<ResponseObject> deleteSchedule(@PathVariable Integer scheduleId) {
        return educationService.deleteSchedule(scheduleId);
    }

    @GetMapping("/schedules")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all schedules")
    public ResponseEntity<ResponseObject> getAllSchedules() {
        return educationService.getAllSchedules();
    }

    // Classes Management Methods
    @GetMapping("/classes/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ResponseObject> getClassById(@PathVariable Integer classId) {
        return educationService.getClassById(classId);
    }

    @GetMapping("/classes/{classId}/syllabus")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get syllabus for a class")
    public ResponseEntity<ResponseObject> getClassSyllabus(@PathVariable Integer classId) {
        return educationService.getSyllabusByClassId(classId);
    }

    @GetMapping("/classes/{classId}/lessons")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get lessons for a class via syllabus")
    public ResponseEntity<ResponseObject> getClassLessons(@PathVariable Integer classId) {
        return educationService.getLessonsByClassId(classId);
    }

    @GetMapping("/classes/status/{status}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get classes by status")
    public ResponseEntity<ResponseObject> getClassesByStatus(@PathVariable String status) {
        return educationService.getClassesByStatus(status);
    }

    @GetMapping("/classes/teacher/{teacherId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get classes by teacher ID")
    public ResponseEntity<ResponseObject> getClassesByTeacherId(@PathVariable Integer teacherId) {
        return educationService.getClassesByTeacherId(teacherId);
    }

    @GetMapping("/classes/grade/{grade}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get classes by grade")
    public ResponseEntity<ResponseObject> getClassesByGrade(@PathVariable String grade) {
        return educationService.getClassesByGrade(grade);
    }

    @GetMapping("/classes")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all classes")
    public ResponseEntity<ResponseObject> getAllClasses() {
        return educationService.getAllClasses();
    }

    @PostMapping("/classes")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a class", description = "Allows educations to create a new class")
    public ResponseEntity<ResponseObject> createClass(@RequestBody ClassRequest request) {
        return educationService.createClass(request);
    }

    @PutMapping("/classes/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Update a class", description = "Allows educations to update an existing class")
    public ResponseEntity<ResponseObject> updateClass(@PathVariable Integer classId, @RequestBody ClassRequest request) {
        return educationService.updateClass(classId, request);
    }

    @DeleteMapping("/classes/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Delete a class", description = "Allows education staff to delete a class")
    public ResponseEntity<ResponseObject> deleteClass(@PathVariable Integer classId) {
        return educationService.deleteClass(classId);
    }

    @PostMapping("/classes/assign-students")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Assign students to a class", description = "Allows education staff to assign students to a class")
    public ResponseEntity<ResponseObject> assignStudentsToClass(@RequestBody StudentClassRequest request) {
        return educationService.assignStudentsToClass(request);
    }

    @PostMapping("/classes/unassign-students")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Unassign students from a class", description = "Allows education staff to unassign students from a class")
    public ResponseEntity<ResponseObject> unassignStudentsFromClass(@RequestBody StudentClassRequest request) {
        return educationService.unassignStudentsFromClass(request);
    }

    // Lesson Management Methods
    @GetMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get lesson by ID")
    public ResponseEntity<ResponseObject> getLessonById(@PathVariable Integer lessonId) {
        return educationService.getLessonById(lessonId);
    }

    @GetMapping("/lessons/search")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Search lessons by topic")
    public ResponseEntity<ResponseObject> getLessonsByTopic(@RequestParam String topic) {
        return educationService.getLessonsByTopic(topic);
    }

    @PostMapping("/lessons")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a new lesson", description = "Allows education staff to create a new lesson")
    public ResponseEntity<ResponseObject> createLesson(@RequestBody LessonRequest request) {
        return educationService.createLesson(request);
    }

    @PutMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Update a lesson", description = "Allows education staff to update an existing lesson")
    public ResponseEntity<ResponseObject> updateLesson(@PathVariable Integer lessonId, @RequestBody LessonRequest request) {
        return educationService.updateLesson(lessonId, request);
    }

    @DeleteMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Delete a lesson", description = "Allows education staff to delete an existing lesson")
    public ResponseEntity<ResponseObject> updateLesson(@PathVariable Integer lessonId) {
        return educationService.deleteLesson(lessonId);
    }

    @GetMapping("/lessons/syllabus/{syllabusId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get lessons by syllabus ID")
    public ResponseEntity<ResponseObject> getLessonsBySyllabus(@PathVariable Integer syllabusId) {
        return educationService.getLessonsBySyllabusId(syllabusId);
    }

    @GetMapping("/lessons/class/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get lessons by class ID")
    public ResponseEntity<ResponseObject> getLessonsForClass(@PathVariable Integer classId) {
        return educationService.getLessonsByClassId(classId);
    }

    @GetMapping("/lessons")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all lessons")
    public ResponseEntity<ResponseObject> getAllLessons() {
        return educationService.getAllLessons();
    }

    @GetMapping("/lessons/{lessonId}/syllabi")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get syllabi for a lesson", description = "Retrieves all syllabi assigned to a specific lesson")
    public ResponseEntity<ResponseObject> getSyllabiByLessonId(@PathVariable Integer lessonId) {
        return educationService.getSyllabiByLessonId(lessonId);
    }

    // Syllabus Viewing Methods
    @GetMapping("/syllabus/{syllabusId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get syllabus by ID")
    public ResponseEntity<ResponseObject> getSyllabusById(@PathVariable Integer syllabusId) {
        return educationService.getSyllabusById(syllabusId);
    }

    @GetMapping("/syllabus/{syllabusId}/lessons")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get lessons for a syllabus")
    public ResponseEntity<ResponseObject> getSyllabusLessons(@PathVariable Integer syllabusId) {
        return educationService.getLessonsBySyllabusId(syllabusId);
    }

    @GetMapping("/syllabus/search")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Search syllabi by title")
    public ResponseEntity<ResponseObject> getSyllabusByTitle(@RequestParam String title) {
        return educationService.getSyllabusByTitle(title);
    }

    @GetMapping("/syllabus/class/{classId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get syllabus for a class")
    public ResponseEntity<ResponseObject> getSyllabusForClass(@PathVariable Integer classId) {
        return educationService.getSyllabusByClassId(classId);
    }

    @GetMapping("/syllabus")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all syllabi")
    public ResponseEntity<ResponseObject> getAllSyllabi() {
        return educationService.getAllSyllabi();
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all teachers")
    public ResponseEntity<ResponseObject> getAllTeachers() {
        return educationService.getAllTeachers();
    }

    @GetMapping("/teachers/{teacherId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get teacher by ID")
    public ResponseEntity<ResponseObject> getTeacherById(@PathVariable Integer teacherId) {
        return educationService.getTeacherById(teacherId);
    }

    @PostMapping("/syllabus")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Create a syllabus", description = "Allows education staff to create a new syllabus")
    public ResponseEntity<ResponseObject> createSyllabus(@RequestBody SyllabusRequest request) {
        return educationService.createSyllabus(request);
    }

    @PutMapping("/syllabus/{syllabusId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Update a syllabus", description = "Allows education staff to update an existing syllabus")
    public ResponseEntity<ResponseObject> updateSyllabus(@PathVariable Integer syllabusId, @RequestBody SyllabusRequest request) {
        return educationService.updateSyllabus(syllabusId, request);
    }

    @DeleteMapping("/syllabus/{syllabusId}")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Delete a syllabus", description = "Allows education staff to delete a syllabus")
    public ResponseEntity<ResponseObject> deleteSyllabus(@PathVariable Integer syllabusId) {
        return educationService.deleteSyllabus(syllabusId);
    }

    // Student Management Methods
    @GetMapping("/students")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all students")
    public ResponseEntity<ResponseObject> getAllStudents() {
        return educationService.getAllStudents();
    }

    @GetMapping("/classes/{classId}/students")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get students in a specific class")
    public ResponseEntity<ResponseObject> getStudentsByClassId(@PathVariable Integer classId) {
        return educationService.getStudentsByClassId(classId);
    }

    @GetMapping("/student-class-assignments")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get all student class assignments", description = "Retrieves all student-class assignment relationships")
    public ResponseEntity<ResponseObject> getAllStudentClassAssignments() {
        return educationService.getAllStudentClassAssignments();
    }
    
    @GetMapping("/rooms/availability")
    @PreAuthorize("hasRole('education')")
    @Operation(summary = "Get room availability (1-20)", description = "Retrieves a list of rooms from 1 to 20 with their occupancy status.")
    public ResponseEntity<List<RoomResponse>> getRoomAvailability() {
        return educationService.getRoomAvailability();
    }
}