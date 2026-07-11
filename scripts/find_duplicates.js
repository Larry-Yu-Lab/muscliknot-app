const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../utils/i18n.ts'), 'utf8');

const languages = ['en', 'zh', 'fr', 'es'];

languages.forEach(lang => {
    console.log(`Checking ${lang}...`);
    const regex = new RegExp(`${lang}: \\{([\\s\\S]*?)\\n    \\},`);
    const match = content.match(regex);
    if (match) {
        const langContent = match[1];
        const lines = langContent.split('\n');
        const keys = {};
        lines.forEach((line, index) => {
            const match = line.match(/^\s+([a-zA-Z0-9_${}]+):/);
            if (match) {
                const key = match[1];
                if (keys[key]) {
                    console.log(`Duplicate key found in ${lang}: ${key} on line ${index + 1} (relative to section)`);
                }
                keys[key] = line;
            }
        });
    } else {
        console.log(`${lang} section not found`);
    }
});
