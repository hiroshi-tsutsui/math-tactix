const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'app/math_i_numbers/page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

content = content.replace(
    "$x = \\\\frac{1 + \\\\sqrt{5}}{2}$ のような値を高次式に代入する際、直接代入せず、2次方程式を作って次数を下げる（割り算を利用する）テクニックを視覚化します。",
    "x = (1 + √5)/2 のような無理数の値を高次式に代入する際、直接代入せず、2次方程式を作って次数を下げる（割り算を利用する）テクニックを視覚化します。"
);

content = content.replace(
    "$x = \\frac{1 + \\sqrt{5}}{2}$ のような値を高次式に代入する際、直接代入せず、2次方程式を作って次数を下げる（割り算を利用する）テクニックを視覚化します。",
    "x = (1 + √5)/2 のような無理数の値を高次式に代入する際、直接代入せず、2次方程式を作って次数を下げる（割り算を利用する）テクニックを視覚化します。"
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Fixed latex error.');
