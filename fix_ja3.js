const fs = require('fs');
const file = require('path').join(__dirname, 'locales/ja.json');
let text = fs.readFileSync(file, 'utf8');

// The easiest way to parse slightly malformed JSON in node is:
try {
  let parsed = new Function('return ' + text)();
  fs.writeFileSync(file, JSON.stringify(parsed, null, 2));
  console.log('Fixed ja.json using Function');
} catch (e) {
  console.error(e.message);
}
