const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// replace incorrect import
content = content.replace("import BothRootsBetweenViz from '@/components/viz/BothRootsBetweenViz';", "import BothRootsBetweenViz from './components/BothRootsBetweenViz';");

fs.writeFileSync(pagePath, content);
console.log('Fixed import');
