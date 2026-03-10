const fs = require('fs');

const targetPath = 'app/quadratics/page.tsx';
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add problem definition to the array
const probDef = "  { id: 43, title: '利益の最大化 (文章題)', type: 'profit_maximization' },\n";
if (!content.includes("'profit_maximization'")) {
    content = content.replace(/(]\s*;\s*\n\s*const generateProblem =)/, `${probDef}$1`);
}

// 2. Add import
const importStmt = "import ProfitMaximizationViz from './components/ProfitMaximizationViz';\n";
if (!content.includes('ProfitMaximizationViz')) {
    content = content.replace(/(import DifferentSignsViz [^\n]+\n)/, `$1${importStmt}`);
}

// 3. Add to switch in generateProblem
const switchCase = `        case 'profit_maximization':
          newProblem = { id: Date.now(), title: '利益の最大化', questionText: 'ある商品を100円で売ると、1日に1000個売れる。10円値上げするごとに売上個数は50個減る。利益を最大にするには、価格をいくらにすればよいか。', explanationSteps: ['価格を100+10xとする', '個数を1000-50xとする', '利益 y = (100+10x)(1000-50x) を最大化する'] };
          break;\n`;
if (!content.includes("case 'profit_maximization':")) {
    content = content.replace(/(case 'different_signs':\n[^\n]+\n[^\n]+\n)/, `$1${switchCase}`);
}

// 4. Add render block
const renderBlock = `
                {currentLevel === 43 && (
                  <ProfitMaximizationViz />
                )}
`;
// find the last {currentLevel === XX && ...} block before the ending of that section
if (!content.includes("currentLevel === 43")) {
    // we can just append it right before the {currentLevel === 3 && ...} block, 
    // actually let's insert it right after the currentLevel === 37 block.
    content = content.replace(/({currentLevel === 37 && \(\n\s*<DifferenceFunctionViz \/>\n\s*\)})/, `$1\n${renderBlock}`);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Injected ProfitMaximizationViz into page.tsx');
