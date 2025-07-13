-- Insert data into the account table
INSERT INTO account (id, email, password, role, status, created_at, name, phone, gender, identity_number) VALUES
(1, 'admin@pes.com', '123', 'ADMIN', 'ACTIVE', '2025-07-13', 'Admin User', '1234567890', 'Male', 'ID123456'),
(2, 'admission@pes.com', '123', 'ADMISSION_MANAGER', 'ACTIVE', '2025-07-13', 'Admission Manager', '1234567891', 'Female', 'ID123457'),
(3, 'hr@pes.com', '123', 'HR_MANAGER', 'ACTIVE', '2025-07-13', 'HR Manager', '1234567892', 'Male', 'ID123458'),
(4, 'education@pes.com', '123', 'EDUCATION_MANAGER', 'ACTIVE', '2025-07-13', 'Education Manager', '1234567893', 'Female', 'ID123459'),
(5, 'teacher1@pes.com', '123', 'TEACHER', 'ACTIVE', '2025-07-13', 'Teacher One', '1234567894', 'Male', 'ID123460'),
(6, 'teacher2@pes.com', '123', 'TEACHER', 'ACTIVE', '2025-07-13', 'Teacher Two', '1234567895', 'Female', 'ID123461'),
(7, 'parent1@pes.com', '123', 'PARENT', 'ACTIVE', '2025-07-13', 'Parent One', '1234567896', 'Male', 'ID123462'),
(8, 'parent2@pes.com', '123', 'PARENT', 'ACTIVE', '2025-07-13', 'Parent Two', '1234567897', 'Female', 'ID123463');

-- Insert data into the parent table
INSERT INTO parent (id, address, job, relationship_to_child, day_of_birth, account_id) VALUES
(1, '123 Main St', 'Engineer', 'Father', '1980-01-15', 7),
(2, '456 Oak Ave', 'Doctor', 'Mother', '1982-05-20', 8);

-- Insert data into the student table
INSERT INTO student (id, name, gender, date_of_birth, place_of_birth, modified_date, profile_image, birth_certificate_img, household_registration_img, update_count, is_student, parent_id) VALUES
(1, 'Student One', 'Male', '2020-01-01', 'City A', '2025-07-13', 'https://picsum.photos/seed/profile1/200/300', 'https://picsum.photos/seed/bc1/200/300', 'https://picsum.photos/seed/hr1/200/300', 0, true, 1),
(2, 'Student Two', 'Female', '2020-02-01', 'City B', '2025-07-13', 'https://picsum.photos/seed/profile2/200/300', 'https://picsum.photos/seed/bc2/200/300', 'https://picsum.photos/seed/hr2/200/300', 0, true, 2);

-- Insert data into the syllabus table
INSERT INTO syllabus (id, title, description) VALUES
(1, 'Preschool Syllabus 2025', 'Syllabus for preschool students for the year 2025.'),
(2, 'Kindergarten Syllabus 2025', 'Syllabus for kindergarten students for the year 2025.');

-- Insert data into the lesson table
INSERT INTO lesson (id, topic, description, duration, materials) VALUES
(1, 'Introduction to Alphabets', 'Learning the ABCs.', 60, 'Flashcards, Books'),
(2, 'Basic Numbers', 'Learning numbers 1-10.', 60, 'Blocks, Worksheets'),
(3, 'Colors and Shapes', 'Identifying colors and shapes.', 60, 'Crayons, Paper'),
(4, 'Story Time', 'Reading and listening to stories.', 60, 'Storybooks');

-- Insert data into the syllabus_lesson table
INSERT INTO syllabus_lesson (id, note, syllabus_id, lesson_id) VALUES
(1, 'First week', 1, 1),
(2, 'Second week', 1, 2),
(3, 'First week', 2, 3),
(4, 'Second week', 2, 4);

-- Insert data into the classes table
INSERT INTO classes (id, name, number_student, room_number, start_date, end_date, status, grade, syllabus_id, teacher_id) VALUES
(1, 'Preschool Class A', 20, '101', '2025-09-01', '2026-06-30', 'ACTIVE', 'PRESCHOOL', 1, 5),
(2, 'Kindergarten Class B', 25, '102', '2025-09-01', '2026-06-30', 'ACTIVE', 'KINDERGARTEN', 2, 6);

-- Insert data into the student_class table
INSERT INTO student_class (id, student_id, classes_id) VALUES
(1, 1, 1),
(2, 2, 2);

-- Insert data into the schedule table
INSERT INTO schedule (id, week_number, note, classes_id) VALUES
(1, 1, 'First week of school', 1),
(2, 1, 'First week of school', 2);

-- Insert data into the activity table
INSERT INTO activity (id, topic, description, day_of_week, start_time, end_time, schedule_id, lesson_id) VALUES
(1, 'Alphabet Fun', 'Learning letters A-E', 'MONDAY', '09:00', '10:00', 1, 1),
(2, 'Number Play', 'Counting 1-5', 'TUESDAY', '09:00', '10:00', 1, 2),
(3, 'Colorful World', 'Learning about red and blue', 'MONDAY', '09:00', '10:00', 2, 3),
(4, 'Fairy Tales', 'Reading Cinderella', 'TUESDAY', '09:00', '10:00', 2, 4);

-- Insert data into the admission_term table
INSERT INTO admission_term (id, name, start_date, end_date, year, max_number_registration, grade, status, parent_term_id) VALUES
(1, 'Preschool Admission 2025', '2025-01-01 00:00:00', '2025-03-31 23:59:59', 2025, 50, 'PRESCHOOL', 'OPEN', NULL),
(2, 'Kindergarten Admission 2025', '2025-01-01 00:00:00', '2025-03-31 23:59:59', 2025, 60, 'KINDERGARTEN', 'OPEN', NULL);

-- Insert data into the admission_form table
INSERT INTO admission_form (id, household_registration_address, birth_certificate_img, household_registration_img, child_characteristics_form_img, commitment_img, cancel_reason, submitted_date, note, status, parent_id, student_id, admission_term_id) VALUES
(1, '123 Main St', 'https://picsum.photos/seed/bc1/200/300', 'https://picsum.photos/seed/hr1/200/300', 'https://picsum.photos/seed/ccf1/200/300', 'https://picsum.photos/seed/c1/200/300', NULL, '2025-02-15', 'First time applicant', 'PENDING', 1, 1, 1),
(2, '456 Oak Ave', 'https://picsum.photos/seed/bc2/200/300', 'https://picsum.photos/seed/hr2/200/300', 'https://picsum.photos/seed/ccf2/200/300', 'https://picsum.photos/seed/c2/200/300', NULL, '2025-02-20', 'Sibling already in school', 'PENDING', 2, 2, 2);