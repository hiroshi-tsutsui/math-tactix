const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'app/sets_logic/page.tsx');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("SetMaxMinViz")) {
    content = content.replace(
        "import QuadraticSetsViz from '../components/math/QuadraticSetsViz';",
        "import QuadraticSetsViz from '../components/math/QuadraticSetsViz';\nimport SetMaxMinViz from '../components/math/SetMaxMinViz';"
    );
    
    // Add to levels
    content = content.replace(
        "{ id: 6, title: '連立不等式と集合', type: 'quadratic_sets' }",
        "{ id: 6, title: '連立不等式と集合', type: 'quadratic_sets' },\n    { id: 7, title: '集合の要素の最大・最小', type: 'set_max_min' }"
    );
    
    // Add to switch
    const switchTarget = "case 'quadratic_sets':\n        return <QuadraticSetsViz />;";
    content = content.replace(
        switchTarget,
        switchTarget + "\n      case 'set_max_min':\n        return <SetMaxMinViz />;"
    );

    fs.writeFileSync(file, content);
    console.log("Updated page.tsx with SetMaxMinViz");
} else {
    console.log("SetMaxMinViz already exists in page.tsx");
}
