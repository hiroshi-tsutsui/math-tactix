const fs = require('fs');
const path = './app/probability/page.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('ShortestPathViz')) {
  content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport ShortestPathViz from './components/ShortestPathViz';");
}

if (!content.includes('Level 6: 最短経路の数')) {
  content = content.replace(
    '{ id: 5, title: "Level 5: 最大値の確率"', 
    '{ id: 6, title: "Level 6: 最短経路の数 (Shortest Paths)", desc: "格子状の道を進む最短経路", icon: Activity },\n                      { id: 5, title: "Level 5: 最大値の確率"'
  );
}

const level5Block = content.match(/{state\.level === 5 && \([\s\S]+?\}\)/);
if (level5Block && !content.includes('{state.level === 6 && (')) {
  const newBlock = `
            {state.level === 6 && (
              <motion.div 
                key="level6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200/60"
              >
                <ShortestPathViz />
              </motion.div>
            )}
`;
  content = content.replace(level5Block[0], level5Block[0] + newBlock);
}

fs.writeFileSync(path, content, 'utf8');
