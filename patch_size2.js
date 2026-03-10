const fs = require('fs');
const file = 'app/quadratics/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("case 'two_parabolas_size':")) {
    const generatorSwitch = `case 'two_parabolas_size':\n          newProblem = generateTwoParabolasSizeProblem();\n          break;\n        `;
    content = content.replace('case "external_tangent":', generatorSwitch + 'case "external_tangent":');
}

if (!content.includes("<TwoParabolasSizeViz")) {
    const vizRender = `{problem.type === 'two_parabolas_size' && <TwoParabolasSizeViz />}\n                  `;
    content = content.replace("{problem.type === 'external_tangent' && <ExternalTangentViz />}", vizRender + "{problem.type === 'external_tangent' && <ExternalTangentViz />}");
}

fs.writeFileSync(file, content);
console.log("Patched 2");
