const fs = require('fs');
const jaPath = require('path').join(__dirname, 'locales/ja.json');
const enPath = require('path').join(__dirname, 'locales/en.json');

const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
ja.modules.data.levels["4"] = {
  name: "仮説検定の考え方",
  desc: "偶然起こったことなのか、それとも意味がある違いなのか。有意水準5%で判定します。",
  log_start: "仮説検定シミュレーションを開始します",
  log_guide: "コイントスを実行して有意性を判定してください"
};
fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2));

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en.modules.data.levels["4"] = {
  name: "Hypothesis Testing",
  desc: "Is it a coincidence, or a meaningful difference? Determine significance at 5%.",
  log_start: "Starting hypothesis test simulation",
  log_guide: "Perform coin tosses to check significance."
};
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

console.log('Successfully patched both JSONs.');
