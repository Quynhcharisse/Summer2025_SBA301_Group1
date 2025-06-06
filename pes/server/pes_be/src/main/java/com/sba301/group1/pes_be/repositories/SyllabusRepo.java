package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SyllabusRepo extends JpaRepository<Syllabus, Integer> {
    
    @Query("SELECT s FROM Syllabus s WHERE s.title LIKE %:title%")
    List<Syllabus> findByTitleContaining(@Param("title") String title);
    
    @Query("SELECT DISTINCT s FROM Syllabus s " +
           "JOIN s.syllabusLessonList sl " +
           "JOIN sl.lesson l " +
           "WHERE l.id = :lessonId")
    List<Syllabus> findByLessonId(@Param("lessonId") Integer lessonId);
    
    @Query("SELECT s FROM Syllabus s " +
           "JOIN s.classesList c " +
           "WHERE c.id = :classId")
    Syllabus findByClassId(@Param("classId") Integer classId);
    
    @Query("SELECT COUNT(sl) FROM SyllabusLesson sl WHERE sl.syllabus.id = :syllabusId")
    Long countLessonsBySyllabusId(@Param("syllabusId") Integer syllabusId);
}