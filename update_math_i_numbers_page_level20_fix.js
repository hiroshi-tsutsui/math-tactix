const fs = require('fs');
const path = './app/math_i_numbers/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('AbsoluteInequalityCaseSplitViz')) {
    const importStatement = `import AbsoluteInequalityCaseSplitViz from '@/components/math_i/numbers/AbsoluteInequalityCaseSplitViz';\n`;
    content = content.replace(/(import .* from '.*';\n)+/, match => match + importStatement);
}

if (!content.includes('絶対値を含む不等式 (場合分け)')) {
    const newLevel = `
      {
        id: "absolute-inequality-cases",
        title: "20. 絶対値を含む不等式 (場合分け)",
        description: "場合分けを伴う絶対値の不等式を幾何学的に理解します。",
        component: <AbsoluteInequalityCaseSplitViz />
      }`;
    
    // Find the end of the levels array
    if (content.includes('id: "integer-solutions-inequality"')) {
        content = content.replace(/(id: "integer-solutions-inequality"[\s\S]*?\n\s*\})/, match => match + "," + newLevel);
    }
}

fs.writeFileSync(path, content);
console.log('Updated app/math_i_numbers/page.tsx with Level 20');
