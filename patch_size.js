const fs = require('fs');
const file = 'app/quadratics/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add imports
if (!content.includes('TwoParabolasSizeViz')) {
    const importStr = `import TwoParabolasSizeViz from './components/TwoParabolasSizeViz';\nimport { generateTwoParabolasSizeProblem } from './utils/two-parabolas-size-generator';\n`;
    content = content.replace("import TwoParabolasViz from './components/TwoParabolasViz';", importStr + "import TwoParabolasViz from './components/TwoParabolasViz';");
}

// Add Level 36 mapping
if (!content.includes("id: 36")) {
    const target = `{ id: 35, title: '放物線外の点から引いた接線', type: 'external_tangent' },`;
    content = content.replace(target, target + `\n  { id: 36, title: '2つの2次関数の大小', type: 'two_parabolas_size' },`);
}

// Add Generator switch
if (!content.includes("case 'two_parabolas_size':")) {
    const generatorSwitch = `case 'two_parabolas_size':\n          newProblem = generateTwoParabolasSizeProblem();\n          break;\n`;
    content = content.replace("case 'external_tangent':", generatorSwitch + "        case 'external_tangent':");
}

// Add Viz render
if (!content.includes("<TwoParabolasSizeViz")) {
    const vizRender = `{problem.type === 'two_parabolas_size' && <TwoParabolasSizeViz />}\n`;
    content = content.replace("{problem.type === 'external_tangent' && <ExternalTangentViz />}", vizRender + "                  {problem.type === 'external_tangent' && <ExternalTangentViz />}");
}

fs.writeFileSync(file, content);
console.log("Patched size viz");
