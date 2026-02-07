const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function showMuscleIds() {
    const { data, error } = await supabase
        .from('recovery_knowledge_base')
        .select('muscle_id, common_name')
        .limit(20);

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('=== MUSCLE IDs IN YOUR DATABASE ===\n');
    const allIds = new Set();
    data.forEach(row => {
        console.log(`${row.common_name}:`);
        console.log(`  muscle_id = ${JSON.stringify(row.muscle_id)}\n`);
        if (Array.isArray(row.muscle_id)) {
            row.muscle_id.forEach(id => allIds.add(id));
        }
    });

    console.log('=== UNIQUE muscle_id VALUES ===');
    console.log([...allIds].join(', '));
}

showMuscleIds();
