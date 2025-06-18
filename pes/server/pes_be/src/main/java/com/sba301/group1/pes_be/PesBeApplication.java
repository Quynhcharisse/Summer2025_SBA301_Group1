package com.sba301.group1.pes_be;

import com.sba301.group1.pes_be.enums.Grade;
import com.sba301.group1.pes_be.enums.Role;
import com.sba301.group1.pes_be.enums.Status;
import com.sba301.group1.pes_be.models.Account;
import com.sba301.group1.pes_be.models.Activity;
import com.sba301.group1.pes_be.models.Classes;
import com.sba301.group1.pes_be.models.Lesson;
import com.sba301.group1.pes_be.models.Parent;
import com.sba301.group1.pes_be.models.Schedule;
import com.sba301.group1.pes_be.models.Student;
import com.sba301.group1.pes_be.models.Syllabus;
import com.sba301.group1.pes_be.models.SyllabusLesson;
import com.sba301.group1.pes_be.repositories.AccountRepo;
import com.sba301.group1.pes_be.repositories.ActivityRepo;
import com.sba301.group1.pes_be.repositories.AdmissionFormRepo;
import com.sba301.group1.pes_be.repositories.AdmissionTermRepo;
import com.sba301.group1.pes_be.repositories.ClassesRepo;
import com.sba301.group1.pes_be.repositories.LessonRepo;
import com.sba301.group1.pes_be.repositories.ParentRepo;
import com.sba301.group1.pes_be.repositories.ScheduleRepo;
import com.sba301.group1.pes_be.repositories.StudentRepo;
import com.sba301.group1.pes_be.repositories.SyllabusLessonRepo;
import com.sba301.group1.pes_be.repositories.SyllabusRepo;
import com.sba301.group1.pes_be.repositories.StudentClassRepo;
import com.sba301.group1.pes_be.models.StudentClass;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@SpringBootApplication
@RequiredArgsConstructor
public class PesBeApplication {

    private final AccountRepo accountRepo;

    private final SyllabusRepo syllabusRepo;

    private final LessonRepo lessonRepo;

    private final SyllabusLessonRepo syllabusLessonRepo;

    private final ClassesRepo classesRepo;

    private final ScheduleRepo scheduleRepo;

    private final ActivityRepo activityRepo;

    private final StudentClassRepo studentClassRepo;

    private final StudentRepo studentRepo;

    private final ParentRepo parentRepo;

    private final EntityManager entityManager;

    public static void main(String[] args) {
        SpringApplication.run(PesBeApplication.class, args);
    }

    private String generateRandomCCCD() {
        StringBuilder cccd = new StringBuilder();
        for (int k = 0; k < 12; k++) {
            cccd.append((int) (Math.random() * 10)); // sinh số từ 0–9
        }
        return cccd.toString();
    }

    private String generateRandomPhone() {
        String[] prefixList = {"09", "03", "07"};
        String prefix = prefixList[(int) (Math.random() * prefixList.length)];

        StringBuilder phone = new StringBuilder(prefix);
        for (int i = 0; i < 8; i++) {
            int digit = ((int) (Math.random() * 10)); // 0-9
            phone.append(digit); //used to append data to the end of the current string (not create new string)
        }
        return phone.toString();
    }

    @Bean
    public CommandLineRunner initSystemAccounts() {
        return args -> {
            // === Account 1: ADMISSION ===
            if (!accountRepo.existsByEmail("admission@gmail.com")) {
                Account admission = Account.builder()
                        .email("admission@gmail.com")
                        .password("admission@123")
                        .name("Ms. Admission")
                        .phone(generateRandomPhone())
                        .identityNumber(generateRandomCCCD())
                        .gender("female")
                        .role(Role.ADMISSION)
                        .status(Status.ACCOUNT_ACTIVE.getValue())
                        .createdAt(LocalDate.now())
                        .build();
                accountRepo.save(admission);
                System.out.println("Created account: admission@gmail.com (ADMISSION)");
            }

            // === Account 2: EDUCATION ===
            if (!accountRepo.existsByEmail("education@gmail.com")) {
                Account education = Account.builder()
                        .email("education@gmail.com")
                        .password("education@123")
                        .name("Mr. Education")
                        .phone(generateRandomPhone())
                        .identityNumber(generateRandomCCCD())
                        .gender("male")
                        .role(Role.EDUCATION)
                        .status(Status.ACCOUNT_ACTIVE.getValue())
                        .createdAt(LocalDate.now())
                        .build();
                accountRepo.save(education);
                System.out.println("Created account: education@gmail.com (EDUCATION)");
            }

            // === Account 3: HR ===
            if (!accountRepo.existsByEmail("hr@gmail.com")) {
                Account hr = Account.builder()
                        .email("hr@gmail.com")
                        .password("hr@123")
                        .name("Ms. HR")
                        .phone(generateRandomPhone())
                        .identityNumber(generateRandomCCCD())
                        .gender("female")
                        .role(Role.HR)
                        .status(Status.ACCOUNT_ACTIVE.getValue())
                        .createdAt(LocalDate.now())
                        .build();
                accountRepo.save(hr);
                System.out.println("Created account: hr@gmail.com (HR)");
            }
        };
    }

