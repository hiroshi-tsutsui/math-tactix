const fs = require('fs');
const file = 'app/probability/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const titleLogic = `        <div className="font-bold text-sm">
            {level === 0 ? "場合の数と確率 (Probability)" : 
             level === 1 ? "順列 (Permutations)" : 
             level === 2 ? "組合せ (Combinations)" : 
             level === 3 ? "条件付き確率 (Conditional Probability)" :
             level === 4 ? "反復試行の確率" :
             level === 5 ? "最大値の確率" :
             level === 6 ? "最短経路の数" :
             level === 7 ? "重複組合せ" :
             level === 8 ? "円順列" :
             level === 9 ? "じゅず順列" :
             level === 10 ? "同じものを含む順列" :
             "Probability"}
        </div>`;

const regex = /<div className="font-bold text-sm">[\s\S]*?<\/div>/;
content = content.replace(regex, titleLogic);
fs.writeFileSync(file, content);
