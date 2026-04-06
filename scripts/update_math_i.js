const fs = require('fs');

const pagePath = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

// Add import
const importStatement = "import SimultaneousLinearInequalitiesViz from '../components/math/SimultaneousLinearInequalitiesViz';";
if (!content.includes('SimultaneousLinearInequalitiesViz')) {
    content = content.replace(/(import [^\n]+;)/, `$1\n${importStatement}`);
}

// Add to levels array
if (!content.includes("type: 'simultaneous_linear'")) {
    const levelMatch = content.match(/{\s*id:\s*\d+,\s*title:\s*'[^']+',\s*type:\s*'[^']+'\s*}/g);
    let highestId = 0;
    if (levelMatch) {
        levelMatch.forEach(l => {
            const m = l.match(/id:\s*(\d+)/);
            if (m && parseInt(m[1]) > highestId) {
                highestId = parseInt(m[1]);
            }
        });
    } else {
        highestId = 42; // Fallback
    }
    const newId = highestId + 1;
    
    // Find the end of the array
    content = content.replace(/(\s*\];\s*const renderContent)/, `,\n    { id: ${newId}, title: '連立1次不等式 (数直線)', type: 'simultaneous_linear' }$1`);
    
    // Add to render switch
    const switchCase = `
      case 'simultaneous_linear':
        return <SimultaneousLinearInequalitiesViz />;`;
        
    content = content.replace(/(default:\n\s*return)/, `${switchCase}\n      $1`);
    
    fs.writeFileSync(pagePath, content);
    console.log(`Updated ${pagePath} with new level ${newId}`);
} else {
    console.log('Level already exists in page.tsx');
}
