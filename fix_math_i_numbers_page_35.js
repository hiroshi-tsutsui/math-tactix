const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add the import
if (!content.includes('IrrationalEqualityViz')) {
  content = content.replace(
    "import SymmetricThreeVariablesViz from './components/SymmetricThreeVariablesViz';",
    "import SymmetricThreeVariablesViz from './components/SymmetricThreeVariablesViz';\nimport IrrationalEqualityViz from './components/IrrationalEqualityViz';"
  );
}

// Add to levels array
if (!content.includes("{ id: 35, title: '無理数の相等'")) {
  content = content.replace(
    "{ id: 34, title: '対称式と式の値 (3変数)', type: 'symmetric_three_variables' },",
    "{ id: 34, title: '対称式と式の値 (3変数)', type: 'symmetric_three_variables' },\n        { id: 35, title: '無理数の相等', type: 'irrational_equality' },"
  );
}

// Add to switch statement
if (!content.includes("case 'irrational_equality':")) {
  content = content.replace(
    "case 'symmetric_three_variables':\n      return <SymmetricThreeVariablesViz onComplete={handleVizComplete} />;",
    "case 'symmetric_three_variables':\n      return <SymmetricThreeVariablesViz onComplete={handleVizComplete} />;\n    case 'irrational_equality':\n      return <IrrationalEqualityViz onComplete={handleVizComplete} />;"
  );
}

// Update 34 to 35 in total count
content = content.replace(/\{currentLevel\} \/ 34/g, '{currentLevel} / 35');
content = content.replace(/currentLevel < 34/g, 'currentLevel < 35');
content = content.replace(/currentLevel === 34/g, 'currentLevel === 35');

fs.writeFileSync(filePath, content);
console.log('Updated app/math_i_numbers/page.tsx');
