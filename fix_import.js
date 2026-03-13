const fs = require('fs');
let content = fs.readFileSync('app/trig_ratios/page.tsx', 'utf8');
content = content.replace(
    "import React, { useState",
    "import ConeShortestPathViz from '../../components/ConeShortestPathViz';\nimport React, { useState"
);
fs.writeFileSync('app/trig_ratios/page.tsx', content);
