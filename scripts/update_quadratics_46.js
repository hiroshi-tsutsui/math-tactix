const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Add to levels array
const levelEntry = "  { id: 46, title: '2つの解が特定の区間にある条件', type: 'both_roots_between' },\n";
if (!content.includes("'both_roots_between'")) {
    content = content.replace(
        "{ id: 45, title: '特定の区間で常に正・負となる条件', type: 'domain_always_positive' },",
        "{ id: 45, title: '特定の区間で常に正・負となる条件', type: 'domain_always_positive' },\n" + levelEntry
    );
}

// 2. Add to problem generation switch
const problemCase = `
        case 'both_roots_between':
          newProblem = { 
            id: Date.now(), 
            title: '2つの解が特定の区間にある条件', 
            type: 'both_roots_between',
            questionText: '2次方程式 x² - 2ax + a + 2 = 0 の2つの解がともに 0 < x < 3 の範囲にあるような定数aの値の範囲を視覚的に求めよ。',
            explanationSteps: ['D ≥ 0', '0 < 軸 < 3', 'f(0) > 0 かつ f(3) > 0']
          };
          break;
`;
if (!content.includes("case 'both_roots_between':")) {
    content = content.replace(
        "case 'domain_always_positive':",
        problemCase + "\n        case 'domain_always_positive':"
    );
}

// 3. Add to rendering switch
const renderCase = `
      case 'both_roots_between':
        return <BothRootsBetweenViz problem={currentProblem} />;
`;
if (!content.includes("<BothRootsBetweenViz")) {
    content = content.replace(
        "case 'domain_always_positive':",
        renderCase + "\n      case 'domain_always_positive':"
    );
}

// 4. Add import
if (!content.includes("BothRootsBetweenViz")) {
    content = content.replace(
        "import DomainAlwaysPositiveViz",
        "import BothRootsBetweenViz from '@/components/viz/BothRootsBetweenViz';\nimport DomainAlwaysPositiveViz"
    );
}

fs.writeFileSync(pagePath, content);
console.log('Updated page.tsx with both_roots_between');
