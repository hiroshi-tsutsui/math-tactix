const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /import \{ generateSegmentLengthProblem \} from '.\/utils\/segment-length-generator';/,
  "import { generateSegmentLengthProblem } from './utils/segment-length-generator';\nimport { generateConditionalMaxMinProblem } from './utils/conditional-max-min-generator';"
);

content = content.replace(
  /case 'max_min':\n\s*newProblem = generateMaxMinProblem\(\);\n\s*break;/,
  "case 'max_min':\n          newProblem = generateMaxMinProblem();\n          break;\n        case 'conditional_max_min':\n          newProblem = generateConditionalMaxMinProblem();\n          break;"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Patched conditional_max_min successfully in math-tactix");
