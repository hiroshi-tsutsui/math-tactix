const fs = require('fs');
const pagePath = 'app/quadratics/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');
if (!content.includes("import BothRootsBetweenViz")) {
    content = content.replace(
        "import DomainAlwaysPositiveViz",
        "import BothRootsBetweenViz from './components/BothRootsBetweenViz';\nimport DomainAlwaysPositiveViz"
    );
    fs.writeFileSync(pagePath, content);
}
console.log('Fixed import');
