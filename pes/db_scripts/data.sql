USE pes_sba;

SET QUOTED_IDENTIFIER ON;
-- Insert data into the account table
SET IDENTITY_INSERT account ON;
INSERT INTO account (account_id, email, password, role, status, created_at, name, phone, gender, identity_number) VALUES
(1, 'admin@pes.com', '123', 'EDUCATION', 'ACCOUNT_ACTIVE', '2025-07-13', 'Admin User', '1234567890', 'Male', 'ID123456'),
(2, 'admission@pes.com', '123', 'ADMISSION', 'ACCOUNT_ACTIVE', '2025-07-13', 'Admission Manager', '1234567891', 'Female', 'ID123457'),
(3, 'hr@pes.com', '123', 'HR', 'ACCOUNT_ACTIVE', '2025-07-13', 'HR Manager', '1234567892', 'Male', 'ID123458'),
(4, 'education@pes.com', '123', 'EDUCATION', 'ACCOUNT_ACTIVE', '2025-07-13', 'Education Manager', '1234567893', 'Female', 'ID123459'),
(5, 'teacher1@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Nguyen Van A', '1234567894', 'Male', 'ID123460'),
(6, 'teacher2@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Tran Thi B', '1234567895', 'Female', 'ID123461'),
(9, 'teacher3@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Le Van C', '1234567896', 'Male', 'ID123462'),
(7, 'parent1@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Pham Van D', '1234567896', 'Male', 'ID123462'),
(8, 'parent2@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Hoang Thi E', '1234567897', 'Female', 'ID123463'),
(10, 'teacher4@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Do Thi F', '1234567898', 'Female', 'ID123464'),
(11, 'teacher5@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Vu Van G', '1234567899', 'Male', 'ID123465'),
(12, 'teacher6@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Dang Thi H', '1234567900', 'Female', 'ID123466'),
(13, 'teacher7@pes.com', '123', 'TEACHER', 'ACCOUNT_ACTIVE', '2025-07-13', 'Ngo Van I', '1234567901', 'Male', 'ID123467'),
(14, 'parent3@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Bui Van K', '1234567902', 'Male', 'ID123468'),
(15, 'parent4@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Dinh Thi L', '1234567903', 'Female', 'ID123469'),
(16, 'parent5@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Ly Van M', '1234567904', 'Male', 'ID123470'),
(17, 'parent6@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Duong Thi N', '1234567905', 'Female', 'ID123471'),
(18, 'parent7@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Trinh Van O', '1234567906', 'Male', 'ID123472'),
(19, 'parent8@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Mai Thi P', '1234567907', 'Female', 'ID123473'),
(20, 'parent9@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Phan Van Q', '1234567908', 'Male', 'ID123474'),
(21, 'parent10@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Truong Thi R', '1234567909', 'Female', 'ID123475'),
(22, 'parent11@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Lam Van S', '1234567910', 'Male', 'ID123476'),
(23, 'parent12@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Giang Thi T', '1234567911', 'Female', 'ID123477'),
(24, 'parent13@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Duong Van U', '1234567912', 'Male', 'ID123478'),
(25, 'parent14@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Cao Thi V', '1234567913', 'Female', 'ID123479'),
(26, 'parent15@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'To Van X', '1234567914', 'Male', 'ID123480'),
(27, 'parent16@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Luu Thi Y', '1234567915', 'Female', 'ID123481'),
(28, 'parent17@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Han Van Z', '1234567916', 'Male', 'ID123482'),
(29, 'parent18@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Mac Thi A', '1234567917', 'Female', 'ID123483'),
(30, 'parent19@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Dam Van B', '1234567918', 'Male', 'ID123484'),
(31, 'parent20@pes.com', '123', 'PARENT', 'ACCOUNT_ACTIVE', '2025-07-13', 'Vo Thi C', '1234567919', 'Female', 'ID123485');
SET IDENTITY_INSERT account OFF;

-- Insert data into the parent table
SET IDENTITY_INSERT parent ON;
INSERT INTO parent (parent_id, address, job, relationship_to_child, day_of_birth, account_id) VALUES
(1, '123 Main St', 'Engineer', 'Father', '1980-01-15', 7),
(2, '456 Oak Ave', 'Doctor', 'Mother', '1982-05-20', 8),
(3, '789 Pine St', 'Lawyer', 'Father', '1985-03-10', 14),
(4, '101 Maple Dr', 'Teacher', 'Mother', '1988-07-22', 15),
(5, '212 Birch Ln', 'Artist', 'Father', '1981-11-05', 16),
(6, '333 Cedar Rd', 'Chef', 'Mother', '1990-02-14', 17),
(7, '444 Elm Ct', 'Pilot', 'Father', '1979-09-30', 18),
(8, '555 Spruce Way', 'Writer', 'Mother', '1983-06-18', 19),
(9, '666 Willow Ave', 'Musician', 'Father', '1986-04-25', 20),
(10, '777 Aspen St', 'Dancer', 'Mother', '1989-12-12', 21),
(11, '888 Redwood Pkwy', 'Scientist', 'Father', '1984-08-08', 22),
(12, '999 Sequoia Blvd', 'Architect', 'Mother', '1987-10-01', 23),
(13, '111 Pine St', 'Engineer', 'Father', '1980-01-15', 24),
(14, '222 Oak Ave', 'Doctor', 'Mother', '1982-05-20', 25),
(15, '333 Maple Dr', 'Lawyer', 'Father', '1985-03-10', 26),
(16, '444 Birch Ln', 'Teacher', 'Mother', '1988-07-22', 27),
(17, '555 Cedar Rd', 'Artist', 'Father', '1981-11-05', 28),
(18, '666 Elm Ct', 'Chef', 'Mother', '1990-02-14', 29),
(19, '777 Spruce Way', 'Pilot', 'Father', '1979-09-30', 30),
(20, '888 Willow Ave', 'Writer', 'Mother', '1983-06-18', 31);
SET IDENTITY_INSERT parent OFF;

-- Insert data into the student table
SET IDENTITY_INSERT student ON;
INSERT INTO student (student_id, name, gender, date_of_birth, place_of_birth, modified_date, profile_image, birth_certificate_img, household_registration_img, update_count, is_student, parent_id) VALUES
(1, 'Nguyen Hoai An', 'Male', '2020-01-01', 'City A', '2025-07-13', 'https://picsum.photos/seed/profile1/200/300', 'https://picsum.photos/seed/bc1/200/300', 'https://picsum.photos/seed/hr1/200/300', 0, 1, 1),
(2, 'Tran My Binh', 'Female', '2020-02-01', 'City B', '2025-07-13', 'https://picsum.photos/seed/profile2/200/300', 'https://picsum.photos/seed/bc2/200/300', 'https://picsum.photos/seed/hr2/200/300', 0, 1, 2),
(3, 'Le Hoang C', 'Male', '2020-03-01', 'City C', '2025-07-13', 'https://picsum.photos/seed/profile3/200/300', 'https://picsum.photos/seed/bc3/200/300', 'https://picsum.photos/seed/hr3/200/300', 0, 1, 3),
(4, 'Pham Gia D', 'Female', '2020-04-01', 'City D', '2025-07-13', 'https://picsum.photos/seed/profile4/200/300', 'https://picsum.photos/seed/bc4/200/300', 'https://picsum.photos/seed/hr4/200/300', 0, 1, 4),
(5, 'Vo Thanh E', 'Male', '2020-05-01', 'City E', '2025-07-13', 'https://picsum.photos/seed/profile5/200/300', 'https://picsum.photos/seed/bc5/200/300', 'https://picsum.photos/seed/hr5/200/300', 0, 1, 5),
(6, 'Hoang Ngoc F', 'Female', '2020-06-01', 'City F', '2025-07-13', 'https://picsum.photos/seed/profile6/200/300', 'https://picsum.photos/seed/bc6/200/300', 'https://picsum.photos/seed/hr6/200/300', 0, 1, 6),
(7, 'Doan Huu G', 'Male', '2020-07-01', 'City G', '2025-07-13', 'https://picsum.photos/seed/profile7/200/300', 'https://picsum.photos/seed/bc7/200/300', 'https://picsum.photos/seed/hr7/200/300', 0, 1, 7),
(8, 'Bui Thuy H', 'Female', '2020-08-01', 'City H', '2025-07-13', 'https://picsum.photos/seed/profile8/200/300', 'https://picsum.photos/seed/bc8/200/300', 'https://picsum.photos/seed/hr8/200/300', 0, 1, 8),
(9, 'Dang Minh I', 'Male', '2020-09-01', 'City I', '2025-07-13', 'https://picsum.photos/seed/profile9/200/300', 'https://picsum.photos/seed/bc9/200/300', 'https://picsum.photos/seed/hr9/200/300', 0, 1, 9),
(10, 'Ngo Bao K', 'Female', '2020-10-01', 'City J', '2025-07-13', 'https://picsum.photos/seed/profile10/200/300', 'https://picsum.photos/seed/bc10/200/300', 'https://picsum.photos/seed/hr10/200/300', 0, 1, 10),
(11, 'Duong Van L', 'Male', '2020-11-01', 'City K', '2025-07-13', 'https://picsum.photos/seed/profile11/200/300', 'https://picsum.photos/seed/bc11/200/300', 'https://picsum.photos/seed/hr11/200/300', 0, 1, 11),
(12, 'Ly My M', 'Female', '2020-12-01', 'City L', '2025-07-13', 'https://picsum.photos/seed/profile12/200/300', 'https://picsum.photos/seed/bc12/200/300', 'https://picsum.photos/seed/hr12/200/300', 0, 1, 12),
(13, 'Trinh Hoai N', 'Male', '2021-01-01', 'City M', '2025-07-13', 'https://picsum.photos/seed/profile13/200/300', 'https://picsum.photos/seed/bc13/200/300', 'https://picsum.photos/seed/hr13/200/300', 0, 1, 13),
(14, 'Mai Ngoc O', 'Female', '2021-02-01', 'City N', '2025-07-13', 'https://picsum.photos/seed/profile14/200/300', 'https://picsum.photos/seed/bc14/200/300', 'https://picsum.photos/seed/hr14/200/300', 0, 1, 14),
(15, 'Phan Thanh P', 'Male', '2021-03-01', 'City O', '2025-07-13', 'https://picsum.photos/seed/profile15/200/300', 'https://picsum.photos/seed/bc15/200/300', 'https://picsum.photos/seed/hr15/200/300', 0, 1, 15),
(16, 'Truong Gia Q', 'Female', '2021-04-01', 'City P', '2025-07-13', 'https://picsum.photos/seed/profile16/200/300', 'https://picsum.photos/seed/bc16/200/300', 'https://picsum.photos/seed/hr16/200/300', 0, 1, 16),
(17, 'Lam Thuy R', 'Male', '2021-05-01', 'City Q', '2025-07-13', 'https://picsum.photos/seed/profile17/200/300', 'https://picsum.photos/seed/bc17/200/300', 'https://picsum.photos/seed/hr17/200/300', 0, 1, 17),
(18, 'Giang My S', 'Female', '2021-06-01', 'City R', '2025-07-13', 'https://picsum.photos/seed/profile18/200/300', 'https://picsum.photos/seed/bc18/200/300', 'https://picsum.photos/seed/hr18/200/300', 0, 1, 18),
(19, 'Duong Hoang T', 'Male', '2021-07-01', 'City S', '2025-07-13', 'https://picsum.photos/seed/profile19/200/300', 'https://picsum.photos/seed/bc19/200/300', 'https://picsum.photos/seed/hr19/200/300', 0, 1, 19),
(20, 'Cao Bao U', 'Female', '2021-08-01', 'City T', '2025-07-13', 'https://picsum.photos/seed/profile20/200/300', 'https://picsum.photos/seed/bc20/200/300', 'https://picsum.photos/seed/hr20/200/300', 0, 1, 20);
SET IDENTITY_INSERT student OFF;

-- Insert data into the syllabus table
SET IDENTITY_INSERT syllabus ON;
INSERT INTO syllabus (syllabus_id, title, description) VALUES
(1, 'Preschool Syllabus 2025', 'Syllabus for preschool students for the year 2025.'),
(2, 'Kindergarten Syllabus 2025', 'Syllabus for kindergarten students for the year 2025.');
SET IDENTITY_INSERT syllabus OFF;

-- Insert data into the lesson table
SET IDENTITY_INSERT lesson ON;
INSERT INTO lesson (lesson_id, topic, description, duration, materials) VALUES
(1, 'Introduction to Alphabets', 'Learning the ABCs.', 60, 'Flashcards, Books'),
(2, 'Basic Numbers', 'Learning numbers 1-10.', 60, 'Blocks, Worksheets'),
(3, 'Colors and Shapes', 'Identifying colors and shapes.', 60, 'Crayons, Paper'),
(4, 'Story Time', 'Reading and listening to stories.', 60, 'Storybooks');
SET IDENTITY_INSERT lesson OFF;

-- Insert data into the syllabus_lesson table
SET IDENTITY_INSERT syllabus_lesson ON;
INSERT INTO syllabus_lesson (syllabus_lesson_id, note, syllabus_id, lesson_id) VALUES
(1, 'First week', 1, 1),
(2, 'Second week', 1, 2),
(3, 'First week', 2, 3),
(4, 'Second week', 2, 4);
SET IDENTITY_INSERT syllabus_lesson OFF;

-- Insert data into the classes table
SET IDENTITY_INSERT classes ON;
INSERT INTO classes (classes_id, name, number_student, room_number, start_date, end_date, status, grade, syllabus_id, teacher_id)VALUES
(1, 'Preschool Class A', 20, '11', '2025-09-01', '2026-06-30', 'ACTIVE', 'SEED', 1, 5),
(2, 'Kindergarten Class B', 25, '12', '2025-09-01', '2026-06-30', 'ACTIVE', 'BUD', 2, 6);
SET IDENTITY_INSERT classes OFF;

-- Insert data into the student_class table
SET IDENTITY_INSERT student_class ON;
INSERT INTO student_class (student_class_id, student_id, classes_id) VALUES
(1, 1, 1),
(2, 2, 2);
SET IDENTITY_INSERT student_class OFF;

-- Insert data into the schedule table
SET IDENTITY_INSERT schedule ON;
INSERT INTO schedule (schedule_id, week_number, note, classes_id) VALUES
(1, 1, 'First week of school', 1),
(2, 1, 'First week of school', 2),
(3, 2, 'Second week of school', 1),
(4, 2, 'Second week of school', 2);
SET IDENTITY_INSERT schedule OFF;

-- Insert data into the activity table
SET IDENTITY_INSERT activity ON;
INSERT INTO activity (activity_id, topic, description, day_of_week, start_time, end_time, schedule_id, lesson_id) VALUES
(1, 'Alphabet Fun', 'Learning letters A-E', 'MONDAY', '08:00', '09:30', 1, 1),
(2, 'Number Play', 'Counting 1-5', 'TUESDAY', '08:00', '09:30', 1, 2),
(3, 'Colorful World', 'Learning about red and blue', 'MONDAY', '08:00', '09:30', 2, 3),
(4, 'Fairy Tales', 'Reading Cinderella', 'TUESDAY', '08:00', '09:30', 2, 4),
(5, 'Story Time', 'Reading and listening to stories', 'WEDNESDAY', '08:00', '09:30', 1, 4),
(6, 'Alphabet Fun', 'Learning letters F-J', 'WEDNESDAY', '09:30', '11:00', 1, 1),
(7, 'Number Play', 'Counting 6-10', 'THURSDAY', '08:00', '09:30', 1, 2),
(8, 'Colors and Shapes', 'Identifying green and yellow', 'THURSDAY', '09:30', '11:00', 1, 3),
(9, 'Story Time', 'Reading The Little Mermaid', 'FRIDAY', '08:00', '09:30', 1, 4),
(10, 'Alphabet Fun', 'Reviewing A-J', 'FRIDAY', '09:30', '11:00', 1, 1),
(11, 'Fairy Tales', 'Reading Snow White', 'WEDNESDAY', '08:00', '09:30', 2, 4),
(12, 'Colorful World', 'Learning about orange and purple', 'WEDNESDAY', '09:30', '11:00', 2, 3),
(13, 'Number Play', 'Advanced counting', 'THURSDAY', '08:00', '09:30', 2, 2),
(14, 'Alphabet Fun', 'Advanced alphabets', 'THURSDAY', '09:30', '11:00', 2, 1),
(15, 'Fairy Tales', 'Reading Rapunzel', 'FRIDAY', '08:00', '09:30', 2, 4),
(16, 'Colorful World', 'Mixing colors', 'FRIDAY', '09:30', '11:00', 2, 3),
(17, 'Alphabet Fun', 'Learning letters K-O', 'MONDAY', '13:00', '14:30', 3, 1),
(18, 'Number Play', 'Counting 11-15', 'MONDAY', '14:30', '16:00', 3, 2),
(19, 'Colors and Shapes', 'Identifying triangles and squares', 'TUESDAY', '13:00', '14:30', 3, 3),
(20, 'Story Time', 'Reading The Ugly Duckling', 'TUESDAY', '14:30', '16:00', 3, 4),
(21, 'Alphabet Fun', 'Learning letters P-T', 'WEDNESDAY', '13:00', '14:30', 3, 1),
(22, 'Number Play', 'Counting 16-20', 'WEDNESDAY', '14:30', '16:00', 3, 2),
(23, 'Colors and Shapes', 'Identifying circles and rectangles', 'THURSDAY', '13:00', '14:30', 3, 3),
(24, 'Story Time', 'Reading Jack and the Beanstalk', 'THURSDAY', '14:30', '16:00', 3, 4),
(25, 'Alphabet Fun', 'Reviewing K-T', 'FRIDAY', '13:00', '14:30', 3, 1),
(26, 'Number Play', 'Reviewing 11-20', 'FRIDAY', '14:30', '16:00', 3, 2),
(27, 'Colorful World', 'Learning about pink and brown', 'MONDAY', '13:00', '14:30', 4, 3),
(28, 'Fairy Tales', 'Reading Hansel and Gretel', 'MONDAY', '14:30', '16:00', 4, 4),
(29, 'Alphabet Fun', 'Writing letters', 'TUESDAY', '13:00', '14:30', 4, 1),
(30, 'Number Play', 'Simple addition', 'TUESDAY', '14:30', '16:00', 4, 2),
(31, 'Colorful World', 'Crafting with colors', 'WEDNESDAY', '13:00', '14:30', 4, 3),
(32, 'Fairy Tales', 'Reading The Three Little Pigs', 'WEDNESDAY', '14:30', '16:00', 4, 4),
(33, 'Alphabet Fun', 'Phonics practice', 'THURSDAY', '13:00', '14:30', 4, 1),
(34, 'Number Play', 'Simple subtraction', 'THURSDAY', '14:30', '16:00', 4, 2),
(35, 'Colorful World', 'Painting', 'FRIDAY', '13:00', '14:30', 4, 3),
(36, 'Fairy Tales', 'Puppet show', 'FRIDAY', '14:30', '16:00', 4, 4);
SET IDENTITY_INSERT activity OFF;

-- Insert data into the admission_term table
SET IDENTITY_INSERT admission_term ON;
INSERT INTO admission_term (admission_term_id, name, start_date, end_date, year, max_number_registration, grade, status, parent_term_id) VALUES
(1, 'Preschool Admission 2025', '2025-01-01 00:00:00', '2025-03-31 23:59:59', 2025, 50, 'SEED', 'ACTIVE_TERM', NULL),
(2, 'Kindergarten Admission 2025', '2025-01-01 00:00:00', '2025-03-31 23:59:59', 2025, 60, 'BUD', 'ACTIVE_TERM', NULL);
SET IDENTITY_INSERT admission_term OFF;

-- Insert data into the admission_form table
SET IDENTITY_INSERT admission_form ON;
INSERT INTO admission_form (admission_form_id, household_registration_address, child_characteristics_form_img, commitment_img, cancel_reason, submitted_date, note, status, parent_id, student_id, admission_term_id) VALUES
(1, '123 Main St', 'https://picsum.photos/seed/ccf1/200/300', 'https://picsum.photos/seed/c1/200/300', NULL, '2025-02-15', 'First time applicant', 'PENDING_APPROVAL', 1, 1, 1),
(2, '456 Oak Ave', 'https://picsum.photos/seed/ccf2/200/300', 'https://picsum.photos/seed/c2/200/300', NULL, '2025-02-20', 'Sibling already in school', 'PENDING_APPROVAL', 2, 2, 2);
SET IDENTITY_INSERT admission_form OFF;