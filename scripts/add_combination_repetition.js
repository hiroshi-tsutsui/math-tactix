const fs = require('fs');

let content = fs.readFileSync('app/probability/page.tsx', 'utf8');

// Add import
if (!content.includes('CombinationRepetitionViz')) {
  content = content.replace("import ShortestPathViz from './components/ShortestPathViz';", "import ShortestPathViz from './components/ShortestPathViz';\nimport { CombinationRepetitionViz } from './components/CombinationRepetitionViz';");
}

// Add to levels list
if (!content.includes('Level 7: 重複組合せ')) {
  content = content.replace('{ id: 6, title: "Level 6: 最短経路の数 (Shortest Paths)", desc: "格子状の道を進む最短経路", icon: Activity },', '{ id: 6, title: "Level 6: 最短経路の数 (Shortest Paths)", desc: "格子状の道を進む最短経路", icon: Activity },\n                      { id: 7, title: "Level 7: 重複組合せ (nHr)", desc: "〇と｜の順列と方程式の解", icon: Circle },');
}

// Add to switch
if (!content.includes('case 7:')) {
  const case6 = `case 6:
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <ShortestPathViz />
          </div>
        );`;
  
  const case7 = `case 7:
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <CombinationRepetitionViz />
          </div>
        );`;

  content = content.replace(case6, case6 + '\n      ' + case7);
}

fs.writeFileSync('app/probability/page.tsx', content);
console.log("Updated page.tsx");
