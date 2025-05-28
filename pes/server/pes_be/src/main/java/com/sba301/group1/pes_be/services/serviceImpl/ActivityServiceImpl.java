package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Activity;
import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.models.Schedule;
import com.sba301.group1.pes_be.repositories.ActivityRepo;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.requests.AssignActivityToClassRequest;
import com.sba301.group1.pes_be.requests.CreateActivityRequest;
import com.sba301.group1.pes_be.requests.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateActivityRequest;
import com.sba301.group1.pes_be.services.ActivityService;
import com.sba301.group1.pes_be.validations.ActivityValidation.CreateActivityValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepo activityRepo;
    private final ScheduleRepo scheduleRepo;
    private final ClassesRepo classesRepo;
    private final LessonRepo lessonRepo;

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
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                    .message("Activity created successfully")
                    .success(true)
                    .data(savedActivity)
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
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity updated successfully")
                    .success(true)
                    .data(updatedActivity)
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

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity retrieved successfully")
                    .success(true)
                    .data(activityOpt.get())
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
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activities)
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
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activities)
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
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All activities retrieved successfully")
                    .success(true)
                    .data(activities)
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

            activityRepo.deleteById(activityId);
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity deleted successfully")
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

            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activity assigned to class successfully")
                    .success(true)
                    .data(updatedActivity)
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
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Activities retrieved successfully")
                    .success(true)
                    .data(activities)
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
}