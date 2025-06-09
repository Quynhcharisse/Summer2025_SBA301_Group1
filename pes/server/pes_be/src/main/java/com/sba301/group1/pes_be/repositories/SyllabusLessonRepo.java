package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.SyllabusLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusLessonRepo extends JpaRepository<SyllabusLesson, Integer> {
    
    List<SyllabusLesson> findBySyllabusId(Integer syllabusId);
    
    List<SyllabusLesson> findByLessonId(Integer lessonId);
    
    @Query("SELECT sl FROM SyllabusLesson sl WHERE sl.syllabus.id = :syllabusId AND sl.lesson.id = :lessonId")
    SyllabusLesson findBySyllabusIdAndLessonId(@Param("syllabusId") Integer syllabusId, @Param("lessonId") Integer lessonId);
    
    boolean existsBySyllabusIdAndLessonId(Integer syllabusId, Integer lessonId);
}