const fs = require('fs');
const path = './app/data/page.tsx';
let code = fs.readFileSync(path, 'utf8');

const level8Def = `{
      id: 8,
      targetR: 0,
      name: '共分散と散布図の象限',
      desc: '散布図の四分面と共分散の符号の関係',
      logStart: '散布図シミュレータ起動',
      logGuide: '偏差の面積を確認してください。'
    }`;
    
const level9Def = `{
      id: 9,
      targetR: 0,
      name: '外れ値と代表値',
      desc: '極端な値（外れ値）が平均値と中央値に与える影響の強さ（ロバスト性）',
      logStart: '外れ値シミュレータ起動',
      logGuide: '6人目の点数を操作して平均値と中央値の動きを比較してください。'
    }`;

if (code.includes(level8Def)) {
  code = code.replace(level8Def, level8Def + ',\n    ' + level9Def);
}

// Progress logic
const p7 = `if (progress.includes(7)) nextLvl = 8;`;
const p8 = `if (progress.includes(8)) nextLvl = 9;`;

if (code.includes(p7) && !code.includes(p8)) {
  code = code.replace(p7, p7 + '\n    ' + p8);
}

fs.writeFileSync(path, code);
