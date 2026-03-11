const fs = require('fs');
const file = './app/sets_logic/page.tsx';
let data = fs.readFileSync(file, 'utf8');

if (!data.includes('CounterexampleViz')) {
  data = data.replace('import ThreeSetsViz from "@/app/components/math/ThreeSetsViz";', 'import ThreeSetsViz from "@/app/components/math/ThreeSetsViz";\nimport CounterexampleViz from "../components/math/CounterexampleViz";');

  data = data.replace('{level === 9 && (\n          <ThreeSetsViz />\n      )}', '{level === 9 && (\n          <ThreeSetsViz />\n      )}\n\n      {level === 10 && (\n          <CounterexampleViz />\n      )}');

  data = data.replace('{ id: 9, title: "Level 9: 3つの集合の要素の個数", desc: "3つの集合の和集合と共通部分", icon: Calculator }', '{ id: 9, title: "Level 9: 3つの集合の要素の個数", desc: "3つの集合の和集合と共通部分", icon: Calculator }, { id: 10, title: "Level 10: 命題の真偽と反例", desc: "P ならば Q の真偽と反例の視覚化", icon: Search }');

  data = data.replace('level === 5 ? "背理法の証明" : "連立不等式と集合"}', 'level === 5 ? "背理法の証明" : level === 6 ? "連立不等式と集合" : level === 7 ? "集合の要素の最大・最小" : level === 8 ? "必要条件・十分条件と数直線" : level === 9 ? "3つの集合の要素の個数" : "命題の真偽と反例"}');
  
  fs.writeFileSync(file, data);
  console.log('Level 10 added successfully');
} else {
  console.log('CounterexampleViz already present');
}
