const fs = require('fs');
let code = fs.readFileSync('app/quadratics/page.tsx', 'utf-8');
code = code.replace(
`                {currentLevel === 33 && (
                {currentLevel === 34 && (
                  <TriangleAreaViz problem={problem} />
                )}
                  <TwoParabolasViz />
                )}`,
`                {currentLevel === 33 && (
                  <TwoParabolasViz />
                )}
                {currentLevel === 34 && (
                  <TriangleAreaViz problem={problem} />
                )}`
);
fs.writeFileSync('app/quadratics/page.tsx', code);
