const fs = require('fs');

const path = 'app/quadratics/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import if missing
if (!content.includes('AbsoluteInequalityAllRealsViz')) {
  content = content.replace(
    /(import .*;\n)(?!import )/,
    `$1import AbsoluteInequalityAllRealsViz from '../../components/AbsoluteInequalityAllRealsViz';\n`
  );
}

// 2. Add to side menu
if (!content.includes('すべての実数で成り立つ2次不等式')) {
  const btnMatch = content.match(/<button[^>]*onClick=\{\(\) => setCurrentLevel\(66\)\}[^>]*>[\s\S]*?<\/button>/);
  if (btnMatch) {
    const newBtn = `
          <button
            onClick={() => setCurrentLevel(67)}
            className={\`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 \${
              currentLevel === 67 
                ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm'
            }\`}
          >
            <div className={\`w-8 h-8 rounded-lg flex items-center justify-center mr-3 font-bold \${
              currentLevel === 67 ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
            }\`}>
              67
            </div>
            <div>
              <div className="font-bold text-sm">絶対不等式</div>
              <div className={\`text-xs mt-0.5 \${currentLevel === 67 ? 'text-blue-100' : 'text-gray-500'}\`}>すべての実数で成り立つ</div>
            </div>
          </button>`;
    content = content.replace(btnMatch[0], btnMatch[0] + newBtn);
  }
}

// 3. Add to rendering main
if (!content.includes('currentLevel === 67')) {
  content = content.replace(
    /\{currentLevel === 66 && <IntegerRootsQuadraticViz \/>\}/,
    `{currentLevel === 66 && <IntegerRootsQuadraticViz />}\n        {currentLevel === 67 && <AbsoluteInequalityAllRealsViz />}`
  );
}

fs.writeFileSync(path, content);
console.log('Patched');
