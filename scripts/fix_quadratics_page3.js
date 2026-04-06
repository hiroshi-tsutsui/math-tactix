const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'quadratics', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('import { IntersectionParabolasViz }')) {
  content = content.replace(
    /import CommonTangentViz from "\.\/components\/CommonTangentViz";/,
    'import CommonTangentViz from "./components/CommonTangentViz";\nimport { IntersectionParabolasViz } from "./components/IntersectionParabolasViz";'
  );
}

fs.writeFileSync(pagePath, content);
console.log('Fixed imports in page.tsx');
