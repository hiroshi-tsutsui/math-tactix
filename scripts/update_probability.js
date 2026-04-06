const fs = require('fs');

let content = fs.readFileSync('app/probability/page.tsx', 'utf8');

if (!content.includes('level === 7')) {
  content = content.replace(
    /\{level === 6 && \(\s*<main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">\s*<ShortestPathViz \/>\s*<\/main>\s*\)\}/,
    `{level === 6 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <ShortestPathViz />
          </main>
      )}
      {level === 7 && (
          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 p-6">
              <CombinationRepetitionViz />
          </main>
      )}`
  );
}

if (!content.includes('Level 7: 重複組合せ')) {
  content = content.replace('{ id: 6, title: "Level 6: 最短経路の数 (Shortest Paths)", desc: "格子状の道を進む最短経路", icon: Activity },', '{ id: 6, title: "Level 6: 最短経路の数 (Shortest Paths)", desc: "格子状の道を進む最短経路", icon: Activity },\n                      { id: 7, title: "Level 7: 重複組合せ (nHr)", desc: "〇と｜の順列と方程式の解", icon: Circle },');
}

fs.writeFileSync('app/probability/page.tsx', content);
console.log("Updated page.tsx with level 7");
