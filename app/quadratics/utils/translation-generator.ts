export interface TranslationProblem {
  id: string;
  type: 'translation';
  question: string;
  original: { a: number; p: number; q: number }; // y = a(x-p)^2 + q
  shift: { dx: number; dy: number };
  answer: { p: number; q: number }; // New vertex
  answerString: string; // The formatted string for matching
  options: string[]; // Multiple choice options (standard form or vertex form)
}

export class TranslationGenerator {
  static generate(level: number = 1): TranslationProblem {
    // Basic setup: a(x-p)^2 + q
    const a = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const p = Math.floor(Math.random() * 5) - 2; // -2 to 2
    const q = Math.floor(Math.random() * 5) - 2; // -2 to 2

    // Shift vector
    const dx = Math.floor(Math.random() * 4) - 2; // -2 to 2
    const dy = Math.floor(Math.random() * 4) - 2; // -2 to 2

    // Avoid zero shift for meaningful problems
    if (dx === 0 && dy === 0) return this.generate(level);

    const newP = p + dx;
    const newQ = q + dy;

    const question = `放物線 $y = ${formatEquation(a, p, q)}$ を $x$軸方向に $${dx}$, $y$軸方向に $${dy}$ だけ平行移動した放物線の方程式を求めよ。`;

    // Generate options (correct + 3 distractors)
    const correct = formatEquation(a, newP, newQ);
    const distractors = new Set<string>();
    distractors.add(correct);

    while (distractors.size < 4) {
      // Wrong sign logic
      const wrongP = newP + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      const wrongQ = newQ + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      distractors.add(formatEquation(a, wrongP, wrongQ));
    }

    return {
      id: `trans-${Date.now()}`,
      type: 'translation',
      question,
      original: { a, p, q },
      shift: { dx, dy },
      answer: { p: newP, q: newQ },
      answerString: correct,
      options: Array.from(distractors).sort(() => Math.random() - 0.5),
    };
  }
}

export function generateTranslationProblem(level: number = 1): TranslationProblem {
  return TranslationGenerator.generate(level);
}

function formatEquation(a: number, p: number, q: number): string {
  // y = a(x-p)^2 + q
  let xPart = '';
  if (p === 0) {
    if (a === 1) xPart = 'x^2';
    else if (a === -1) xPart = '-x^2';
    else xPart = `${a}x^2`;
  } else {
    const aStr = a === 1 ? '' : a === -1 ? '-' : a.toString();
    const pSign = p > 0 ? '-' : '+';
    xPart = `${aStr}(x ${pSign} ${Math.abs(p)})^2`;
  }

  let qPart = '';
  if (q !== 0) {
    const qSign = q > 0 ? '+' : '-';
    qPart = ` ${qSign} ${Math.abs(q)}`;
  }

  return `y = ${xPart}${qPart}`;
}
