const fs = require('fs');
let content = fs.readFileSync('components/ConeShortestPathViz.tsx', 'utf8');

content = content.replace(
  '$2\\pi r = 2\\pi l \\times \\frac{\\theta}{360^\\circ}$ より、',
  '{"$2\\\\pi r = 2\\\\pi l \\\\times \\\\frac{\\\\theta}{360^\\\\circ}$ より、"}'
);
content = content.replace(
  '<strong>$\\theta = 360^\\circ \\times \\frac{r}{l} = {thetaDeg.toFixed(1)}^\\circ$</strong>',
  '<strong>{"$\\\\theta = 360^\\\\circ \\\\times \\\\frac{r}{l} = " + thetaDeg.toFixed(1) + "^\\\\circ$"}</strong>'
);
content = content.replace(
  '$AA\'^2 = {l}^2 + {l}^2 - 2 \\cdot {l} \\cdot {l} \\cos({thetaDeg.toFixed(1)}^\\circ)$',
  '{"$AA\'^2 = " + l + "^2 + " + l + "^2 - 2 \\\\cdot " + l + " \\\\cdot " + l + " \\\\cos(" + thetaDeg.toFixed(1) + "^\\\\circ)$"}'
);
content = content.replace(
  'Mは中心角を二等分する直線上にあるため、間の角は $\\frac{\\theta}{2} = {(thetaDeg / 2).toFixed(1)}^\\circ$ となります。<br/>',
  '{"Mは中心角を二等分する直線上にあるため、間の角は $\\\\frac{\\\\theta}{2} = " + (thetaDeg / 2).toFixed(1) + "^\\\\circ$ となります。"}<br/>'
);
content = content.replace(
  '$AM^2 = {l}^2 + {(l/2).toFixed(1)}^2 - 2 \\cdot {l} \\cdot {(l/2).toFixed(1)} \\cos({(thetaDeg / 2).toFixed(1)}^\\circ)$',
  '{"$AM^2 = " + l + "^2 + " + (l/2).toFixed(1) + "^2 - 2 \\\\cdot " + l + " \\\\cdot " + (l/2).toFixed(1) + " \\\\cos(" + (thetaDeg / 2).toFixed(1) + "^\\\\circ)$"}'
);
fs.writeFileSync('components/ConeShortestPathViz.tsx', content);
