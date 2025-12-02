-- Seed Data for Hechun Learning System
-- NOTE: This script will delete existing 'Greetings' and 'Numbers 1-5' lessons to ensure a clean update.

-- 1. Clean up existing seed data (Cascades to steps)
DELETE FROM learning_lessons WHERE title IN ('Greetings', 'Numbers 1-5');
DELETE FROM badges WHERE name IN ('Beginner Scholar', 'Amateur Linguist', 'Intermediate Master', 'Advanced Speaker');

-- 2. Create Badges
INSERT INTO badges (name, description, icon_url, criteria) VALUES
('Beginner Scholar', 'Completed the Beginner Level', '🥉', '{"type": "level_complete", "level_id": 1}'),
('Amateur Linguist', 'Completed the Amateur Level', '🥈', '{"type": "level_complete", "level_id": 2}'),
('Intermediate Master', 'Completed the Intermediate Level', '🥇', '{"type": "level_complete", "level_id": 3}'),
('Advanced Speaker', 'Completed the Advanced Level', '🏆', '{"type": "level_complete", "level_id": 4}');

-- 3. Create Lessons for Level 1 (Beginner)
-- Lesson 1: Greetings
INSERT INTO learning_lessons (level_id, title, description, lesson_order) VALUES
(1, 'Greetings', 'Learn how to say hello and goodbye.', 1);

-- Steps for Lesson 1
-- Teach
INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'teach', 1, '{"title": "Hello in Kashmiri", "text": "The most common way to say hello is:", "kashmiri": "Assalaamu Alaykum", "transliteration": "Assalaamu Alaykum", "audio": "hello.mp3"}'
FROM learning_lessons WHERE title = 'Greetings';

-- Easy Quiz (5 Questions)
INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_easy', 2, '{"question": "How do you say Hello?", "options": ["Assalaamu Alaykum", "Khuda Hafiz", "Shukriya"], "correct_answer": "Assalaamu Alaykum", "transliteration": "Assalaamu Alaykum"}'
FROM learning_lessons WHERE title = 'Greetings';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_easy', 3, '{"question": "What does Assalaamu Alaykum mean?", "options": ["Peace be upon you", "Good morning", "Goodbye"], "correct_answer": "Peace be upon you", "transliteration": "Assalaamu Alaykum"}'
FROM learning_lessons WHERE title = 'Greetings';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_easy', 4, '{"question": "Is Assalaamu Alaykum formal?", "options": ["Yes", "No", "Only for elders"], "correct_answer": "Yes", "transliteration": "Assalaamu Alaykum"}'
FROM learning_lessons WHERE title = 'Greetings';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_easy', 5, '{"question": "Response to Hello?", "options": ["Walaikum Assalaam", "Hello", "Hi"], "correct_answer": "Walaikum Assalaam", "transliteration": "Walaikum Assalaam"}'
FROM learning_lessons WHERE title = 'Greetings';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_easy', 6, '{"question": "Saying Goodbye?", "options": ["Khuda Hafiz", "Salam", "Bye"], "correct_answer": "Khuda Hafiz", "transliteration": "Khuda Hafiz"}'
FROM learning_lessons WHERE title = 'Greetings';

-- Hard Quiz (10 Questions - shortened for seed, adding 3 for demo)
INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_hard', 7, '{"question": "Translate: Peace be upon you", "options": ["Assalaamu Alaykum", "Walaikum Assalaam", "Namaste"], "correct_answer": "Assalaamu Alaykum", "transliteration": "Assalaamu Alaykum"}'
FROM learning_lessons WHERE title = 'Greetings';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_hard', 8, '{"question": "Translate: God Protect You", "options": ["Khuda Hafiz", "Salam", "Shukriya"], "correct_answer": "Khuda Hafiz", "transliteration": "Khuda Hafiz"}'
FROM learning_lessons WHERE title = 'Greetings';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_hard', 9, '{"question": "Correct response to Khuda Hafiz?", "options": ["Khuda Hafiz", "Salam", "Hello"], "correct_answer": "Khuda Hafiz", "transliteration": "Khuda Hafiz"}'
FROM learning_lessons WHERE title = 'Greetings';


-- Lesson 2: Numbers 1-5
INSERT INTO learning_lessons (level_id, title, description, lesson_order) VALUES
(1, 'Numbers 1-5', 'Count from one to five.', 2);

-- Steps for Lesson 2
INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'teach', 1, '{"title": "Counting", "text": "1 = Akh\n2 = Zuh\n3 = Treh", "kashmiri": "Akh, Zuh, Treh", "transliteration": "Akh, Zuh, Treh", "audio": "numbers.mp3"}'
FROM learning_lessons WHERE title = 'Numbers 1-5';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_easy', 2, '{"question": "What is number 1?", "options": ["Akh", "Zuh", "Treh"], "correct_answer": "Akh", "transliteration": "Akh"}'
FROM learning_lessons WHERE title = 'Numbers 1-5';

INSERT INTO lesson_steps (lesson_id, step_type, step_order, content) 
SELECT id, 'quiz_hard', 3, '{"question": "What comes after Zuh (2)?", "options": ["Akh", "Treh", "Tsoor"], "correct_answer": "Treh", "transliteration": "Treh"}'
FROM learning_lessons WHERE title = 'Numbers 1-5';
