const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'math_i_numbers', 'page.tsx');
let pageCode = fs.readFileSync(pagePath, 'utf-8');

if (!pageCode.includes('LinearEquationCasesViz')) {
    // Add import
    const importStatement = `import LinearEquationCasesViz from '../components/LinearEquationCasesViz';\n`;
    pageCode = pageCode.replace(/import HigherDegreeValueViz[^;]+;/, match => match + '\n' + importStatement);

    // Add to module map
    const newModule = `
  {
    id: "linear_cases",
    title: "1次方程式 ax = b の解の分類",
    description: "文字係数を含む1次方程式が「解なし」や「無数の解」になる条件を視覚的に理解します。",
    icon: "🔀",
    component: <LinearEquationCasesViz />
  },`;
    
    // Find the right place to insert
    pageCode = pageCode.replace(/(id: "higher_degree_value"[^}]+},)/, match => match + newModule);
    
    fs.writeFileSync(pagePath, pageCode);
    console.log('Successfully injected LinearEquationCasesViz into page.tsx');
} else {
    console.log('LinearEquationCasesViz already exists in page.tsx');
}
