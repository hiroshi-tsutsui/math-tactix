const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'quadratics', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('import { IntersectionParabolasViz }')) {
  content = content.replace(
    /import \{ CommonTangentViz \} from '\.\/components\/CommonTangentViz';/,
    "import { CommonTangentViz } from './components/CommonTangentViz';\nimport { IntersectionParabolasViz } from './components/IntersectionParabolasViz';"
  );
}

if (!content.includes('{ id: 56')) {
  content = content.replace(
    /\{ id: 55, title: '2つの放物線の共通接線', type: 'common_tangent' \},/,
    "{ id: 55, title: '2つの放物線の共通接線', type: 'common_tangent' },\n  { id: 56, title: '2つの放物線の交点を通る図形', type: 'intersection_parabolas' },"
  );
}

if (!content.includes('currentLevel === 56')) {
  content = content.replace(
    /\{currentLevel === 55 && <CommonTangentViz \/>\}/,
    "{currentLevel === 55 && <CommonTangentViz />}\n        {currentLevel === 56 && <IntersectionParabolasViz />}"
  );
}

fs.writeFileSync(pagePath, content);
console.log('Fixed page.tsx');
