const fs = require('fs');
const file = 'app/trig_ratios/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '{/* Level 11: Tactics Mode (Quiz) */}\n      {level === 10 && (',
  '{/* Level 11: Surveying */}\n      {level === 11 && (\n          <SurveyingViz />\n      )}\n\n      {/* Level 12: Herons Formula */}\n      {level === 12 && (\n          <HeronsFormulaViz />\n      )}\n\n      {/* Level 13: Tactics Mode (Quiz) */}\n      {level === 13 && ('
);

fs.writeFileSync(file, content);
