const fs = require('fs');
const path = './app/quadratics/page.tsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('import FenceEnclosureViz')) {
  content = content.replace(
    /import BothRootsBetweenViz from '\.\/components\/BothRootsBetweenViz';/,
    `import BothRootsBetweenViz from './components/BothRootsBetweenViz';\nimport FenceEnclosureViz from './components/FenceEnclosureViz';`
  );
}

// 2. Add level definition to MODULES array.
// Look for id: 52
if (!content.includes("id: 53")) {
  content = content.replace(
    /\{ id: 52, title: '放物線と直線の間の線分の長さの最大値', type: 'vertical_segment_max' \},/g,
    `{ id: 52, title: '放物線と直線の間の線分の長さの最大値', type: 'vertical_segment_max' },\n  { id: 53, title: '壁を利用した長方形の面積の最大化', type: 'fence_enclosure' },`
  );
}

// 3. Add to switch statement
if (!content.includes("case 'fence_enclosure':")) {
  content = content.replace(
    /case 'vertical_segment_max':\n\s+return <VerticalSegmentMaxViz \/>;/g,
    `case 'vertical_segment_max':\n          return <VerticalSegmentMaxViz />;\n        case 'fence_enclosure':\n          return <FenceEnclosureViz />;`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Level 53 (Fence Enclosure) added successfully.');
