const fs = require('fs');
let content = fs.readFileSync('app/quadratics/page.tsx', 'utf8');

if (!content.includes("import ThreePointsDeterminationViz")) {
    content = content.replace("import ChordLengthViz from '../components/ChordLengthViz';", "import ChordLengthViz from '../components/ChordLengthViz';\nimport ThreePointsDeterminationViz from '../components/ThreePointsDeterminationViz';");
}

fs.writeFileSync('app/quadratics/page.tsx', content);