    @Bean
    public CommandLineRunner initEducationData() {
        return args -> {
            // Create teacher accounts first
            String[] teacherEmails = {
                    "teacher.seed@gmail.com",
                    "teacher.bud@gmail.com",
                    "teacher.leaf@gmail.com"
            };

            String[] teacherNames = {
                    "Ms. Sarah Johnson",
                    "Ms. Emily Chen",
                    "Mr. Michael Brown"
            };

            Account[] teachers = new Account[3];

            for (int i = 0; i < teacherEmails.length; i++) {
                if (!accountRepo.existsByEmail(teacherEmails[i])) {
                    teachers[i] = Account.builder()
                            .email(teacherEmails[i])
                            .password("teacher@123")
                            .role(Role.TEACHER)
                            .name(teacherNames[i])
                            .phone(generateRandomPhone())
                            .identityNumber(generateRandomCCCD())
                            .gender(i == 2 ? "male" : "female")
                            .status(Status.ACCOUNT_ACTIVE.getValue())
                            .createdAt(LocalDate.now())
                            .build();
                    teachers[i] = accountRepo.save(teachers[i]);
                    System.out.println("Created Teacher: " + teacherEmails[i]);
                } else {
                    teachers[i] = accountRepo.findByEmail(teacherEmails[i]).orElse(null);
                }
            }

            // Create sample syllabi for different grades
            String[] syllabusData = {
                    "SEED Curriculum|Foundational learning program for 3-year-olds focusing on basic motor skills, social interaction, and sensory exploration",
                    "BUD Curriculum|Intermediate learning program for 4-year-olds emphasizing language development, creative expression, and cognitive growth",
                    "LEAF Curriculum|Advanced preschool program for 5-year-olds preparing children for primary education with pre-literacy and numeracy skills"
            };

            Syllabus[] syllabi = new Syllabus[3];

            for (int i = 0; i < syllabusData.length; i++) {
                String[] parts = syllabusData[i].split("\\|");
                String title = parts[0];
                String description = parts[1];

                if (syllabusRepo.findByTitleContaining(title).isEmpty()) {
                    syllabi[i] = Syllabus.builder()
                            .title(title)
                            .description(description)
                            .build();
                    syllabi[i] = syllabusRepo.save(syllabi[i]);
                    System.out.println("Created Syllabus: " + title);
                } else {
                    syllabi[i] = syllabusRepo.findByTitleContaining(title).get(0);
                }
            }

            // Create sample lessons
            String[] lessonData = {
                    "Circle Time|Interactive group activity where children sit in a circle to share, sing songs, and learn basic concepts like days of the week and weather",
                    "Art & Craft|Creative expression through drawing, painting, cutting, and crafting to develop fine motor skills and imagination",
                    "Story Time|Reading and storytelling sessions to develop listening skills, vocabulary, and love for books",
                    "Music & Movement|Singing, dancing, and musical activities to enhance rhythm, coordination, and self-expression",
                    "Nature Exploration|Outdoor activities and nature walks to learn about plants, animals, and the environment",
                    "Building Blocks|Construction and building activities using blocks, puzzles, and manipulatives to develop spatial awareness and problem-solving",
                    "Dramatic Play|Role-playing and pretend play activities to develop social skills, creativity, and emotional expression",
                    "Number Fun|Basic counting, sorting, and pattern recognition activities appropriate for preschool age groups",
                    "Letter Recognition|Introduction to alphabet letters, sounds, and pre-writing activities",
                    "Sensory Play|Activities involving different textures, materials, and sensory experiences for cognitive development"
            };

            Lesson[] lessons = new Lesson[lessonData.length];

            for (int i = 0; i < lessonData.length; i++) {
                String[] parts = lessonData[i].split("\\|");
                String topic = parts[0];
                String description = parts[1];

                List<Lesson> found = lessonRepo.findByTopicContaining(topic);
                if (found.isEmpty()) {
                    lessons[i] = Lesson.builder()
                            .topic(topic)
                            .description(description)
                        .duration(30)
                        .materials("Basic materials")
                            .build();
                    lessons[i] = lessonRepo.save(lessons[i]);
                    System.out.println("Created Lesson: " + topic);
                } else {
                    lessons[i] = found.get(0);
                }
            }

            // Create SyllabusLesson relationships
            // SEED curriculum (ages 3) - basic activities
            int[] seedLessons = {0, 1, 2, 3, 4, 9}; // Circle Time, Art & Craft, Story Time, Music & Movement, Nature Exploration, Sensory Play
            for (int lessonIndex : seedLessons) {
                if (!syllabusLessonRepo.existsBySyllabusIdAndLessonId(syllabi[0].getId(), lessons[lessonIndex].getId())) {
                    SyllabusLesson syllabusLesson = SyllabusLesson.builder()
                            .syllabus(syllabi[0])
                            .lesson(lessons[lessonIndex])
                            .note("Adapted for 3-year-old developmental needs")
                            .build();
                    syllabusLessonRepo.save(syllabusLesson);
                }
            }

            // BUD curriculum (ages 4) - intermediate activities
            int[] budLessons = {0, 1, 2, 3, 4, 5, 6, 7}; // All except Letter Recognition and one other
            for (int lessonIndex : budLessons) {
                if (!syllabusLessonRepo.existsBySyllabusIdAndLessonId(syllabi[1].getId(), lessons[lessonIndex].getId())) {
                    SyllabusLesson syllabusLesson = SyllabusLesson.builder()
                            .syllabus(syllabi[1])
                            .lesson(lessons[lessonIndex])
                            .note("Designed for 4-year-old learning objectives")
                            .build();
                    syllabusLessonRepo.save(syllabusLesson);
                }
            }

            // LEAF curriculum (ages 5) - all activities including pre-academic
            for (int i = 0; i < lessons.length; i++) {
                if (!syllabusLessonRepo.existsBySyllabusIdAndLessonId(syllabi[2].getId(), lessons[i].getId())) {
                    SyllabusLesson syllabusLesson = SyllabusLesson.builder()
                            .syllabus(syllabi[2])
                            .lesson(lessons[i])
                            .note("Comprehensive program for school readiness")
                            .build();
                    syllabusLessonRepo.save(syllabusLesson);
                }
            }

            System.out.println("Created SyllabusLesson relationships");

            // Create sample classes for each grade
            String[] classNames = {"Sunshine Seeds", "Growing Buds", "Learning Leaves"};
            Grade[] grades = {Grade.SEED, Grade.BUD, Grade.LEAF};
            String[] roomNumbers = {"Room A1", "Room B2", "Room C3"};

            for (int i = 0; i < 3; i++) {
                if (classesRepo.findByNameContaining(classNames[i]).isEmpty()) {
                    Classes newClass = Classes.builder()
                            .name(classNames[i])
                            .numberStudent(0) // Initially empty, students will be assigned later
                            .roomNumber(roomNumbers[i])
                            .startDate("2025-09-01")
                            .endDate("2026-06-30")
                            .status("ACTIVE")
                            .grade(grades[i])
                            .syllabus(syllabi[i])
                            .teacher(teachers[i])
                            .build();
                    classesRepo.save(newClass);
                    System.out.println("Created Class: " + classNames[i] + " for " + grades[i] + " grade");
                }
            }

            System.out.println("Education data initialization completed successfully!");
        };
    }

