const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('HigherDegreeValueViz')) {
    content = content.replace(
        "import IntegerSolutionsInequalityViz from './components/IntegerSolutionsInequalityViz';",
        "import IntegerSolutionsInequalityViz from './components/IntegerSolutionsInequalityViz';\nimport HigherDegreeValueViz from './components/HigherDegreeValueViz';"
    );
}

if (!content.includes("{ id: 23")) {
    content = content.replace(
        "{ id: 22, title: '1次不等式の文章題 (食塩水・濃度)', type: 'salt_water_inequality' }",
        "{ id: 22, title: '1次不等式の文章題 (食塩水・濃度)', type: 'salt_water_inequality' }\n        , { id: 23, title: '次数下げによる高次式の値', type: 'higher_degree_value' }"
    );
}

if (!content.includes("case 'higher_degree_value':")) {
    content = content.replace(
        "case 'salt_water_inequality':\n        return <SaltWaterInequalityViz />;\n      default:",
        "case 'salt_water_inequality':\n        return <SaltWaterInequalityViz />;\n      case 'higher_degree_value':\n        return <HigherDegreeValueViz />;\n      default:"
    );
}

fs.writeFileSync(file, content);
console.log("Updated app/math_i_numbers/page.tsx");
