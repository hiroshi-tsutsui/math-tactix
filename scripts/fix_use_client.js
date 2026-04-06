const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app/quadratics/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// remove any existing use client
pageContent = pageContent.replace(/'use client';\n/g, '');
pageContent = pageContent.replace(/"use client";\n/g, '');

// add it to the very top
pageContent = "'use client';\n" + pageContent;

fs.writeFileSync(pagePath, pageContent);
console.log("Fixed use client position.");
