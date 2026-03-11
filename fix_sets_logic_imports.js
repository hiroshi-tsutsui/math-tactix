const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'app', 'sets_logic', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

if (!content.includes('SetMaxMinViz')) {
  content = content.replace(/(import katex from 'katex';)/, "$1\nimport SetMaxMinViz from '../components/math/SetMaxMinViz';\nimport ConditionNumberLineViz from '../components/math/ConditionNumberLineViz';");
}

const level7str = '{ id: 7, title: "Level 7: 集合の要素の最大・最小", desc: "共通部分の範囲と限界", icon: Calculator },';
const level8str = '{ id: 8, title: "Level 8: 必要条件・十分条件と数直線", desc: "範囲と包含関係", icon: Search }';

if (!content.includes('Level 7: 集合の要素')) {
  content = content.replace(
    /\{ id: 6, title: "Level 6: 連立不等式と集合", desc: "共通範囲と整数解の個数を視覚化", icon: Search \}/,
    `{ id: 6, title: "Level 6: 連立不等式と集合", desc: "共通範囲と整数解の個数を視覚化", icon: Search },\n                      ${level7str}\n                      ${level8str}`
  );
}

if (!content.includes('<SetMaxMinViz />')) {
  content = content.replace(
    /\{level === 6 && \(\s*<QuadraticSetsViz \/>\s*\)\}/,
    `{level === 6 && (\n          <QuadraticSetsViz />\n      )}\n\n      {level === 7 && (\n          <SetMaxMinViz />\n      )}\n\n      {level === 8 && (\n          <ConditionNumberLineViz />\n      )}`
  );
}

fs.writeFileSync(pagePath, content);
console.log("Updated sets_logic/page.tsx successfully.");
