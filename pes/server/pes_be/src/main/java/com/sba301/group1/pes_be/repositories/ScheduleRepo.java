package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepo extends JpaRepository<Schedule, Integer> {
    @Query("SELECT s FROM Schedule s WHERE s.classes.id = :classId AND s.weekNumber = :weekNumber")
    Optional<Schedule> findByClassesIdAndWeekNumber(@Param("classId") Integer classId, @Param("weekNumber") int weekNumber);
    
    @Query("SELECT s FROM Schedule s WHERE s.classes.id = :classId ORDER BY s.weekNumber")
    List<Schedule> findByClassesIdOrderByWeekNumber(@Param("classId") Integer classId);
    
    @Query("SELECT DISTINCT s FROM Schedule s LEFT JOIN FETCH s.activities LEFT JOIN FETCH s.classes")
    List<Schedule> findAllWithActivitiesAndClasses();

    List<Schedule> findByClassesId(Integer classId);
}