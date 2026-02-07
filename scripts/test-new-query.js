const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testNewQuery() {
    console.log('=== Testing New Query Logic ===\n');

    // Test for 'neck' zone - should match trapezius, levator, sternocleidomastoid, etc.
    const keywords = ['trapezius', 'levator', 'sternocleidomastoid', 'scalene', 'splenius'];
    const orConditions = keywords.map(k => `common_name.ilike.%${k}%`).join(',');

    console.log('Query:', orConditions);

    const { data, error } = await supabase
        .from('recovery_knowledge_base')
        .select('common_name, solution_stretch, instructions')
        .or(orConditions);

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`\nFound ${data?.length || 0} results:\n`);
    data?.forEach((row, i) => {
        console.log(`${i + 1}. ${row.common_name}`);
        console.log(`   Stretch: ${row.solution_stretch || 'N/A'}`);
        console.log(`   Instructions: ${row.instructions?.substring(0, 50) || 'N/A'}...`);
        console.log('');
    });
}

testNewQuery();
