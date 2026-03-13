const fs = require('fs');
const file = 'app/probability/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const level10Block = `      {level === 10 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <IndistinguishablePermutationViz />
          </main>
      )}
    </div>`;

content = content.replace(/    <\/div>\s*?\)\s*?;\s*?\}\s*?$/, level10Block + '\n  );\n}\n');
fs.writeFileSync(file, content);