    @Bean
    public CommandLineRunner initSchedulesAndActivities() {
        return args -> {
            // Get all classes to create schedules for
            var allClasses = classesRepo.findAll();

            if (allClasses.isEmpty()) {
                System.out.println("No classes found, skipping schedule and activity initialization");
                return;
            }

            // Get all lessons for creating activities
            var allLessons = lessonRepo.findAll();

            for (Classes classEntity : allClasses) {
                // Create schedules for 4 weeks for each class
                for (int week = 1; week <= 4; week++) {
                    // Check if schedule already exists for this class and week
                    if (scheduleRepo.findByClassesIdAndWeekNumber(classEntity.getId(), week).isEmpty()) {
                        Schedule schedule = Schedule.builder()
                                .weekNumber(week)
                                .note("Week " + week + " schedule for " + classEntity.getName())
                                .classes(classEntity)
                                .build();
                        schedule = scheduleRepo.save(schedule);
                        System.out.println("Created Schedule for " + classEntity.getName() + " - Week " + week);

                        // Create activities for each day of the week
                        String[] daysOfWeek = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
                        String[] timeSlots = {"08:00", "09:30", "10:30", "14:00", "15:30"};
                        String[] endTimes = {"09:00", "10:30", "11:30", "15:00", "16:30"};

                        for (int day = 0; day < daysOfWeek.length; day++) {
                            // Create 2-3 activities per day
                            int activitiesPerDay = 2 + (int) (Math.random() * 2); // 2 or 3 activities

                            for (int activityIndex = 0; activityIndex < activitiesPerDay && activityIndex < timeSlots.length; activityIndex++) {
                                // Select a random lesson from available lessons
                                Lesson selectedLesson = allLessons.get((int) (Math.random() * allLessons.size()));

                                // Create activity topic based on lesson and day
                                String activityTopic = selectedLesson.getTopic() + " - " + daysOfWeek[day];

                                Activity activity = Activity.builder()
                                        .topic(activityTopic)
                                        .description("Engaging " + selectedLesson.getTopic().toLowerCase() + " session for " + classEntity.getGrade() + " students")
                                        .dayOfWeek(daysOfWeek[day])
                                        .startTime(timeSlots[activityIndex])
                                        .endTime(endTimes[activityIndex])
                                        .schedule(schedule)
                                        .lesson(selectedLesson)
                                        .build();
                                activityRepo.save(activity);
                            }
                        }
                        System.out.println("Created activities for " + classEntity.getName() + " - Week " + week);
                    }
                }
            }

            System.out.println("Schedules and Activities initialization completed successfully!");
        };
    }

