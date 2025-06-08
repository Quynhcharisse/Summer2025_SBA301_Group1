package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.models.SyllabusLesson;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SyllabusLessonRepo extends JpaRepository<SyllabusLesson, Integer> {
    void deleteSyllabusLessonBySyllabus(Syllabus syllabus);
}
