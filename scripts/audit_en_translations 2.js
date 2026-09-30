const fs = require('fs');

const content = fs.readFileSync('utils/i18n.ts', 'utf8');

const match = content.match(/export const translations = ({[\s\S]*?});\n\n\/\/ Helper/);
if (!match) {
    console.log("Could not find translations");
    process.exit(1);
}

const translations = eval('(' + match[1] + ')');
const enObj = translations.en;

console.log('Total keys in en:', Object.keys(enObj).length);

const issues = [];

Object.entries(enObj).forEach(([key, val]) => {
    if (typeof val !== 'string') return;
    
    // Check for camelCase words in English text (e.g. "inviteFriends", "guidedMode", "appleHealth")
    const camelMatch = val.match(/\b[a-z]+[A-Z][a-zA-Z0-9]*\b/g);
    if (camelMatch) {
        // filter out valid terms if any like MuscliKnot or YouTube or AppStore or TikTok
        const suspicious = camelMatch.filter(w => !['MuscliKnot', 'YouTube', 'AppStore', 'TikTok', 'iOS', 'dB'].includes(w));
        if (suspicious.length > 0) {
            issues.push(`Key "${key}" has camelCase words: ${suspicious.join(', ')} -> "${val}"`);
        }
    }

    // Check for double spaces
    if (val.includes('  ')) {
        issues.push(`Key "${key}" has double spaces -> "${val}"`);
    }

    // Check for missing space after punctuation like period/comma followed by letter (e.g., "hello.world")
    const puncMatch = val.match(/[a-zA-Z][.,!?:;][a-zA-Z]/g);
    if (puncMatch) {
        issues.push(`Key "${key}" missing space after punctuation: ${puncMatch.join(', ')} -> "${val}"`);
    }
});

console.log('\n--- Found translation value issues ---');
console.log(`Total issues: ${issues.length}`);
issues.forEach(i => console.log(i));
