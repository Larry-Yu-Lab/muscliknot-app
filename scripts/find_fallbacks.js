const fs = require('fs');
const path = require('path');

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
const keyFallbackPairs = [];

files.forEach(file => {
    if (file.includes('utils/i18n.ts')) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // match t('key'...) || 'Fallback'
        const regex = /t\(\s*['"]([^'"]+)['"](?:\s*as\s*any)?\s*\)\s*\|\|\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = regex.exec(line)) !== null) {
            keyFallbackPairs.push({
                file,
                lineNum: idx + 1,
                key: m[1],
                fallback: m[2]
            });
        }
    });
});

console.log(`Found ${keyFallbackPairs.length} t(...) || 'fallback' patterns:`);
keyFallbackPairs.forEach(p => {
    console.log(`  ${p.file}:${p.lineNum} -> key: "${p.key}", fallback: "${p.fallback}"`);
});
