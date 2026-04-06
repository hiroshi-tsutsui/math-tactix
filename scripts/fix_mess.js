const fs = require('fs');
const pagePath = 'app/quadratics/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Remove the broken case return we injected
content = content.replace(`case 'both_roots_between':
        return <BothRootsBetweenViz problem={currentProblem} />;

      case 'domain_always_positive':`, `case 'both_roots_between':
          newProblem = { id: Date.now(), title: '2つの解が特定の区間にある条件', type: 'both_roots_between' };
          break;
      case 'domain_always_positive':`);

// 2. Add to the rendering block at the bottom
const renderInject = `        {currentLevel === 45 && <DomainAlwaysPositiveViz />}
        {currentLevel === 46 && <BothRootsBetweenViz />}
      </main>`;
content = content.replace("</main>", renderInject);

fs.writeFileSync(pagePath, content);
console.log('Fixed mess');
