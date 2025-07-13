package com.sba301.group1.pes_be;

import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ActivityRepo;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.repositories.SyllabusLessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.repositories.StudentClassRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class PesBeApplication {
    public static void main(String[] args) {
        SpringApplication.run(PesBeApplication.class, args);
    }
}