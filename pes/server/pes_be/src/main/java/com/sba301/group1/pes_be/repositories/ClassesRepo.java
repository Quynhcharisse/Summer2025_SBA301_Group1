package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.models.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassesRepo extends JpaRepository<Classes, Integer> {
    
    List<Classes> findByStatus(String status);
    
    List<Classes> findByTeacherId(Integer teacherId);
    
    List<Classes> findByGrade(Grade grade);
    
    List<Classes> findBySyllabusId(Integer syllabusId);
    
    @Query("SELECT c FROM Classes c WHERE c.name LIKE %:name%")
    List<Classes> findByNameContaining(@Param("name") String name);
    
    boolean existsByName(String name);
    
    boolean existsByNameAndIdNot(String name, Integer id);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END FROM Classes c WHERE c.teacher.id = :teacherId AND SUBSTRING(c.startDate, 1, 4) = :year")
    boolean existsByTeacherAndYear(@Param("teacherId") Integer teacherId, @Param("year") String year);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END FROM Classes c WHERE c.roomNumber = :roomNumber AND SUBSTRING(c.startDate, 1, 4) = :year")
    boolean existsByRoomNumberAndYear(@Param("roomNumber") String roomNumber, @Param("year") String year);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END FROM Classes c WHERE c.teacher.id = :teacherId AND SUBSTRING(c.startDate, 1, 4) = :year AND c.id <> :classId")
    boolean existsByTeacherAndYearAndIdNot(@Param("teacherId") Integer teacherId, @Param("year") String year, @Param("classId") Integer classId);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END FROM Classes c WHERE c.roomNumber = :roomNumber AND SUBSTRING(c.startDate, 1, 4) = :year AND c.id <> :classId")
    boolean existsByRoomNumberAndYearAndIdNot(@Param("roomNumber") String roomNumber, @Param("year") String year, @Param("classId") Integer classId);

    // Add query to fetch classes with all relationships including students
    @Query("SELECT DISTINCT c FROM Classes c LEFT JOIN FETCH c.teacher LEFT JOIN FETCH c.syllabus LEFT JOIN FETCH c.studentClassList")
    List<Classes> findAllWithFullDetails();
    
    @Query("SELECT c FROM Classes c LEFT JOIN FETCH c.teacher LEFT JOIN FETCH c.syllabus LEFT JOIN FETCH c.studentClassList WHERE c.id = :id")
    Classes findByIdWithFullDetails(@Param("id") Integer id);
}