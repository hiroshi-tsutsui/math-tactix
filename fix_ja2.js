const fs = require('fs');
const file = require('path').join(__dirname, 'locales/ja.json');
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  /"desc": "sin\^2 \+ cos\^2 = 1 の関係式を、単位円上の直角三角形として視覚的に理解します。"\n\s*}/g,
  '"desc": "sin^2 + cos^2 = 1 の関係式を、単位円上の直角三角形として視覚的に理解します。"\n        },'
);

fs.writeFileSync(file, text);
