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

// Look for rendering variables in JSX like <Text>{something}</Text> where something is camelCase or raw key
files.forEach(file => {
    if (file.includes('node_modules')) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        // match <Text...>{expression}</Text>
        const matches = line.match(/<Text[^>]*>([\s\S]*?)<\/Text>/g);
        if (matches) {
            matches.forEach(m => {
                // Check if m contains raw camelCase string or unformatted variable
                if (m.includes('as any') || (m.includes('{') && m.includes('}') && !m.includes('t(') && !m.includes('formatLabel(') && !m.includes('colors') && !m.includes('styles'))) {
                    // console.log(`${file}:${idx+1} -> ${m}`);
                }
            });
        }
    });
});
