const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync('utils/i18n.ts', 'utf8');

// Parse translations object
const enMatch = i18nContent.match(/en:\s*\{([\s\S]*?)\n\s*\},/);
const keysInEn = new Map();
const keyRegex = /^\s*([a-zA-Z0-9_]+)\s*:\s*(['"`][\s\S]*?['"`]|`[\s\S]*?`),?/gm;
let match;
while ((match = keyRegex.exec(enMatch[1])) !== null) {
    keysInEn.set(match[1], match[2]);
}

console.log(`Found ${keysInEn.size} keys in translations.en`);

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

console.log('\n--- Scanning for t(...) calls ---');
const tCalls = [];
files.forEach(file => {
    if (file.includes('utils/i18n.ts')) return;
    const content = fs.readFileSync(file, 'utf8');
    const regex = /\bt\(\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
        const key = m[1];
        if (!keysInEn.has(key)) {
            tCalls.push({ file, key });
        }
    }
});

console.log(`Found ${tCalls.length} t(...) calls with missing keys:`);
tCalls.forEach(c => console.log(`  ${c.file}: t('${c.key}')`));

console.log('\n--- Scanning for camelCase strings inside JSX Text elements ---');
const camelInJsx = [];
files.forEach(file => {
    if (file.includes('node_modules')) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // find patterns like >someCamelCase< or > {someCamelCase} <
        const camelRegex = />\s*([a-z]+[A-Z][a-zA-Z0-9]*)\s*</g;
        let m;
        while ((m = camelRegex.exec(line)) !== null) {
            camelInJsx.push({ file, lineNum: idx + 1, text: m[1], line: line.trim() });
        }
    });
});

console.log(`Found ${camelInJsx.length} raw camelCase texts in JSX:`);
camelInJsx.forEach(c => console.log(`  ${c.file}:${c.lineNum}: "${c.text}" in line: ${c.line}`));
