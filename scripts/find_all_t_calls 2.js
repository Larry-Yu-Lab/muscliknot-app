const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync('utils/i18n.ts', 'utf8');

// Parse en, zh, fr, es maps
const evalObj = (str) => {
    try {
        return eval('(' + str + ')');
    } catch(e) {
        return null;
    }
};

const match = i18nContent.match(/export const translations = ({[\s\S]*?});\n\n\/\/ Helper/);
let translations = {};
if (match) {
    translations = evalObj(match[1]) || {};
}

const enKeys = new Set(Object.keys(translations.en || {}));
console.log('enKeys count:', enKeys.size);

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!['node_modules', '.git', '.expo', 'android', 'ios', 'build', '.vscode'].includes(file)) {
                getAllFiles(filePath, fileList);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = getAllFiles('.');

// Find all t(...) expressions in code
const usageList = [];
files.forEach(file => {
    if (file.includes('utils/i18n.ts')) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // match t('key'...) or t("key"...) or t(`key`...)
        const regex = /t\(\s*['"`]([^'"`]+)['"`]/g;
        let m;
        while ((m = regex.exec(line)) !== null) {
            const key = m[1];
            usageList.push({
                file,
                lineNum: idx + 1,
                key,
                lineText: line.trim(),
                inEn: enKeys.has(key)
            });
        }
    });
});

console.log('\n--- All missing keys referenced in code ---');
const missingMap = new Map();
usageList.filter(u => !u.inEn).forEach(u => {
    if (!missingMap.has(u.key)) {
        missingMap.set(u.key, []);
    }
    missingMap.get(u.key).push(`${u.file}:${u.lineNum}`);
});

missingMap.forEach((locations, key) => {
    console.log(`Key: "${key}"`);
    locations.forEach(loc => console.log(`  -> ${loc}`));
});

