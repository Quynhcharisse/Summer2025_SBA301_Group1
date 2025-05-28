package com.sba301.group1.pes_be.services.serviceImpl;

import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Schedule;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.requests.CreateScheduleRequest;
import com.sba301.group1.pes_be.requests.ResponseObject;
import com.sba301.group1.pes_be.requests.UpdateScheduleRequest;
import com.sba301.group1.pes_be.services.ScheduleService;
import com.sba301.group1.pes_be.validations.ScheduleValidation.CreateScheduleValidation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepo scheduleRepo;
    private final ClassesRepo classesRepo;

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
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("Schedule updated successfully")
                    .success(true)
                    .data(updatedSchedule)
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
            List<Schedule> schedules = scheduleRepo.findAll();
            return ResponseEntity.ok().body(
                ResponseObject.builder()
                    .message("All schedules retrieved successfully")
                    .success(true)
                    .data(schedules)
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
}