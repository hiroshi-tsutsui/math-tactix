const fs = require('fs');

const pageFile = 'app/quadratics/page.tsx';
let content = fs.readFileSync(pageFile, 'utf8');

// 1. Add imports
if (!content.includes('VertexLocusViz')) {
  content = content.replace(
    /import CoefficientSignsViz from '.\/components\/CoefficientSignsViz';/,
    "import CoefficientSignsViz from './components/CoefficientSignsViz';\nimport VertexLocusViz from './components/VertexLocusViz';\nimport { generateVertexLocusProblem } from './utils/vertex-locus-generator';"
  );
}

// 2. Add level
if (!content.includes("{ id: 32, title: '放物線の頂点の軌跡'")) {
  content = content.replace(
    /\{ id: 31, title: '放物線と直線の交点間の距離', type: 'intersection_distance' \},/,
    "{ id: 31, title: '放物線と直線の交点間の距離', type: 'intersection_distance' },\n  { id: 32, title: '放物線の頂点の軌跡', type: 'vertex_locus' },"
  );
}

// 3. Add to switch statement for level init
if (!content.includes("case 'vertex_locus':")) {
  content = content.replace(
    /case 'intersection_distance':\s*newProblem =.*?;\s*break;/,
    "case 'intersection_distance':\n          newProblem = { id: Date.now(), title: \"放物線と直線の交点間の距離\", target: \"距離 L\", equation: \"\", formula: \"\", hint: \"スライダーを動かして交点間の距離が変わる様子を確認しましょう。\", expected: [], options: [], type: \"intersection_distance\" };\n          break;\n        case 'vertex_locus':\n          newProblem = generateVertexLocusProblem();\n          break;"
  );
}

// 4. Add to switch statement for viz rendering
if (!content.includes("<VertexLocusViz")) {
  content = content.replace(
    /case 'intersection_distance':\s*return <IntersectionDistanceViz onSuccess=\{handleSuccess\} \/>;/,
    "case 'intersection_distance':\n        return <IntersectionDistanceViz onSuccess={handleSuccess} />;\n      case 'vertex_locus':\n        return <VertexLocusViz />;"
  );
}

fs.writeFileSync(pageFile, content);
console.log("Patched page.tsx successfully.");