    @Bean
    @Transactional
    public CommandLineRunner assignStudentsToClasses() {
        return args -> {
            // Get all students and classes
            var allStudents = studentRepo.findAll();
            var allClasses = classesRepo.findAll();

            if (allStudents.isEmpty() || allClasses.isEmpty()) {
                System.out.println("No students or classes found, skipping student assignment");
                return;
            }

            // Check if students are already assigned to classes
            if (!studentClassRepo.findAll().isEmpty()) {
                System.out.println("Students already assigned to classes, skipping assignment");
                return;
            }

            // Assign students to classes based on age/grade
            for (Student student : allStudents) {
                // Calculate age and determine appropriate grade
                int age = LocalDate.now().getYear() - student.getDateOfBirth().getYear();
                Grade appropriateGrade;
                
                if (age <= 3) {
                    appropriateGrade = Grade.SEED;
                } else if (age == 4) {
                    appropriateGrade = Grade.BUD;
                } else {
                    appropriateGrade = Grade.LEAF;
                }

                // Find a class with the appropriate grade that has space
                Classes targetClass = allClasses.stream()
                    .filter(cls -> cls.getGrade() == appropriateGrade)
                    .filter(cls -> cls.getNumberStudent() < 15) // Assuming max 15 students per class
                    .findFirst()
                    .orElse(null);

                if (targetClass != null) {
                    // Create StudentClass relationship
                    StudentClass studentClass = StudentClass.builder()
                            .student(student)
                            .classes(targetClass)
                            .build();
                    studentClassRepo.save(studentClass);

                    // Update student status to active student
                    student.setStudent(true);
                    studentRepo.save(student);

                    // Update class student count
                    targetClass.setNumberStudent(targetClass.getNumberStudent() + 1);
                    classesRepo.save(targetClass);

                    System.out.println("Assigned student " + student.getName() + " (age " + age + ") to class " + targetClass.getName());
                } else {
                    System.out.println("No available class found for student " + student.getName() + " with grade " + appropriateGrade);
                }
            }

            System.out.println("Student assignment completed successfully!");
        };
    }
}