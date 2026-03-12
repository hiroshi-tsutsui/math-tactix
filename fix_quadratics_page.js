const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'quadratics', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('import { IntersectionParabolasViz }')) {
  content = content.replace(
    /import \{ CommonTangentViz \} from '\.\/components\/CommonTangentViz';/,
    "import { CommonTangentViz } from './components/CommonTangentViz';\nimport { IntersectionParabolasViz } from './components/IntersectionParabolasViz';"
  );
  
  content = content.replace(
    /case 55:/,
    `case 55:\n      return <CommonTangentViz />;\n    case 56:\n      return <IntersectionParabolasViz />;\n    case 5699:`
  );
  
  fs.writeFileSync(pagePath, content);
  console.log('Added IntersectionParabolasViz to page.tsx');
} else {
  console.log('Already added.');
}
