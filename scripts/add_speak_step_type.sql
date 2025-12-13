-- Migration: Add 'speak' to lesson_steps check constraint
ALTER TABLE lesson_steps 
DROP CONSTRAINT IF EXISTS lesson_steps_step_type_check;

ALTER TABLE lesson_steps 
ADD CONSTRAINT lesson_steps_step_type_check 
CHECK (step_type IN ('teach', 'quiz_easy', 'quiz_hard', 'speak'));
