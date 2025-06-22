package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.response.ActivityResponse;
import com.sba301.group1.pes_be.response.ScheduleResponse;
import com.sba301.group1.pes_be.response.TeacherResponse;
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
import com.sba301.group1.pes_be.validations.ScheduleValidation.UpdateScheduleValidation;
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
    private final SyllabusLessonRepo syllabusLessonRepo;
    private final AccountRepo accountRepo;

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

            // Update lesson if provided, or set to null if not provided
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
            } else {
                // Set lesson to null when no lesson is selected
                activity.setLesson(null);
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
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
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
            List<Classes> classes = classesRepo.findAllWithFullDetails();
            List<ClassesResponse> classesResponses = ClassesResponse.fromEntityList(classes);

            if (classesResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No classes found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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
            Classes classEntity = classesRepo.findByIdWithFullDetails(classId);
            if (classEntity == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Class not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            ClassesResponse classResponse = ClassesResponse.fromEntity(classEntity);
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

            if (lessonResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No lessons found for this class")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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

            if (classes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No classes found with status: " + status)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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

            if (classes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No classes found for teacher ID: " + teacherId)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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

            if (classes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No classes found for grade: " + grade)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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
    public ResponseEntity<ResponseObject> createClass(ClassRequest request) {
        try {
            if (request.getTeacherId() == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Teacher ID cannot be null")
                                .success(false)
                                .build()
                );
            }

            if (request.getSyllabusId() == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Syllabus ID cannot be null")
                                .success(false)
                                .build()
                );
            }

            Account teacher = accountRepo.findById(request.getTeacherId()).orElse(null);
            if (teacher == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Teacher not found")
                                .success(false)
                                .build()
                );
            }

            Syllabus syllabus = syllabusRepo.findById(request.getSyllabusId()).orElse(null);
            if (syllabus == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Syllabus not found")
                                .success(false)
                                .build()
                );
            }

            Classes classes = Classes.builder()
                    .name(request.getName())
                    .teacher(teacher)
                    .syllabus(syllabus)
                    .numberStudent(request.getNumberStudent())
                    .roomNumber(request.getRoomNumber())
                    .startDate(request.getStartDate().toString())
                    .endDate(request.getEndDate().toString())
                    .status(request.getStatus())
                    .grade(request.getGrade() != null ? Grade.valueOf(request.getGrade().toUpperCase()) : null)
                    .build();

            classesRepo.save(classes);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseObject.builder()
                            .message("Create class successfully")
                            .success(true)
                            .data(classes)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error creating class: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> updateClass(Integer classId, ClassRequest request) {
        try {
            if (request.getTeacherId() == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Teacher ID cannot be null")
                                .success(false)
                                .build()
                );
            }

            if (request.getSyllabusId() == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Syllabus ID cannot be null")
                                .success(false)
                                .build()
                );
            }

            return classesRepo.findById(classId)
                    .map(classes -> {
                        Account teacher = accountRepo.findById(request.getTeacherId()).orElse(null);
                        if (teacher == null) {
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                    ResponseObject.builder()
                                            .message("Teacher not found")
                                            .success(false)
                                            .build()
                            );
                        }

                        Syllabus syllabus = syllabusRepo.findById(request.getSyllabusId()).orElse(null);
                        if (syllabus == null) {
                            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                                    ResponseObject.builder()
                                            .message("Syllabus not found")
                                            .success(false)
                                            .build()
                            );
                        }

                        classes.setName(request.getName());
                        classes.setTeacher(teacher);
                        classes.setSyllabus(syllabus);
                        classes.setNumberStudent(request.getNumberStudent());
                        classes.setRoomNumber(request.getRoomNumber());
                        classes.setStartDate(request.getStartDate().toString());
                        classes.setEndDate(request.getEndDate().toString());
                        classes.setStatus(request.getStatus());
                        classes.setGrade(request.getGrade() != null ? Grade.valueOf(request.getGrade().toUpperCase()) : null);

                        classesRepo.save(classes);
                        return ResponseEntity.ok().body(
                                ResponseObject.builder()
                                        .message("Update class successfully")
                                        .success(true)
                                        .data(classes)
                                        .build()
                        );
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error updating class: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> deleteClass(Integer classId) {
        try {
            return classesRepo.findById(classId)
                    .map(classes -> {
                        try {
                            classesRepo.delete(classes);
                            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                                    ResponseObject.builder()
                                            .message("Class deleted successfully")
                                            .success(true)
                                            .build()
                            );
                        } catch (Exception e) {
                            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                    ResponseObject.builder()
                                            .message("Cannot delete class. It may have dependencies (students, activities, schedules, etc.)")
                                            .success(false)
                                            .build()
                            );
                        }
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error deleting class: " + e.getMessage())
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

            if (lessonResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No lessons found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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

            if (lessons.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No lessons found for topic: " + topic)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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

            if (lessons.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No lessons found for syllabus ID: " + syllabusId)
                        .success(false)
                        .data(null)
                        .build()
                );
            }

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
    public ResponseEntity<ResponseObject> createLesson(LessonRequest request) {
        try {
            Lesson lesson = Lesson.builder()
                    .topic(request.getTopic())
                    .description(request.getDescription())
                    .duration(request.getDuration())
                    .materials(request.getMaterials())
                    .build();

            lessonRepo.save(lesson);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseObject.builder()
                            .message("Create lesson successfully")
                            .success(true)
                            .data(LessonResponse.fromEntity(lesson))
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .message("Error creating lesson: " + e.getMessage())
                            .success(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> updateLesson(Integer lessonId, LessonRequest request) {
        try {
            Lesson lesson = lessonRepo.findById(lessonId).orElse(null);
            if (lesson == null) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Lesson not found")
                                .success(false)
                                .build()
                );
            }

            lesson.setTopic(request.getTopic());
            lesson.setDescription(request.getDescription());
            lesson.setDuration(request.getDuration());
            lesson.setMaterials(request.getMaterials());
            lessonRepo.save(lesson);

            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .message("Update lesson successfully")
                            .success(true)
                            .data(LessonResponse.fromEntity(lesson))
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error updating lesson: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> deleteLesson(Integer lessonId) {
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

            lessonRepo.deleteById(lessonId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ResponseObject.builder()
                    .message("Lesson deleted successfully")
                    .success(true)
                    .data(null)
                    .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error deleting lesson: " + e.getMessage())
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
            // Validate request (includes duplicate check)
            String validationError = CreateScheduleValidation.validate(request, classesRepo, scheduleRepo);
            if (!validationError.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message(validationError)
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
            ScheduleResponse scheduleResponse = ScheduleResponse.fromEntity(savedSchedule);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                    .message("Schedule created successfully")
                    .success(true)
                    .data(scheduleResponse)
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
            
            // Validate request (includes duplicate check)
            String validationError = UpdateScheduleValidation.validate(request, schedule, scheduleRepo);
            if (!validationError.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message(validationError)
                        .success(false)
                        .data(null)
                        .build()
                );
            }
            
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

            ScheduleResponse scheduleResponse = ScheduleResponse.fromEntity(scheduleOpt.get());
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedule retrieved successfully")
                    .success(true)
                    .data(scheduleResponse)
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
            List<ScheduleResponse> scheduleResponses = convertScheduleToResponse(schedules);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedules retrieved successfully")
                    .success(true)
                    .data(scheduleResponses)
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

            ScheduleResponse scheduleResponse = ScheduleResponse.fromEntity(scheduleOpt.get());
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Weekly schedule retrieved successfully")
                    .success(true)
                    .data(scheduleResponse)
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
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
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
            if (syllabusResponses.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No syllabi exist")
                        .success(false)
                        .data(null)
                        .build()
                );
            }
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
            if (syllabi.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No syllabi found with the given title")
                        .success(false)
                        .data(null)
                        .build()
                );
            }
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

    @Transactional
    @Override
    public ResponseEntity<ResponseObject> createSyllabus(SyllabusRequest request) {
        try {
            Syllabus syllabus = Syllabus.builder().
                    title(request.getTitle())
                    .description(request.getDescription())
                    .build();
            updateSyllabusLessons(request, syllabus);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ResponseObject.builder()
                            .message("Create syllabus successfully")
                            .success(true)
                            .data(SyllabusResponse.fromEntity(syllabus))
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .message("Error creating syllabus: " + e.getMessage())
                            .success(false)
                            .data(null)
                            .build()
            );
        }
    }

    @Transactional
    @Override
    public ResponseEntity<ResponseObject> updateSyllabus(Integer id, SyllabusRequest request) {
        try {
            return syllabusRepo.findById(id)
                    .map(syllabus -> {
                        syllabus.setTitle(request.getTitle());
                        syllabus.setDescription(request.getDescription());
                        Syllabus updatedSyllabus = updateSyllabusLessons(request, syllabus);

                        if (updatedSyllabus.getSyllabusLessonList() == null || updatedSyllabus.getSyllabusLessonList().isEmpty()) {
                            return ResponseEntity.badRequest().body(
                                    ResponseObject.builder()
                                            .message("Syllabus must have at least one lesson")
                                            .success(false)
                                            .build()
                            );
                        }

                        return ResponseEntity.ok().body(
                                ResponseObject.builder()
                                        .message("Update syllabus successfully")
                                        .success(true)
                                        .data(SyllabusResponse.fromEntity(syllabus))
                                        .build()
                        );
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error updating syllabus: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Transactional
    protected Syllabus updateSyllabusLessons(SyllabusRequest request, Syllabus syllabus) {
        syllabusRepo.save(syllabus);

        if (syllabus.getId() != null) {
            syllabusLessonRepo.deleteSyllabusLessonBySyllabus(syllabus);
        }

        if (request.getLessons() != null) {
            List<SyllabusLesson> syllabusLessons = new ArrayList<>();

            for (var lessonReq : request.getLessons()) {
                Lesson lesson = lessonRepo.findById(lessonReq.getLessonId())
                        .orElseThrow(() -> new RuntimeException("Lesson not found"));

                SyllabusLesson syllabusLesson = SyllabusLesson.builder()
                        .syllabus(syllabus)
                        .lesson(lesson)
                        .note(lessonReq.getNote())
                        .build();

                syllabusLessons.add(syllabusLesson);
            }

            syllabusLessonRepo.saveAll(syllabusLessons);

            syllabus.setSyllabusLessonList(syllabusLessons);
        } else {
            syllabus.setSyllabusLessonList(new ArrayList<>());
        }
        return syllabus;
    }

    @Override
    public ResponseEntity<ResponseObject> deleteSyllabus(Integer syllabusId) {
        try {
            return syllabusRepo.findById(syllabusId)
                    .map(syllabus -> {
                        try {
                            syllabusRepo.delete(syllabus);
                            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                                    ResponseObject.builder()
                                            .message("Syllabus deleted successfully")
                                            .success(true)
                                            .build()
                            );
                        } catch (Exception e) {
                            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                                    ResponseObject.builder()
                                            .message("Cannot delete syllabus. It may have dependencies (classes, lessons, etc.)")
                                            .success(false)
                                            .build()
                            );
                        }
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error deleting syllabus: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getAllTeachers() {
        try {
            List<Account> teachers = accountRepo.findByRoleWithClasses(com.sba301.group1.pes_be.enums.Role.TEACHER);
            
            if (teachers.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("No teachers found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            List<TeacherResponse> teacherResponses = TeacherResponse.fromEntityList(teachers);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All teachers retrieved successfully")
                    .success(true)
                    .data(teacherResponses)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving teachers: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }

    @Override
    public ResponseEntity<ResponseObject> getTeacherById(Integer teacherId) {
        try {
            Optional<Account> teacherOpt = accountRepo.findById(teacherId);
            if (teacherOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                        .message("Teacher not found")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            Account teacher = teacherOpt.get();
            // Check if the account is actually a teacher
            if (teacher.getRole() != com.sba301.group1.pes_be.enums.Role.TEACHER) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseObject.builder()
                        .message("Account found but user is not a teacher")
                        .success(false)
                        .data(null)
                        .build()
                );
            }

            TeacherResponse teacherResponse = TeacherResponse.fromEntity(teacher);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Teacher retrieved successfully")
                    .success(true)
                    .data(teacherResponse)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Error retrieving teacher: " + e.getMessage())
                    .success(false)
                    .data(null)
                    .build()
            );
        }
    }
}