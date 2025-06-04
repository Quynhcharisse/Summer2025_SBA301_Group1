package com.sba301.group1.pes_be.controllers;

import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.services.ActivityService;
import com.sba301.group1.pes_be.services.ClassesService;
import com.sba301.group1.pes_be.services.LessonService;
import com.sba301.group1.pes_be.services.ScheduleService;
import com.sba301.group1.pes_be.services.SyllabusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@PreAuthorize("hasRole('teacher')")
@RequiredArgsConstructor
@Tag(name = "Teacher Management", description = "APIs for teacher role to view activities, schedules, classes, lessons, and syllabi")
public class TeacherController {

    private final ActivityService activityService;
    private final ScheduleService scheduleService;
    private final ClassesService classesService;
    private final LessonService lessonService;
    private final SyllabusService syllabusService;

    // Activity Viewing Methods
    @GetMapping("/api/activities/{activityId}")
    @Operation(summary = "Get activity by ID")
    public ResponseEntity<ResponseObject> getActivityById(@PathVariable Integer activityId) {
        return activityService.getActivityById(activityId);
    }

    @GetMapping("/api/activities/schedule/{scheduleId}")
    @Operation(summary = "Get all activities for a specific schedule")
    public ResponseEntity<ResponseObject> getActivitiesByScheduleId(@PathVariable Integer scheduleId) {
        return activityService.getActivitiesByScheduleId(scheduleId);
    }

    @GetMapping("/api/activities/class/{classId}")
    @Operation(summary = "Get all activities for a specific class")
    public ResponseEntity<ResponseObject> getActivitiesByClassId(@PathVariable Integer classId) {
        return activityService.getActivitiesByClassId(classId);
    }

    @GetMapping("/api/activities/class/{classId}/day/{dayOfWeek}")
    @Operation(summary = "Get activities for a specific class and day of week")
    public ResponseEntity<ResponseObject> getActivitiesByClassAndDay(
            @PathVariable Integer classId,
            @PathVariable String dayOfWeek) {
        return activityService.getActivitiesByClassAndDay(classId, dayOfWeek);
    }

    @GetMapping("/api/activities/lesson/{lessonId}")
    @Operation(summary = "Get activities for a lesson")
    public ResponseEntity<ResponseObject> getActivitiesByLessonId(@PathVariable Integer lessonId) {
        return activityService.getActivitiesByLessonId(lessonId);
    }

    // Schedule Viewing Methods
    @GetMapping("/api/schedules/{scheduleId}")
    @Operation(summary = "Get schedule by ID")
    public ResponseEntity<ResponseObject> getScheduleById(@PathVariable Integer scheduleId) {
        return scheduleService.getScheduleById(scheduleId);
    }

    @GetMapping("/api/schedules/class/{classId}")
    @Operation(summary = "Get all schedules for a specific class")
    public ResponseEntity<ResponseObject> getSchedulesByClassId(@PathVariable Integer classId) {
        return scheduleService.getSchedulesByClassId(classId);
    }

    @GetMapping("/api/schedules/class/{classId}/week/{weekNumber}")
    @Operation(summary = "Get weekly schedule for a specific class and week")
    public ResponseEntity<ResponseObject> getWeeklySchedule(
            @PathVariable Integer classId,
            @PathVariable int weekNumber) {
        return scheduleService.getWeeklySchedule(classId, weekNumber);
    }

    // Classes Viewing Methods
    @GetMapping("/api/classes/{classId}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ResponseObject> getClassById(@PathVariable Integer classId) {
        return classesService.getClassById(classId);
    }

    @GetMapping("/api/classes/{classId}/syllabus")
    @Operation(summary = "Get syllabus for a class")
    public ResponseEntity<ResponseObject> getClassSyllabus(@PathVariable Integer classId) {
        return classesService.getSyllabusByClassId(classId);
    }

    @GetMapping("/api/classes/{classId}/lessons")
    @Operation(summary = "Get lessons for a class via syllabus")
    public ResponseEntity<ResponseObject> getClassLessons(@PathVariable Integer classId) {
        return classesService.getLessonsByClassId(classId);
    }

    @GetMapping("/api/classes/status/{status}")
    @Operation(summary = "Get classes by status")
    public ResponseEntity<ResponseObject> getClassesByStatus(@PathVariable String status) {
        return classesService.getClassesByStatus(status);
    }

    @GetMapping("/api/classes/teacher/{teacherId}")
    @Operation(summary = "Get classes by teacher ID")
    public ResponseEntity<ResponseObject> getClassesByTeacherId(@PathVariable Integer teacherId) {
        return classesService.getClassesByTeacherId(teacherId);
    }

    @GetMapping("/api/classes/grade/{grade}")
    @Operation(summary = "Get classes by grade")
    public ResponseEntity<ResponseObject> getClassesByGrade(@PathVariable String grade) {
        return classesService.getClassesByGrade(grade);
    }

    // Lesson Viewing Methods
    @GetMapping("/api/lessons/{lessonId}")
    @Operation(summary = "Get lesson by ID")
    public ResponseEntity<ResponseObject> getLessonById(@PathVariable Integer lessonId) {
        return lessonService.getLessonById(lessonId);
    }

    @GetMapping("/api/lessons/search")
    @Operation(summary = "Search lessons by topic")
    public ResponseEntity<ResponseObject> getLessonsByTopic(@RequestParam String topic) {
        return lessonService.getLessonsByTopic(topic);
    }

    @GetMapping("/api/lessons/syllabus/{syllabusId}")
    @Operation(summary = "Get lessons by syllabus ID")
    public ResponseEntity<ResponseObject> getLessonsBySyllabus(@PathVariable Integer syllabusId) {
        return lessonService.getLessonsBySyllabusId(syllabusId);
    }

    @GetMapping("/api/lessons/class/{classId}")
    @Operation(summary = "Get lessons by class ID")
    public ResponseEntity<ResponseObject> getLessonsForClass(@PathVariable Integer classId) {
        return lessonService.getLessonsByClassId(classId);
    }

    // Syllabus Viewing Methods
    @GetMapping("/api/syllabi/{syllabusId}")
    @Operation(summary = "Get syllabus by ID")
    public ResponseEntity<ResponseObject> getSyllabusById(@PathVariable Integer syllabusId) {
        return syllabusService.getSyllabusById(syllabusId);
    }

    @GetMapping("/api/syllabi/{syllabusId}/lessons")
    @Operation(summary = "Get lessons for a syllabus")
    public ResponseEntity<ResponseObject> getSyllabusLessons(@PathVariable Integer syllabusId) {
        return syllabusService.getLessonsBySyllabusId(syllabusId);
    }

    @GetMapping("/api/syllabi/search")
    @Operation(summary = "Search syllabi by title")
    public ResponseEntity<ResponseObject> getSyllabusByTitle(@RequestParam String title) {
        return syllabusService.getSyllabusByTitle(title);
    }

    @GetMapping("/api/syllabi/class/{classId}")
    @Operation(summary = "Get syllabus for a class")
    public ResponseEntity<ResponseObject> getSyllabusForClass(@PathVariable Integer classId) {
        return syllabusService.getSyllabusByClassId(classId);
    }
}