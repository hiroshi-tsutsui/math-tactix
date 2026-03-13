const fs = require('fs');

const PAGE_FILE = 'app/math_i_numbers/page.tsx';
let content = fs.readFileSync(PAGE_FILE, 'utf8');

// Add import if missing
if (!content.includes('ValueAbsoluteViz')) {
    const importStatement = `import ValueAbsoluteViz from '@/components/ValueAbsoluteViz';\n`;
    content = content.replace(/(import .*?;)/, `$1\n${importStatement}`);
}

// Ensure the level exists
if (!content.includes('絶対値を含む式の値')) {
    // Add to level array
    const newLevel = `
      {
        id: "value_absolute",
        title: "絶対値を含む式の値",
        description: "aの値に応じて絶対値|a - 5|を外す過程を視覚化します。",
        component: <ValueAbsoluteViz />,
        type: "visualization"
      },`;
    
    // Find the end of the initial array and inject
    content = content.replace(/(const LEVELS\s*=\s*\[[^]*?)(\n\s*\];)/, `$1,${newLevel}$2`);
    fs.writeFileSync(PAGE_FILE, content);
    console.log("Added ValueAbsoluteViz to page.tsx");
} else {
    console.log("ValueAbsoluteViz already exists.");
}
