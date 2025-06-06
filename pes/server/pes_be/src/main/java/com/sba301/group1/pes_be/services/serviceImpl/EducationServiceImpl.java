package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.response.ActivityResponse;
import com.sba301.group1.pes_be.response.ScheduleResponse;
import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.models.*;
import com.sba301.group1.pes_be.repositories.*;
import com.sba301.group1.pes_be.requests.*;
import com.sba301.group1.pes_be.response.ResponseObject;
import com.sba301.group1.pes_be.response.ClassesResponse;
import com.sba301.group1.pes_be.response.LessonResponse;
import com.sba301.group1.pes_be.response.SyllabusResponse;
import com.sba301.group1.pes_be.services.EducationService;
import com.sba301.group1.pes_be.validations.ActivityValidation.CreateActivityValidation;
import com.sba301.group1.pes_be.validations.ScheduleValidation.CreateScheduleValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EducationServiceImpl implements EducationService {

    // Repository dependencies
    private final ActivityRepo activityRepo;
    private final ClassesRepo classesRepo;
    private final LessonRepo lessonRepo;
    private final ScheduleRepo scheduleRepo;
    private final SyllabusRepo syllabusRepo;

    // Private helper method to convert Activity entity to Response
    private ActivityResponse convertToResponse(Activity activity) {
        return ActivityResponse.fromEntity(activity);
    }

    // Private helper method to convert list of Activity entities to Responses
    private List<ActivityResponse> convertToResponse(List<Activity> activities) {
        return ActivityResponse.fromEntityList(activities);
    }

    // Private helper method to convert list of Schedule entities to Responses
    private List<ScheduleResponse> convertScheduleToResponse(List<Schedule> schedules) {
        return ScheduleResponse.fromEntityList(schedules);
    }

    // Activity Service Methods
    @Override
    public ResponseEntity<ResponseObject> createActivity(CreateActivityRequest request) {
        try {
            // Validate request
            String validationError = CreateActivityValidation.validate(request, scheduleRepo);
            if (!validationError.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message(validationError)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            // Get schedule (validation already checked it exists)
            Schedule schedule = scheduleRepo.findById(request.getScheduleId()).get();

            Activity activity = Activity.builder()
                .topic(request.getTopic())
                .description(request.getDescription())
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .schedule(schedule)
                .build();

            // Set lesson if provided
            if (request.getLessonId() != null) {
                if (lessonRepo.existsById(request.getLessonId())) {
                    activity.setLesson(Lesson.builder().id(request.getLessonId()).build());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                            .message("Lesson not found")
                            .success(false)
                            .data(null)
                            .build()
                    );
                }
            }

            Activity savedActivity = activityRepo.save(activity);
            ActivityResponse activityResponse = convertToResponse(savedActivity);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                    .message("Activity created successfully")
                    .success(true)
                    .data(activityResponse)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error creating activity: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> updateActivity(Integer activityId, UpdateActivityRequest request) {
        try {
            Optional<Activity> activityOpt = activityRepo.findById(activityId);
            if (activityOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Activity not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Activity activity = activityOpt.get();
            activity.setTopic(request.getTopic());
            activity.setDescription(request.getDescription());
            activity.setDayOfWeek(request.getDayOfWeek());
            activity.setStartTime(request.getStartTime());
            activity.setEndTime(request.getEndTime());

            // Update lesson if provided
            if (request.getLessonId() != null) {
                if (lessonRepo.existsById(request.getLessonId())) {
                    activity.setLesson(Lesson.builder().id(request.getLessonId()).build());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                            .message("Lesson not found")
                            .success(false)
                            .data(null)
                            .build()
                    );
                }
            }

            Activity updatedActivity = activityRepo.save(activity);
            ActivityResponse activityResponse = convertToResponse(updatedActivity);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity updated successfully")
                    .success(true)
                    .data(activityResponse)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error updating activity: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getActivityById(Integer activityId) {
        try {
            Optional<Activity> activityOpt = activityRepo.findById(activityId);
            if (activityOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Activity not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            ActivityResponse activityResponse = convertToResponse(activityOpt.get());
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity retrieved successfully")
                    .success(true)
                    .data(activityResponse)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving activity: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getActivitiesByScheduleId(Integer scheduleId) {
        try {
            List<Activity> activities = activityRepo.findByScheduleIdOrderByDayAndTime(scheduleId);
            List<ActivityResponse> activityResponses = convertToResponse(activities);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving activities: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getActivitiesByClassId(Integer classId) {
        try {
            List<Activity> activities = activityRepo.findByClassId(classId);
            List<ActivityResponse> activityResponses = convertToResponse(activities);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving activities: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getAllActivities() {
        try {
            List<Activity> activities = activityRepo.findAll();
            List<ActivityResponse> activityResponses = convertToResponse(activities);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All activities retrieved successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving all activities: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseObject> deleteActivity(Integer activityId) {
        try {
            Optional<Activity> activityOpt = activityRepo.findById(activityId);
            if (activityOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Activity not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Activity activity = activityOpt.get();
            
            // Check if activity is part of a schedule and gather information for response
            String scheduleInfo = "";
            Schedule schedule = null;
            if (activity.getSchedule() != null) {
                schedule = activity.getSchedule();
                scheduleInfo = String.format(" (was part of Week %d schedule for class %s)",
                    schedule.getWeekNumber(),
                    schedule.getClasses() != null ? schedule.getClasses().getName() : "Unknown");
            }

            // Proper bidirectional relationship cleanup for orphanRemoval
            if (schedule != null) {
                // Fetch the full schedule with activities to ensure the collection is loaded
                Schedule managedSchedule = scheduleRepo.findById(schedule.getId()).orElse(null);
                if (managedSchedule != null && managedSchedule.getActivities() != null) {
                    // Remove the activity from the schedule's collection
                    // This will trigger orphanRemoval and delete the activity automatically
                    managedSchedule.getActivities().removeIf(a -> a.getId().equals(activityId));
                    scheduleRepo.save(managedSchedule);
                } else {
                    // If schedule is not managed or has no activities, delete directly
                    activityRepo.deleteById(activityId);
                }
            } else {
                // Activity has no schedule, safe to delete directly
                activityRepo.deleteById(activityId);
            }
            
            String successMessage = "Activity deleted successfully" + scheduleInfo;
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message(successMessage)
                    .success(true)
                    .data(null)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error deleting activity: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> checkActivityDeletionImpact(Integer activityId) {
        try {
            Optional<Activity> activityOpt = activityRepo.findById(activityId);
            if (activityOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Activity not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Activity activity = activityOpt.get();
            
            // Build impact information
            java.util.Map<String, Object> impactInfo = new java.util.HashMap<>();
            impactInfo.put("activityId", activityId);
            impactInfo.put("activityTopic", activity.getTopic());
            impactInfo.put("hasScheduleImpact", activity.getSchedule() != null);
            
            if (activity.getSchedule() != null) {
                Schedule schedule = activity.getSchedule();
                impactInfo.put("scheduleId", schedule.getId());
                impactInfo.put("weekNumber", schedule.getWeekNumber());
                
                if (schedule.getClasses() != null) {
                    impactInfo.put("className", schedule.getClasses().getName());
                    impactInfo.put("classId", schedule.getClasses().getId());
                }
                
                // Count other activities in the same schedule
                List<Activity> scheduleActivities = activityRepo.findByScheduleId(schedule.getId());
                impactInfo.put("totalActivitiesInSchedule", scheduleActivities.size());
                impactInfo.put("isLastActivityInSchedule", scheduleActivities.size() == 1);
            }
            
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity deletion impact analysis completed")
                    .success(true)
                    .data(impactInfo)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error analyzing activity deletion impact: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> assignActivityToClass(AssignActivityToClassRequest request) {
        try {
            // Check if activity exists
            Optional<Activity> activityOpt = activityRepo.findById(request.getActivityId());
            if (activityOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Activity not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            // Check if class exists
            Optional<Classes> classOpt = classesRepo.findById(request.getClassId());
            if (classOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            // Find or create schedule for the specified week
            Optional<Schedule> scheduleOpt = scheduleRepo.findByClassesIdAndWeekNumber(
                request.getClassId(), request.getWeekNumber());
            
            Schedule schedule;
            if (scheduleOpt.isEmpty()) {
                // Create new schedule if it doesn't exist
                schedule = Schedule.builder()
                    .weekNumber(request.getWeekNumber())
                    .classes(classOpt.get())
                    .build();
                schedule = scheduleRepo.save(schedule);
            } else {
                schedule = scheduleOpt.get();
            }

            // Update activity's schedule
            Activity activity = activityOpt.get();
            activity.setSchedule(schedule);
            Activity updatedActivity = activityRepo.save(activity);
            ActivityResponse activityResponse = convertToResponse(updatedActivity);

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity assigned to class successfully")
                    .success(true)
                    .data(activityResponse)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error assigning activity to class: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getActivitiesByClassAndDay(Integer classId, String dayOfWeek) {
        try {
            List<Activity> activities = activityRepo.findByClassIdAndDayOfWeek(classId, dayOfWeek);
            List<ActivityResponse> activityResponses = convertToResponse(activities);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving activities: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> bulkCreateActivities(BulkCreateActivityRequest request) {
        try {
            // Validate schedule exists
            Optional<Schedule> scheduleOpt = scheduleRepo.findById(request.getScheduleId());
            if (scheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Schedule not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Schedule schedule = scheduleOpt.get();
            List<Activity> activities = new ArrayList<>();

            for (BulkCreateActivityRequest.ActivityData activityData : request.getActivities()) {
                Activity activity = Activity.builder()
                    .topic(activityData.getTopic())
                    .description(activityData.getDescription())
                    .dayOfWeek(activityData.getDayOfWeek())
                    .startTime(activityData.getStartTime())
                    .endTime(activityData.getEndTime())
                    .schedule(schedule)
                    .build();

                // Set lesson if provided
                if (activityData.getLessonId() != null) {
                    if (lessonRepo.existsById(activityData.getLessonId())) {
                        activity.setLesson(Lesson.builder().id(activityData.getLessonId()).build());
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            ResponseObject.builder()
                                .message("Lesson with ID " + activityData.getLessonId() + " not found")
                                .success(false)
                                .data(null)
                                .build()
                        );
                    }
                }

                activities.add(activity);
            }

            List<Activity> savedActivities = activityRepo.saveAll(activities);
            List<ActivityResponse> activityResponses = convertToResponse(savedActivities);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                    .message("Activities created successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error creating activities: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> createActivitiesFromLessons(CreateActivitiesFromLessonsRequest request) {
        try {
            // Validate schedule exists
            Optional<Schedule> scheduleOpt = scheduleRepo.findById(request.getScheduleId());
            if (scheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Schedule not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Schedule schedule = scheduleOpt.get();
            List<Activity> activities = new ArrayList<>();

            for (Integer lessonId : request.getLessonIds()) {
                Optional<Lesson> lessonOpt = lessonRepo.findById(lessonId);
                if (lessonOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        ResponseObject.builder()
                            .message("Lesson with ID " + lessonId + " not found")
                            .success(false)
                            .data(null)
                            .build()
                    );
                }

                Lesson lesson = lessonOpt.get();
                Activity activity = Activity.builder()
                    .topic(lesson.getTopic())
                    .description(lesson.getDescription())
                    .dayOfWeek(request.getDayOfWeek())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .schedule(schedule)
                    .lesson(lesson)
                    .build();

                activities.add(activity);
            }

            List<Activity> savedActivities = activityRepo.saveAll(activities);
            List<ActivityResponse> activityResponses = convertToResponse(savedActivities);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                    .message("Activities created from lessons successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error creating activities from lessons: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getActivitiesByLessonId(Integer lessonId) {
        try {
            if (!lessonRepo.existsById(lessonId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Lesson not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<Activity> activities = activityRepo.findByLessonId(lessonId);
            List<ActivityResponse> activityResponses = convertToResponse(activities);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activityResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving activities: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    // Classes Service Methods
    @Override
    public ResponseEntity<ResponseObject> getAllClasses() {
        try {
            List<Classes> classes = classesRepo.findAll();
            List<ClassesResponse> classesResponses = ClassesResponse.fromEntityList(classes);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All classes retrieved successfully")
                    .success(true)
                    .data(classesResponses)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassById(Integer classId) {
        try {
            Optional<Classes> classOpt = classesRepo.findById(classId);
            if (classOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            ClassesResponse classResponse = ClassesResponse.fromEntity(classOpt.get());
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Class retrieved successfully")
                    .success(true)
                    .data(classResponse)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving class: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusByClassId(Integer classId) {
        try {
            if (!classesRepo.existsById(classId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Syllabus syllabus = syllabusRepo.findByClassId(classId);
            if (syllabus == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No syllabus found for this class")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            SyllabusResponse syllabusResponse = SyllabusResponse.fromEntity(syllabus);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Syllabus retrieved successfully")
                    .success(true)
                    .data(syllabusResponse)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabus: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getLessonsByClassId(Integer classId) {
        try {
            if (!classesRepo.existsById(classId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<Lesson> lessons = lessonRepo.findByClassId(classId);
            List<LessonResponse> lessonResponses = LessonResponse.fromEntityList(lessons);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Lessons retrieved successfully")
                    .success(true)
                    .data(lessonResponses)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving lessons: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassesByStatus(String status) {
        try {
            List<Classes> classes = classesRepo.findByStatus(status);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassesByTeacherId(Integer teacherId) {
        try {
            List<Classes> classes = classesRepo.findByTeacherId(teacherId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getClassesByGrade(String grade) {
        try {
            Grade gradeEnum;
            try {
                gradeEnum = Grade.valueOf(grade.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message("Invalid grade value")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<Classes> classes = classesRepo.findByGrade(gradeEnum);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Classes retrieved successfully")
                    .success(true)
                    .data(classes)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving classes: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    // Lesson Service Methods
    @Override
    public ResponseEntity<ResponseObject> getAllLessons() {
        try {
            List<Lesson> lessons = lessonRepo.findAll();
            List<LessonResponse> lessonResponses = LessonResponse.fromEntityList(lessons);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All lessons retrieved successfully")
                    .success(true)
                    .data(lessonResponses)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving lessons: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getLessonById(Integer lessonId) {
        try {
            Optional<Lesson> lessonOpt = lessonRepo.findById(lessonId);
            if (lessonOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Lesson not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            LessonResponse lessonResponse = LessonResponse.fromEntity(lessonOpt.get());
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Lesson retrieved successfully")
                    .success(true)
                    .data(lessonResponse)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving lesson: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getLessonsByTopic(String topic) {
        try {
            List<Lesson> lessons = lessonRepo.findByTopicContaining(topic);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Lessons retrieved successfully")
                    .success(true)
                    .data(lessons)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving lessons: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getLessonsBySyllabusId(Integer syllabusId) {
        try {
            List<Lesson> lessons = lessonRepo.findBySyllabusId(syllabusId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Lessons retrieved successfully")
                    .success(true)
                    .data(lessons)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving lessons: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    // Schedule Service Methods
    @Override
    public ResponseEntity<ResponseObject> createSchedule(CreateScheduleRequest request) {
        try {
            // Validate request
            String validationError = CreateScheduleValidation.validate(request, classesRepo);
            if (!validationError.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message(validationError)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            // Check if schedule already exists for this week and class
            Optional<Schedule> existingSchedule = scheduleRepo.findByClassesIdAndWeekNumber(
                request.getClassId(), request.getWeekNumber());
            if (existingSchedule.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ResponseObject.builder()
                        .message("Schedule already exists for this week and class")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            // Get class (validation already checked it exists)
            Classes classes = classesRepo.findById(request.getClassId()).get();

            Schedule schedule = Schedule.builder()
                .weekNumber(request.getWeekNumber())
                .note(request.getNote())
                .classes(classes)
                .build();

            Schedule savedSchedule = scheduleRepo.save(schedule);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                    .message("Schedule created successfully")
                    .success(true)
                    .data(savedSchedule)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error creating schedule: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> updateSchedule(Integer scheduleId, UpdateScheduleRequest request) {
        try {
            Optional<Schedule> scheduleOpt = scheduleRepo.findById(scheduleId);
            if (scheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Schedule not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Schedule schedule = scheduleOpt.get();
            schedule.setWeekNumber(request.getWeekNumber());
            schedule.setNote(request.getNote());

            Schedule updatedSchedule = scheduleRepo.save(schedule);
            ScheduleResponse scheduleResponse = ScheduleResponse.fromEntity(updatedSchedule);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedule updated successfully")
                    .success(true)
                    .data(scheduleResponse)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error updating schedule: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getScheduleById(Integer scheduleId) {
        try {
            Optional<Schedule> scheduleOpt = scheduleRepo.findById(scheduleId);
            if (scheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Schedule not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedule retrieved successfully")
                    .success(true)
                    .data(scheduleOpt.get())
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving schedule: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSchedulesByClassId(Integer classId) {
        try {
            List<Schedule> schedules = scheduleRepo.findByClassesIdOrderByWeekNumber(classId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedules retrieved successfully")
                    .success(true)
                    .data(schedules)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving schedules: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getWeeklySchedule(Integer classId, int weekNumber) {
        try {
            Optional<Schedule> scheduleOpt = scheduleRepo.findByClassesIdAndWeekNumber(classId, weekNumber);
            if (scheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No schedule found for week " + weekNumber + " in this class")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Weekly schedule retrieved successfully")
                    .success(true)
                    .data(scheduleOpt.get())
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving weekly schedule: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseObject> deleteSchedule(Integer scheduleId) {
        try {
            Optional<Schedule> scheduleOpt = scheduleRepo.findById(scheduleId);
            if (scheduleOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Schedule not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            scheduleRepo.deleteById(scheduleId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedule deleted successfully")
                    .success(true)
                    .data(null)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error deleting schedule: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getAllSchedules() {
        try {
            List<Schedule> schedules = scheduleRepo.findAllWithActivitiesAndClasses();
            List<ScheduleResponse> scheduleResponses = convertScheduleToResponse(schedules);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All schedules retrieved successfully")
                    .success(true)
                    .data(scheduleResponses)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving all schedules: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    // Syllabus Service Methods
    @Override
    public ResponseEntity<ResponseObject> getAllSyllabi() {
        try {
            List<Syllabus> syllabi = syllabusRepo.findAll();
            List<SyllabusResponse> syllabusResponses = SyllabusResponse.fromEntityList(syllabi);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All syllabi retrieved successfully")
                    .success(true)
                    .data(syllabusResponses)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabi: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusById(Integer syllabusId) {
        try {
            Optional<Syllabus> syllabusOpt = syllabusRepo.findById(syllabusId);
            if (syllabusOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Syllabus not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            SyllabusResponse syllabusResponse = SyllabusResponse.fromEntity(syllabusOpt.get());
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Syllabus retrieved successfully")
                    .success(true)
                    .data(syllabusResponse)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabus: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getSyllabusByTitle(String title) {
        try {
            List<Syllabus> syllabi = syllabusRepo.findByTitleContaining(title);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Syllabi retrieved successfully")
                    .success(true)
                    .data(syllabi)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving syllabi: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }
}