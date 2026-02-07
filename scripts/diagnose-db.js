const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('=== DATABASE DIAGNOSTIC ===\n');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
    try {
        // 1. Check what's in the database
        console.log('1. Fetching all rows from recovery_knowledge_base...\n');
        const { data, error } = await supabase
            .from('recovery_knowledge_base')
            .select('id, common_name, muscle_id, solution_stretch, instructions')
            .limit(10);

        if (error) {
            console.error('Database Error:', error.message);
            return;
        }

        if (!data || data.length === 0) {
            console.log('⚠️  NO DATA FOUND in recovery_knowledge_base table!');
            console.log('   You need to add exercises to your database.\n');
            return;
        }

        console.log(`✅ Found ${data.length} rows in the database.\n`);

        // 2. Show muscle_id values
        console.log('2. Checking muscle_id values in your database:\n');
        const allMuscleIds = new Set();
        data.forEach(row => {
            console.log(`   - "${row.common_name || row.solution_stretch}"`);
            console.log(`     muscle_id: ${JSON.stringify(row.muscle_id)}`);
            if (Array.isArray(row.muscle_id)) {
                row.muscle_id.forEach(id => allMuscleIds.add(id));
            }
            console.log('');
        });

        // 3. Compare with app's expected values
        console.log('3. Expected muscle_id values by the app:');
        const appMuscleIds = ['neck', 'traps', 'upper_back', 'lower_back', 'glutes', 'legs'];
        console.log(`   App expects: ${JSON.stringify(appMuscleIds)}\n`);
        console.log(`   Your DB has: ${JSON.stringify([...allMuscleIds])}\n`);

        // 4. Check for matches
        const matches = appMuscleIds.filter(id => allMuscleIds.has(id));
        const missing = appMuscleIds.filter(id => !allMuscleIds.has(id));

        if (matches.length > 0) {
            console.log(`✅ Matching: ${JSON.stringify(matches)}`);
        }
        if (missing.length > 0) {
            console.log(`⚠️  Not in your DB: ${JSON.stringify(missing)}`);
        }

        // 5. Try a sample query
        console.log('\n4. Testing query for "neck"...');
        const { data: neckData, error: neckError } = await supabase
            .from('recovery_knowledge_base')
            .select('common_name, solution_stretch')
            .contains('muscle_id', ['neck']);

        if (neckError) {
            console.log(`   Error: ${neckError.message}`);
        } else {
            console.log(`   Found ${neckData?.length || 0} results for "neck"`);
        }

    } catch (err) {
        console.error('Unexpected Error:', err.message);
    }
}

diagnose();
