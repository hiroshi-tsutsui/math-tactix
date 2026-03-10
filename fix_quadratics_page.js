const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// Add import
const importDomain = "import DomainAlwaysPositiveViz from './components/DomainAlwaysPositiveViz';\n";
const importOneReal = "import OneRealRootConditionViz from './components/OneRealRootConditionViz';\n";

if (!pageContent.includes('DomainAlwaysPositiveViz')) {
  pageContent = importDomain + pageContent;
}
if (!pageContent.includes('OneRealRootConditionViz')) {
  pageContent = importOneReal + pageContent;
}

// Add to LEVELS array
const level44Code = `  { id: 44, title: '一方だけが実数解をもつ条件', type: 'one_real_root' },\n`;
const level45Code = `  { id: 45, title: '特定の区間で常に正・負となる条件', type: 'domain_always_positive' },\n`;

const levelsMatch = pageContent.match(/const LEVELS = \[\s*([\s\S]*?)\];/);
if (levelsMatch) {
  let levelsContent = levelsMatch[1];
  if (!levelsContent.includes('one_real_root')) levelsContent += level44Code;
  if (!levelsContent.includes('domain_always_positive')) levelsContent += level45Code;
  
  pageContent = pageContent.replace(levelsMatch[0], `const LEVELS = [\n${levelsContent}];`);
}

// Add to generateProblem switch
const switchCases = `
        case 'one_real_root':
          newProblem = { id: Date.now(), title: '一方だけが実数解をもつ条件', type: 'one_real_root' };
          break;
        case 'domain_always_positive':
          newProblem = { id: Date.now(), title: '特定の区間で常に正・負となる条件', type: 'domain_always_positive' };
          break;
`;
if (!pageContent.includes("case 'domain_always_positive':")) {
  pageContent = pageContent.replace(/case 'profit_maximization':[\s\S]*?break;/, match => match + switchCases);
}

// Add to renderVisualization switch
const renderCases = `
      case 'one_real_root':
        return <OneRealRootConditionViz />;
      case 'domain_always_positive':
        return <DomainAlwaysPositiveViz />;
`;
if (!pageContent.includes("case 'domain_always_positive':")) {
  pageContent = pageContent.replace(/case 'profit_maximization':[\s\S]*?return <ProfitMaximizationViz \/>;/, match => match + renderCases);
}

fs.writeFileSync(pagePath, pageContent);
console.log("Successfully updated page.tsx");
