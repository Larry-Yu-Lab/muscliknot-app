const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
// console.log('Key:', supabaseAnonKey); // Don't log full key

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('recovery_knowledge_base')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection Failed:', error.message);
            // Check for specific URL format error
            if (error.message.includes('URL')) {
                console.error('Hint: Double check your EXPO_PUBLIC_SUPABASE_URL. It should look like https://<project-ref>.supabase.co');
            }
        } else {
            console.log('Connection Successful!');
            console.log('Table accessibility check passed.');
        }
    } catch (err) {
        console.error('Unexpected Error:', err.message);
    }
}

testConnection();
