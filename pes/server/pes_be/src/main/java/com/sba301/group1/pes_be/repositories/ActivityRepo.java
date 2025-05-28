package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepo extends JpaRepository<Activity, Integer> {
    
    List<Activity> findByScheduleId(Integer scheduleId);
    
    @Query("SELECT a FROM Activity a WHERE a.schedule.classes.id = :classId")
    List<Activity> findByClassId(@Param("classId") Integer classId);
    
    @Query("SELECT a FROM Activity a WHERE a.schedule.id = :scheduleId ORDER BY a.dayOfWeek, a.startTime")
    List<Activity> findByScheduleIdOrderByDayAndTime(@Param("scheduleId") Integer scheduleId);
    
    @Query("SELECT a FROM Activity a WHERE a.schedule.classes.id = :classId AND a.dayOfWeek = :dayOfWeek")
    List<Activity> findByClassIdAndDayOfWeek(@Param("classId") Integer classId, @Param("dayOfWeek") String dayOfWeek);
}