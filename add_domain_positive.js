const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

const importStatement = `import DomainAlwaysPositiveViz from './components/DomainAlwaysPositiveViz';\n`;
if (!pageContent.includes('DomainAlwaysPositiveViz')) {
  pageContent = importStatement + pageContent;
}

const level45Code = `
      {
        id: "domain_always_positive",
        title: "特定の区間で常に正となる条件",
        description: "指定された定義域で、2次関数が常に正または常に負になるための条件を、グラフの最小値・最大値から視覚的に判断します。",
        type: "concept",
        visualizer: DomainAlwaysPositiveViz
      },
`;

if (!pageContent.includes('domain_always_positive')) {
  // Find the exact place to inject. We'll inject after OneRealRootConditionViz
  const oneRealRootIndex = pageContent.indexOf('id: "one_real_root"');
  if (oneRealRootIndex !== -1) {
    const endOfOneRealRoot = pageContent.indexOf('},', oneRealRootIndex) + 2;
    pageContent = pageContent.substring(0, endOfOneRealRoot) + level45Code + pageContent.substring(endOfOneRealRoot);
    fs.writeFileSync(pagePath, pageContent);
    console.log("Successfully injected level 45 into page.tsx");
  } else {
    console.log("Could not find one_real_root");
  }
} else {
    console.log("Level 45 already exists in page.tsx");
}
