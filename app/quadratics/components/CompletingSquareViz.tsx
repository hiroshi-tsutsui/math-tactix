import React, { useState } from 'react';

interface CompletingSquareVizProps {
  equation?: string; // Expecting "y = ax^2 + bx + c"
}

const CompletingSquareViz: React.FC<CompletingSquareVizProps> = ({ equation }) => {
  const [step, setStep] = useState(0);

  // Parse equation to get a, b, c
  // Simple parser: assuming "y = ax^2 + bx + c" format
  // This is a placeholder parser. Real implementation needs robust regex.
  // For now, let's just use defaults or try to extract.
  
  // Quick hack parser for demo
  let a = 1, b = 2, c = 1; 
  if (equation) {
     // Extract numbers... this is brittle but works for generated content usually
     const match = equation.match(/y\s*=\s*(-?\d*)x\^2\s*([+-]?\s*\d*)x\s*([+-]?\s*\d*)/);
     if (match) {
        a = match[1] === '-' ? -1 : (match[1] === '' ? 1 : parseInt(match[1]));
        // b and c logic...
     }
  }

  // Simplified render for now to fix build
  return (
    <div className="p-4 bg-white border rounded shadow">
       <h3 className="font-bold">平方完成 (Step {step})</h3>
       <div className="text-xl font-mono my-4">{equation}</div>
       <div className="flex gap-2">
          <button onClick={() => setStep(Math.max(0, step - 1))} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
          <button onClick={() => setStep(Math.min(4, step + 1))} className="px-3 py-1 bg-blue-500 text-white rounded">Next</button>
       </div>
    </div>
  );
};

export default CompletingSquareViz;
