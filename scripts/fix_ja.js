const fs = require('fs');
const file = require('path').join(__dirname, 'locales/ja.json');
let text = fs.readFileSync(file, 'utf8');

// Replace the garbled part around "3"
text = text.replace(/"3": {,\n\s*"title": "相互関係",,\n\s*"desc": "sin\^2 \+ cos\^2 = 1 の関係式を、単位円上の直角三角形として視覚的に理解します。",\n\s*},,/g,
`"3": {
          "title": "相互関係",
          "desc": "sin^2 + cos^2 = 1 の関係式を、単位円上の直角三角形として視覚的に理解します。"
        }`);

// It seems my previous sed command did:
// "3": {,
// "title": "相互関係",,
// "desc": "sin^2 + cos^2 = 1 の関係式を、単位円上の直角三角形として視覚的に理解します。",
// },,

// Let me just read it and do a global regex replace to fix any trailing commas.
text = text.replace(/,\s*,/g, ',');
text = text.replace(/{\s*,/g, '{');
text = text.replace(/},\s*,/g, '},');
text = text.replace(/},\s*}/g, '}\n        }');

fs.writeFileSync(file, text);
console.log('Fixed ja.json');
