
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSteps() {
    console.log('Checking lesson steps...');

    // Get the Alphabets lesson ID (assuming it's 101 from seed script)
    const { data: steps, error } = await supabase
        .from('lesson_steps')
        .select('step_order, step_type, content')
        .eq('lesson_id', 101)
        .order('step_order');

    if (error) {
        console.error('Error fetching steps:', error);
        return;
    }

    console.log(`Found ${steps.length} steps for Lesson 101:`);
    steps.forEach(step => {
        console.log(`- Order: ${step.step_order}, Type: ${step.step_type}`);
    });

    steps.filter(s => s.step_type === 'speak').forEach(s => {
        console.log('Speak Step Content:', JSON.stringify(s.content, null, 2));
    });
}

checkSteps();
