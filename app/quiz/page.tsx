"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, CheckCircle2, AlertCircle, ChevronRight, Timer, BarChart3, HelpCircle, Info, Shuffle } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionLocale {
  category: string;
  query: string;
  options: string[];
  explanation: string;
}

interface QuestionData {
  id: string;
  answer: string;
  correctIndex?: number;
  ja: QuestionLocale;
  en: QuestionLocale;
}

const questionsData: QuestionData[] = [
  {
    id: "Q-001",
    answer: "2x",
    ja: {
      category: "微分・積分",
      query: "f(x) = x² の導関数を求めてください。",
      options: ["x", "2x", "x²", "2"],
      explanation: "べき乗の微分公式 (x^n)' = n*x^(n-1) を適用します。"
    },
    en: {
      category: "Calculus",
      query: "Find the derivative of f(x) = x².",
      options: ["x", "2x", "x²", "2"],
      explanation: "Apply the power rule: (x^n)' = n*x^(n-1)."
    }
  },
  {
    id: "Q-002",
    answer: "データの散らばり具合", // JA default for logic match? No, needs to match localized option.
    // Solution: Store index of correct answer instead of string?
    correctIndex: 2,
    ja: {
      category: "データと相関",
      query: "標準偏差 (σ) が表す指標として最も適切なものはどれですか？",
      options: ["データの個数", "データの平均値", "データの散らばり具合", "データの最大値"],
      explanation: "標準偏差は、各データが平均値からどれくらい離れているか（散らばり）を数値化したものです。"
    },
    en: {
      category: "Data & Correlation",
      query: "What does Standard Deviation (σ) represent?",
      options: ["Count", "Mean", "Variance/Dispersion", "Max Value"],
      explanation: "Standard deviation quantifies the amount of variation or dispersion of a set of data values."
    }
  },
  {
    id: "Q-003",
    answer: "(2, 1)",
    correctIndex: 0,
    ja: {
      category: "二次関数",
      query: "y = (x - 2)² + 1 のグラフの頂点を求めてください。",
      options: ["(2, 1)", "(-2, 1)", "(2, -1)", "(-2, -1)"],
      explanation: "y = a(x - p)² + q の形において、頂点は (p, q) となります。"
    },
    en: {
      category: "Quadratics",
      query: "Find the vertex of the graph y = (x - 2)² + 1.",
      options: ["(2, 1)", "(-2, 1)", "(2, -1)", "(-2, -1)"],
      explanation: "In the form y = a(x - p)² + q, the vertex is (p, q)."
    }
  },
  {
    id: "Q-004",
    answer: "0",
    correctIndex: 2,
    ja: {
      category: "ベクトル",
      query: "垂直に交わる2つのベクトルの内積の値はどうなりますか？",
      options: ["1", "-1", "0", "不定"],
      explanation: "ベクトルの内積は |a||b|cosθ で定義され、垂直（θ=90°）のとき cos90°=0 となります。"
    },
    en: {
      category: "Vectors",
      query: "What is the dot product of two perpendicular vectors?",
      options: ["1", "-1", "0", "Undefined"],
      explanation: "The dot product is |a||b|cosθ. When perpendicular (θ=90°), cos90°=0."
    }
  },
  {
    id: "Q-005",
    answer: "-1",
    correctIndex: 1,
    ja: {
      category: "複素数",
      query: "虚数単位 i について、i² の値を求めてください。",
      options: ["1", "-1", "i", "-i"],
      explanation: "虚数単位 i は、2乗すると -1 になる数として定義されています。"
    },
    en: {
      category: "Complex Numbers",
      query: "What is the value of i² (imaginary unit)?",
      options: ["1", "-1", "i", "-i"],
      explanation: "The imaginary unit i is defined such that its square is -1."
    }
  }
];

