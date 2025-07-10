package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepo extends JpaRepository<Lesson, Integer> {
    
    @Query("SELECT l FROM Lesson l WHERE l.topic LIKE %:topic%")
    List<Lesson> findByTopicContaining(@Param("topic") String topic);
    
    @Query("SELECT l FROM Lesson l " +
           "JOIN l.syllabusLessonList sl " +
           "WHERE sl.syllabus.id = :syllabusId " +
           "ORDER BY sl.id")
    List<Lesson> findBySyllabusId(@Param("syllabusId") Integer syllabusId);
    
    @Query("SELECT l FROM Lesson l " +
           "JOIN l.syllabusLessonList sl " +
           "JOIN sl.syllabus s " +
           "JOIN s.classesList c " +
           "WHERE c.id = :classId " +
           "ORDER BY sl.id")
    List<Lesson> findByClassId(@Param("classId") Integer classId);

}