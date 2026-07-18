const fs = require('fs');
try {
  let content = fs.readFileSync('utils/i18n.ts', 'utf8');
  let match = content.match(/export const translations = ({[\s\S]*?});/);
  if (!match) {
    match = content.match(/export const translations = ({[\s\S]*?\n});/);
  }
  if(!match) {
    console.log("No match found");
    process.exit(1);
  }
  let objStr = match[1];
  let ast = eval('(' + objStr + ')');
  const enKeys = Object.keys(ast.en);
  ['zh', 'fr', 'es'].forEach(lang => {
    const langKeys = Object.keys(ast[lang] || {});
    const missing = enKeys.filter(k => !langKeys.includes(k));
    console.log(`${lang} missing ${missing.length} keys out of ${enKeys.length}`);
    if (missing.length > 0) console.log(missing.join(', '));
  });
} catch(e) {
  console.log("Error: " + e.message);
}
