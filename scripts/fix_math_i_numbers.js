const fs = require('fs');
const file = 'app/math_i_numbers/page.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('ExpansionSubstitutionViz')) {
  // Import
  const importStatement = "import ExpansionSubstitutionViz from './components/ExpansionSubstitutionViz';\n";
  code = code.replace("import FormulaValuesViz from './components/FormulaValuesViz';", "import FormulaValuesViz from './components/FormulaValuesViz';\n" + importStatement);

  // Add to levels
  const level31 = "  { id: 31, title: '展開の工夫 (置き換え)', type: 'expansion_substitution' },\n";
  code = code.replace("  ];\n\n  return (", level31 + "  ];\n\n  return (");

  // Add to switch
  const switchCase = `      case 'expansion_substitution':
        return <ExpansionSubstitutionViz />;
`;
  code = code.replace("      default:", switchCase + "      default:");

  fs.writeFileSync(file, code);
  console.log("Updated page.tsx");
} else {
  console.log("Already updated");
}
