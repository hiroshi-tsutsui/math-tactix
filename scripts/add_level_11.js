const fs = require('fs');
let content = fs.readFileSync('app/probability/page.tsx', 'utf-8');

const level10BlockEnd = content.indexOf('</main>', content.indexOf('level === 10 && (')) + 7;
const blockSuffix = content.substring(level10BlockEnd, level10BlockEnd + 15);

const level11Block = `
      )}
      {level === 11 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
             <GroupingViz />
          </main>
`;

content = content.slice(0, level10BlockEnd) + level11Block + content.slice(level10BlockEnd + 7);
fs.writeFileSync('app/probability/page.tsx', content);