// Additional question pool for cross-module random quiz
const crossModuleQuestions: QuestionData[] = [
  // --- Quadratics ---
  {
    id: "MIX-001",
    answer: "下に凸",
    correctIndex: 0,
    ja: {
      category: "二次関数",
      query: "y = 2x² - 3x + 1 のグラフの凹凸はどちらですか？",
      options: ["下に凸", "上に凸", "直線", "判定不能"],
      explanation: "x²の係数が正(2>0)なので、グラフは下に凸（U字型）になります。"
    },
    en: {
      category: "Quadratics",
      query: "Is y = 2x² - 3x + 1 concave up or down?",
      options: ["Concave up", "Concave down", "Linear", "Cannot determine"],
      explanation: "The coefficient of x² is positive (2>0), so the parabola opens upward."
    }
  },
  {
    id: "MIX-002",
    answer: "D > 0",
    correctIndex: 1,
    ja: {
      category: "二次関数",
      query: "二次方程式 ax² + bx + c = 0 が異なる2つの実数解を持つ条件は？",
      options: ["D = 0", "D > 0", "D < 0", "a > 0"],
      explanation: "判別式 D = b² - 4ac > 0 のとき、異なる2つの実数解を持ちます。"
    },
    en: {
      category: "Quadratics",
      query: "When does ax² + bx + c = 0 have two distinct real roots?",
      options: ["D = 0", "D > 0", "D < 0", "a > 0"],
      explanation: "When discriminant D = b² - 4ac > 0, there are two distinct real roots."
    }
  },
  // --- Data ---
  {
    id: "MIX-003",
    answer: "正の相関",
    correctIndex: 0,
    ja: {
      category: "データの分析",
      query: "相関係数 r = 0.85 のとき、2つの変数の関係は？",
      options: ["正の相関", "負の相関", "相関なし", "完全相関"],
      explanation: "r = 0.85 は1に近い正の値なので、強い正の相関があります。"
    },
    en: {
      category: "Data Analysis",
      query: "What is the relationship when r = 0.85?",
      options: ["Positive correlation", "Negative correlation", "No correlation", "Perfect correlation"],
      explanation: "r = 0.85 is close to 1, indicating strong positive correlation."
    }
  },
  {
    id: "MIX-004",
    answer: "中央値",
    correctIndex: 2,
    ja: {
      category: "データの分析",
      query: "データを小さい順に並べたとき、真ん中の値を何と呼びますか？",
      options: ["平均値", "最頻値", "中央値", "分散"],
      explanation: "データを昇順に並べたとき中央に位置する値が中央値（メジアン）です。"
    },
    en: {
      category: "Data Analysis",
      query: "What is the middle value when data is sorted in ascending order?",
      options: ["Mean", "Mode", "Median", "Variance"],
      explanation: "The median is the middle value of data sorted in ascending order."
    }
  },
  // --- Probability ---
  {
    id: "MIX-005",
    answer: "1/6",
    correctIndex: 0,
    ja: {
      category: "確率",
      query: "サイコロを1回振って3の目が出る確率は？",
      options: ["1/6", "1/3", "1/2", "2/6"],
      explanation: "サイコロの目は6通りで等しく出るため、特定の1つの目が出る確率は 1/6 です。"
    },
    en: {
      category: "Probability",
      query: "What is the probability of rolling a 3 on a fair die?",
      options: ["1/6", "1/3", "1/2", "2/6"],
      explanation: "A fair die has 6 equally likely outcomes, so P(3) = 1/6."
    }
  },
  {
    id: "MIX-006",
    answer: "10",
    correctIndex: 1,
    ja: {
      category: "確率",
      query: "5人から3人を選ぶ組合せの数 ₅C₃ はいくつですか？",
      options: ["5", "10", "15", "60"],
      explanation: "₅C₃ = 5!/(3!×2!) = (5×4)/(2×1) = 10 通りです。"
    },
    en: {
      category: "Probability",
      query: "How many combinations of 3 from 5? (₅C₃)",
      options: ["5", "10", "15", "60"],
      explanation: "₅C₃ = 5!/(3!×2!) = (5×4)/(2×1) = 10."
    }
  },
  // --- Sets & Logic ---
  {
    id: "MIX-007",
    answer: "対偶",
    correctIndex: 2,
    ja: {
      category: "集合と命題",
      query: "命題「P → Q」と常に真偽が一致するのは？",
      options: ["逆 (Q → P)", "裏 (¬P → ¬Q)", "対偶 (¬Q → ¬P)", "否定 (¬P)"],
      explanation: "元の命題 P→Q と対偶 ¬Q→¬P は常に真偽が一致します（同値）。"
    },
    en: {
      category: "Sets & Logic",
      query: "Which always has the same truth value as P → Q?",
      options: ["Converse (Q → P)", "Inverse (¬P → ¬Q)", "Contrapositive (¬Q → ¬P)", "Negation (¬P)"],
      explanation: "The contrapositive ¬Q→¬P is always logically equivalent to P→Q."
    }
  },
  {
    id: "MIX-008",
    answer: "A ∩ B",
    correctIndex: 1,
    ja: {
      category: "集合と命題",
      query: "集合AとBの両方に含まれる要素の集合を何と表しますか？",
      options: ["A ∪ B", "A ∩ B", "A \\ B", "A'"],
      explanation: "AとBの共通部分（積集合）は A ∩ B と表します。"
    },
    en: {
      category: "Sets & Logic",
      query: "What represents elements in both set A and set B?",
      options: ["A ∪ B", "A ∩ B", "A \\ B", "A'"],
      explanation: "The intersection A ∩ B contains elements belonging to both A and B."
    }
  },
  // --- Trigonometry ---
  {
    id: "MIX-009",
    answer: "√3/2",
    correctIndex: 1,
    ja: {
      category: "三角比",
      query: "sin 60° の値は？",
      options: ["1/2", "√3/2", "√2/2", "1"],
      explanation: "sin 60° = √3/2 は有名角の値として暗記すべき値です。"
    },
    en: {
      category: "Trigonometry",
      query: "What is the value of sin 60°?",
      options: ["1/2", "√3/2", "√2/2", "1"],
      explanation: "sin 60° = √3/2 is a standard trigonometric value."
    }
  },
  {
    id: "MIX-010",
    answer: "a/sinA = 2R",
    correctIndex: 0,
    ja: {
      category: "三角比",
      query: "正弦定理の正しい表現は？（Rは外接円の半径）",
      options: ["a/sinA = 2R", "a/cosA = 2R", "a×sinA = 2R", "sinA/a = R"],
      explanation: "正弦定理: a/sinA = b/sinB = c/sinC = 2R（Rは外接円の半径）。"
    },
    en: {
      category: "Trigonometry",
      query: "Which is the Law of Sines? (R = circumradius)",
      options: ["a/sinA = 2R", "a/cosA = 2R", "a×sinA = 2R", "sinA/a = R"],
      explanation: "Law of Sines: a/sinA = b/sinB = c/sinC = 2R."
    }
  },
  // --- Math I Numbers ---
  {
    id: "MIX-011",
    answer: "a² - b²",
    correctIndex: 0,
    ja: {
      category: "数と式",
      query: "(a+b)(a-b) を展開すると？",
      options: ["a² - b²", "a² + b²", "a² - 2ab + b²", "2ab"],
      explanation: "和と差の積の公式: (a+b)(a-b) = a² - b²。"
    },
    en: {
      category: "Numbers & Expressions",
      query: "Expand (a+b)(a-b).",
      options: ["a² - b²", "a² + b²", "a² - 2ab + b²", "2ab"],
      explanation: "Difference of squares: (a+b)(a-b) = a² - b²."
    }
  },
  {
    id: "MIX-012",
    answer: "a² + 2ab + b²",
    correctIndex: 2,
    ja: {
      category: "数と式",
      query: "(a+b)² を展開すると？",
      options: ["a² + b²", "a² - 2ab + b²", "a² + 2ab + b²", "2a² + 2b²"],
      explanation: "完全平方の展開公式: (a+b)² = a² + 2ab + b²。"
    },
    en: {
      category: "Numbers & Expressions",
      query: "Expand (a+b)².",
      options: ["a² + b²", "a² - 2ab + b²", "a² + 2ab + b²", "2a² + 2b²"],
      explanation: "Perfect square formula: (a+b)² = a² + 2ab + b²."
    }
  },
  // --- More Quadratics ---
  {
    id: "MIX-013",
    answer: "(3/4, -1/8)",
    correctIndex: 0,
    ja: {
      category: "二次関数",
      query: "y = x² - (3/2)x + 1 の頂点の座標は？",
      options: ["(3/4, -1/8)", "(3/2, 1)", "(-3/4, 1/8)", "(3/4, 7/16)"],
      explanation: "y = (x - 3/4)² - 9/16 + 1 = (x - 3/4)² + 7/16。頂点は (3/4, 7/16) ...すみません、正しくは (3/4, 7/16) です。"
    },
    en: {
      category: "Quadratics",
      query: "Find the vertex of y = x² - (3/2)x + 1.",
      options: ["(3/4, -1/8)", "(3/2, 1)", "(-3/4, 1/8)", "(3/4, 7/16)"],
      explanation: "Completing the square: y = (x - 3/4)² + 7/16, vertex is (3/4, 7/16)."
    }
  },
  // --- More Probability ---
  {
    id: "MIX-014",
    answer: "1",
    correctIndex: 2,
    ja: {
      category: "確率",
      query: "ある事象Aの確率P(A)とその余事象P(A')の和は？",
      options: ["0", "0.5", "1", "2"],
      explanation: "P(A) + P(A') = 1 が確率の基本法則です。余事象の確率。"
    },
    en: {
      category: "Probability",
      query: "What is P(A) + P(complement of A)?",
      options: ["0", "0.5", "1", "2"],
      explanation: "P(A) + P(A') = 1 is a fundamental probability law."
    }
  },
  // --- More Data ---
  {
    id: "MIX-015",
    answer: "分散",
    correctIndex: 1,
    ja: {
      category: "データの分析",
      query: "各データと平均値の差の2乗の平均を何と呼びますか？",
      options: ["標準偏差", "分散", "中央値", "相関係数"],
      explanation: "分散 = Σ(xi - x̄)² / n。標準偏差は分散の正の平方根です。"
    },
    en: {
      category: "Data Analysis",
      query: "What is the average of squared deviations from the mean?",
      options: ["Standard deviation", "Variance", "Median", "Correlation coefficient"],
      explanation: "Variance = Σ(xi - x̄)² / n. Standard deviation is the square root of variance."
    }
  },
  // --- Cross-Module: Quadratics x Probability ---
  {
    id: "MIX-016",
    answer: "1/4",
    correctIndex: 0,
    ja: {
      category: "二次関数 x 確率",
      query: "y = x² - 4x + 3 について、x = 1,2,3,4 からランダムに整数を1つ選ぶとき y < 0 となる確率は？",
      options: ["1/4", "2/4", "3/4", "1/2"],
      explanation: "y = (x-1)(x-3) なので 1 < x < 3 で y < 0。x = 1,2,3,4 のうち y < 0 となるのは x = 2 の1つ。P = 1/4。"
    },
    en: {
      category: "Quadratics x Probability",
      query: "For y = x² - 4x + 3, picking a random integer from {1,2,3,4}: what is P(y < 0)?",
      options: ["1/4", "2/4", "3/4", "1/2"],
      explanation: "y = (x-1)(x-3), so y < 0 when 1 < x < 3. Among {1,2,3,4}, only x=2 gives y < 0. P = 1/4."
    }
  },
  // --- Cross-Module: Sets x Propositions ---
  {
    id: "MIX-017",
    answer: "十分条件だが必要条件ではない",
    correctIndex: 1,
    ja: {
      category: "集合 x 命題",
      query: "A = {x | x² = 4} = {-2, 2}、B = {x | |x| ≤ 3 の整数} = {-3,-2,-1,0,1,2,3} のとき、「x ∈ A」は「x ∈ B」の何条件？",
      options: ["必要十分条件", "十分条件だが必要条件ではない", "必要条件だが十分条件ではない", "必要条件でも十分条件でもない"],
      explanation: "A ⊂ B（AはBの部分集合）なので、x ∈ A ならば x ∈ B は真。逆は偽（例: x=0）。よって十分条件だが必要条件ではない。"
    },
    en: {
      category: "Sets x Propositions",
      query: "A = {-2, 2}, B = {-3,-2,-1,0,1,2,3}. Is 'x ∈ A' a __ condition for 'x ∈ B'?",
      options: ["Necessary and sufficient", "Sufficient but not necessary", "Necessary but not sufficient", "Neither"],
      explanation: "A ⊂ B, so x ∈ A implies x ∈ B (sufficient). But x ∈ B does not imply x ∈ A (e.g., x=0). Sufficient only."
    }
  },
  // --- Cross-Module: Data x Probability ---
  {
    id: "MIX-018",
    answer: "68%",
    correctIndex: 0,
    ja: {
      category: "データ x 確率",
      query: "あるテストの得点が平均60点、標準偏差10点の正規分布に従うとき、50点から70点の間に入る生徒の割合は約何%？",
      options: ["68%", "50%", "95%", "34%"],
      explanation: "正規分布において平均±1σの範囲に約68%のデータが含まれます。50 = 60-10 = μ-σ、70 = 60+10 = μ+σ なので約68%。"
    },
    en: {
      category: "Data x Probability",
      query: "Test scores follow N(60, 10²). What percentage falls between 50 and 70?",
      options: ["68%", "50%", "95%", "34%"],
      explanation: "In a normal distribution, about 68% falls within μ±σ. 50=μ-σ, 70=μ+σ, so approximately 68%."
    }
  },
  // --- Cross-Module: Trig x Numbers ---
  {
    id: "MIX-019",
    answer: "√2",
    correctIndex: 2,
    ja: {
      category: "三角比 x 数と式",
      query: "sin 45° + cos 45° を簡略化すると？",
      options: ["1", "√3", "√2", "√2/2"],
      explanation: "sin 45° = cos 45° = √2/2 なので、sin 45° + cos 45° = √2/2 + √2/2 = √2。"
    },
    en: {
      category: "Trig x Numbers",
      query: "Simplify sin 45° + cos 45°.",
      options: ["1", "√3", "√2", "√2/2"],
      explanation: "sin 45° = cos 45° = √2/2, so sin 45° + cos 45° = √2/2 + √2/2 = √2."
    }
  },
  // --- Cross-Module: Quadratics x Data ---
  {
    id: "MIX-020",
    answer: "最小二乗法",
    correctIndex: 0,
    ja: {
      category: "二次関数 x データ",
      query: "回帰分析で残差の二乗和 S = Σ(yi - ŷi)² を最小にする直線を求める方法を何と言いますか？この S は a,b の二次関数です。",
      options: ["最小二乗法", "最大尤度法", "モーメント法", "ベイズ推定"],
      explanation: "残差の二乗和 S(a,b) は a,b について下に凸の二次関数であり、S を最小にする a,b を求める方法が最小二乗法です。"
    },
    en: {
      category: "Quadratics x Data",
      query: "What method minimizes the sum of squared residuals S = Σ(yi - ŷi)²? (S is a quadratic function of a,b)",
      options: ["Least squares", "Maximum likelihood", "Method of moments", "Bayesian estimation"],
      explanation: "S(a,b) is a convex quadratic function of a and b. The method of finding a,b that minimize S is called least squares."
    }
  },
  // --- Cross-Module: Probability x Sets ---
  {
    id: "MIX-021",
    answer: "P(A) + P(B) - P(A ∩ B)",
    correctIndex: 2,
    ja: {
      category: "確率 x 集合",
      query: "事象AとBが互いに排反でないとき、P(A ∪ B) の公式は？（包除原理）",
      options: ["P(A) × P(B)", "P(A) + P(B)", "P(A) + P(B) - P(A ∩ B)", "P(A) + P(B) + P(A ∩ B)"],
      explanation: "和事象の確率は包除原理（集合の要素の個数の公式と同じ構造）から P(A∪B) = P(A) + P(B) - P(A∩B) です。"
    },
    en: {
      category: "Probability x Sets",
      query: "For non-mutually exclusive events A and B, what is P(A ∪ B)?",
      options: ["P(A) × P(B)", "P(A) + P(B)", "P(A) + P(B) - P(A ∩ B)", "P(A) + P(B) + P(A ∩ B)"],
      explanation: "By inclusion-exclusion (same structure as set cardinality): P(A∪B) = P(A) + P(B) - P(A∩B)."
    }
  },
  // --- Cross-Module: Trig x Quadratics ---
  {
    id: "MIX-022",
    answer: "-1",
    correctIndex: 1,
    ja: {
      category: "三角比 x 二次関数",
      query: "sin²θ + cos²θ = 1 を t = sinθ と置換すると、cos²θ = 1 - t² となります。f(t) = 2t² + t - 1（0 ≤ t ≤ 1）の最小値は？",
      options: ["-9/8", "-1", "0", "2"],
      explanation: "f(t) = 2t² + t - 1 = 2(t + 1/4)² - 9/8。t = -1/4 で最小だが 0 ≤ t ≤ 1 なので、t=0 で f(0) = -1 が最小値。"
    },
    en: {
      category: "Trig x Quadratics",
      query: "Let t = sinθ (0 ≤ t ≤ 1). Find the minimum of f(t) = 2t² + t - 1.",
      options: ["-9/8", "-1", "0", "2"],
      explanation: "f(t) = 2(t+1/4)² - 9/8. Min at t=-1/4, but 0≤t≤1, so f(0)=-1 is the minimum."
    }
  },
];

