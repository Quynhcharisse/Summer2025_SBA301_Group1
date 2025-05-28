package com.sba301.group1.pes_be.repositories;

import com.sba301.group1.pes_be.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepo extends JpaRepository<Lesson, Integer> {
}