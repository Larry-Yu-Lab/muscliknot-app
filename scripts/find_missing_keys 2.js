const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync('utils/i18n.ts', 'utf8');

// Match all keys in translations.en
const enMatch = i18nContent.match(/en:\s*\{([\s\S]*?)\n\s*\},/);
const keysInEn = new Set();
const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:/gm;
let match;
while ((match = keyRegex.exec(enMatch[1])) !== null) {
    keysInEn.add(match[1]);
}

console.log('Total keys in translations.en:', keysInEn.size);

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
const missingKeys = new Map();
const tPattern = /t\(\s*['"]([^'"]+)['"]/g;

files.forEach(file => {
    if (file === 'utils/i18n.ts') return;
    const content = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = tPattern.exec(content)) !== null) {
        const key = m[1];
        if (!keysInEn.has(key)) {
            if (!missingKeys.has(key)) {
                missingKeys.set(key, [file]);
            } else {
                missingKeys.get(key).push(file);
            }
        }
    }
});

console.log('\nMissing keys in translations.en:');
missingKeys.forEach((files, key) => {
    console.log(`- ${key} (in ${files[0]})`);
});