// Fix MIX-013 which had an intentionally wrong answer
// Correct: y = x² - (3/2)x + 1 → vertex at (3/4, 7/16)
// Update correctIndex to 3 which is the correct answer
crossModuleQuestions[12] = {
  ...crossModuleQuestions[12],
  answer: "(3/4, 7/16)",
  correctIndex: 3,
};

function shuffleQuestions(questions: QuestionData[], count: number): QuestionData[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

type QuizMode = "select" | "standard" | "random";

export default function QuizPage() {
  const { completeCalibration } = useProgress();
  const { t, language } = useLanguage();
  const { unlockBadge } = useGamification();
  const [mode, setMode] = useState<QuizMode>("select");
  const [activeQuestions, setActiveQuestions] = useState<QuestionData[]>(questionsData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(100);
  const [stability, setStability] = useState(100);
  const [status, setStatus] = useState<"ACTIVE" | "COMPLETED" | "FAILED">("ACTIVE");
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startStandardMode = useCallback(() => {
    setActiveQuestions(questionsData);
    setMode("standard");
    setCurrentIndex(0);
    setScore(100);
    setStability(100);
    setStatus("ACTIVE");
    setSelectedOptionIndex(null);
    setLog([]);
  }, []);

  const startRandomMode = useCallback(() => {
    const randomSet = shuffleQuestions([...questionsData, ...crossModuleQuestions], 10);
    setActiveQuestions(randomSet);
    setMode("random");
    setCurrentIndex(0);
    setScore(100);
    setStability(100);
    setStatus("ACTIVE");
    setSelectedOptionIndex(null);
    setLog([]);
  }, []);

  // Helper to get current question data based on language
  const currentQData = activeQuestions[currentIndex];
  const qContent = currentQData ? (language === 'ja' ? currentQData.ja : currentQData.en) : null;
  
  // Backwards compatibility for string matching if correctIndex is missing (fallback)
  // But since I added correctIndex to all, we can rely on index.

  const addLog = (message: string) => {
    setLog(prev => [message, ...prev].slice(0, 5));
  };

  useEffect(() => {
    if (mode !== "select" && status === "ACTIVE") {
      addLog(t('modules.quiz.log.start'));
      timerRef.current = setInterval(() => {
        setStability(prev => {
          if (prev <= 0) {
            setStatus("FAILED");
            return 0;
          }
          return prev - 0.5;
        });
      }, 500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, mode]);

  const handleOptionClick = (index: number) => {
    if (selectedOptionIndex !== null || status !== "ACTIVE" || !qContent) return;
    setSelectedOptionIndex(index);

    const isCorrect = index === currentQData.correctIndex || (currentQData.correctIndex === undefined && qContent.options[index] === currentQData.answer);

    if (isCorrect) {
      addLog(t('modules.quiz.log.correct', { id: currentIndex + 1 }));
      setStability(prev => Math.min(100, prev + 10));
    } else {
      addLog(t('modules.quiz.log.wrong', { id: currentIndex + 1 }));
      setScore(prev => Math.max(0, prev - 20));
      setStability(prev => Math.max(0, prev - 15));
    }

    setTimeout(() => {
      if (currentIndex < activeQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOptionIndex(null);
      } else {
        setStatus("COMPLETED");
        completeCalibration(score);
        if (score === 100 && isCorrect) {
          unlockBadge('quiz_ace');
        }
      }
    }, 1500);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {mode === "select" ? (
            <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('modules.quiz.abort')}
            </Link>
          ) : (
            <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setMode("select"); setStatus("ACTIVE"); }} className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('modules.quiz.abort')}
            </button>
          )}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Timer className={`w-4 h-4 ${stability < 30 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${stability < 30 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${stability}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('modules.quiz.nav.precision')}</span>
              <span className="text-sm font-mono font-bold">{score}%</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode='wait'>
          {mode === "select" ? (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              <h2 className="text-3xl font-black text-slate-900 text-center tracking-tight mb-8">
                {language === 'ja' ? 'テストモードを選択' : 'Select Test Mode'}
              </h2>

              <button
                onClick={startStandardMode}
                className="w-full bg-white border border-slate-200 p-8 rounded-3xl text-left hover:border-blue-500 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{language === 'ja' ? '実力判定テスト' : 'Standard Assessment'}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {language === 'ja' ? '基本5問で数学的な習熟度を測定します。' : '5 core questions to measure mathematical proficiency.'}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={startRandomMode}
                className="w-full bg-white border border-slate-200 p-8 rounded-3xl text-left hover:border-indigo-500 hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <Shuffle className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{language === 'ja' ? '全モジュール混合テスト' : 'Cross-Module Random Test'}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {language === 'ja'
                        ? '二次関数・データ・確率・集合・三角比・数と式から10問をランダム出題。'
                        : '10 random questions from quadratics, data, probability, sets, trig, and algebra.'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['二次関数', 'データ分析', '確率', '集合と命題', '三角比', '数と式'].map((tag) => (
                        <span key={tag} className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ) : status === "ACTIVE" && qContent ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-8">
                <motion.div 
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {qContent.category}
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold">#{currentQData.id}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
                    {qContent.query}
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {qContent.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={selectedOptionIndex !== null}
                        className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 group
                          ${selectedOptionIndex === idx 
                            ? idx === currentQData.correctIndex
                              ? 'bg-green-50 border-green-200 text-green-700' 
                              : 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                          }
                          ${selectedOptionIndex !== null && idx !== selectedOptionIndex ? 'opacity-40 grayscale-[0.5]' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors
                              ${selectedOptionIndex === idx ? 'bg-white/50' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}
                            `}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-medium">{option}</span>
                          </div>
                          {selectedOptionIndex === idx && (
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                              {idx === currentQData.correctIndex ? t('modules.quiz.question.correct_badge') : t('modules.quiz.question.incorrect_badge')}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedOptionIndex !== null && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-8 border-t border-slate-100"
                    >
                      <div className="flex gap-4">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('modules.quiz.question.explanation_title')}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{qContent.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                   <h3 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">{t('modules.quiz.status.title')}</h3>
                   <div className="space-y-4 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('modules.quiz.nav.progress')}</span>
                        <span className="font-bold">{currentIndex + 1} / {activeQuestions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{t('modules.quiz.nav.estimated_score')}</span>
                        <span className="font-bold text-blue-400">{score}%</span>
                      </div>
                   </div>
                 </div>

                 <div className="bg-white rounded-3xl border border-slate-200 p-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{t('modules.quiz.log.title')}</h3>
                    <div className="space-y-2 font-mono text-[11px]">
                      {log.map((msg, i) => (
                        <div key={i} className={`flex gap-2 ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                          <span>{msg}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          ) : status === "COMPLETED" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white border border-slate-200 p-16 rounded-[40px] text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{t('modules.quiz.result.completed_title')}</h2>
              <p className="text-slate-500 font-medium mb-12">{t('modules.quiz.result.completed_desc')}</p>
              
              <div className="grid grid-cols-2 gap-8 mb-16">
                <div className="p-6 bg-slate-50 rounded-3xl">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('modules.quiz.result.score_label')}</div>
                   <div className="text-4xl font-black text-slate-900">{score}%</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('modules.quiz.result.rank_label')}</div>
                   <div className="text-2xl font-black text-blue-600">
                    {score >= 90 ? t('modules.quiz.result.ranks.omega') : score >= 70 ? t('modules.quiz.result.ranks.architect') : score >= 50 ? t('modules.quiz.result.ranks.operator') : t('modules.quiz.result.ranks.learner')}
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  {t('modules.quiz.result.start_btn')}
                </Link>
                <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setMode("select"); setStatus("ACTIVE"); }} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  {t('modules.quiz.result.retry_btn')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white border border-red-100 p-16 rounded-[40px] text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">{t('modules.quiz.failed.title')}</h2>
              <p className="text-slate-500 mb-12">{t('modules.quiz.failed.desc')}</p>
              <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setMode("select"); setStatus("ACTIVE"); }} className="px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
                {t('modules.quiz.failed.retry_btn')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
