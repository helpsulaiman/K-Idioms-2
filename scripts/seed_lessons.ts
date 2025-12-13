
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedLessons() {
    console.log('🌱 Starting seed process...');

    try {
        // 1. Create or Update "Basics 1" Level
        console.log('Creating "Basics 1" level...');
        const { data: level, error: levelError } = await supabase
            .from('learning_levels')
            .upsert({
                id: 1, // Fixed ID for simplicity, or we could query by name
                name: 'Basics 1',
                description: 'Start your journey with the Kashmiri alphabet and basic words.',
                level_order: 1,
                min_stars_required: 0
            })
            .select()
            .single();

        if (levelError) throw new Error(`Failed to create level: ${levelError.message}`);
        console.log('✅ Level "Basics 1" ready.');

        // 2. Create "Alphabets" Lesson
        console.log('Creating "Alphabets" lesson...');

        // Clean up potential conflict
        await supabase.from('learning_lessons').delete().match({ level_id: level.id, lesson_order: 1 });

        const { data: lesson, error: lessonError } = await supabase
            .from('learning_lessons')
            .upsert({
                id: 101, // Arbitrary ID to avoid conflicts with existing ones if any, or let DB handle it if we remove ID. Let's force it for consistency.
                level_id: level.id,
                title: 'Alphabets',
                description: 'Learn the Kashmiri script and sounds.',
                lesson_order: 1
            })
            .select()
            .single();

        if (lessonError) throw new Error(`Failed to create lesson: ${lessonError.message}`);
        console.log('✅ Lesson "Alphabets" ready.');

        // 3. Parse CSV and Create Steps
        console.log('Parsing CSV...');
        const csvPath = path.join(process.cwd(), 'alphabet_rows.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });

        console.log(`Found ${records.length} letters. Creating steps...`);

        // Clear existing steps for this lesson to avoid duplicates/mess
        await supabase.from('lesson_steps').delete().eq('lesson_id', lesson.id);

        let stepOrder = 1;

        interface AlphabetRecord {
            name: string;
            letter: string;
            pronunciation: string;
            example_word_english: string;
            example_word_kashmiri: string;
        }

        for (const record of records as AlphabetRecord[]) {
            // Teach Step
            await supabase.from('lesson_steps').insert({
                lesson_id: lesson.id,
                step_type: 'teach',
                step_order: stepOrder++,
                content: {
                    title: `The Letter ${record.name} (${record.letter})`,
                    text: `This is the letter ${record.name}. It sounds like "${record.pronunciation}".`,
                    kashmiri: record.letter,
                    transliteration: record.name,
                    audio_url: null // TODO: Add audio link if available later
                }
            });

            // Quiz Step (Simple recognition)
            await supabase.from('lesson_steps').insert({
                lesson_id: lesson.id,
                step_type: 'quiz_easy',
                step_order: stepOrder++,
                content: {
                    question: `Which letter matches "${record.name}"?`,
                    correct_answer: record.letter,
                    options: [
                        record.letter,
                        // Randomly pick 3 other letters as distractors
                        ...records
                            .filter((r: any) => r.letter !== record.letter)
                            .map((r: any) => r.letter)
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 3)
                    ].sort(() => 0.5 - Math.random()) // Shuffle options
                }
            });

            // Word Association Teach Step
            await supabase.from('lesson_steps').insert({
                lesson_id: lesson.id,
                step_type: 'teach',
                step_order: stepOrder++,
                content: {
                    title: `Example: ${record.example_word_english}`,
                    text: `"${record.name}" is used in the word for ${record.example_word_english}:`,
                    kashmiri: record.example_word_kashmiri,
                    transliteration: record.pronunciation, // Using pronunciation field as proxy if full transliteration isn't separate
                    audio_url: null
                }
            });

            // Speak Step
            const { error: speakError } = await supabase.from('lesson_steps').insert({
                lesson_id: lesson.id,
                step_type: 'speak',
                step_order: stepOrder++,
                content: {
                    title: `Speak the Letter`,
                    text: `Practice saying "${record.name}"`,
                    kashmiri: record.letter,
                    transliteration: record.pronunciation,
                    correct_answer: record.letter
                }
            });

            if (speakError) console.error('Error inserting speak step:', speakError);
        }

        console.log('✅ All steps created successfully!');

    } catch (error) {
        console.error('❌ Error seeding lessons:', error);
    }
}

seedLessons();
