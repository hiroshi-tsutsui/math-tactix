"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import katex from "katex";
import HintButton from "../../components/HintButton";

const K = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false });
    }
  }, [tex]);
  return <span ref={ref} />;
};

const KBlock = ({ tex }: { tex: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, { throwOnError: false, displayMode: true });
    }
  }, [tex]);
  return <div ref={ref} />;
};

type TabMode = "product_to_sum" | "sum_to_product";

const fmt = (v: number) => v.toFixed(4);

export default function ProductToSumViz() {
  const [mode, setMode] = useState<TabMode>("product_to_sum");
  const [aDeg, setADeg] = useState(60);
  const [bDeg, setBDeg] = useState(30);

  const aRad = useMemo(() => (aDeg * Math.PI) / 180, [aDeg]);
  const bRad = useMemo(() => (bDeg * Math.PI) / 180, [bDeg]);

  // ---- Product to Sum ----
  const productToSum = useMemo(() => {
    const sinA = Math.sin(aRad);
    const cosA = Math.cos(aRad);
    const sinB = Math.sin(bRad);
    const cosB = Math.cos(bRad);

    // sinA cosB = (1/2)[sin(A+B) + sin(A-B)]
    const sinAcosB_left = sinA * cosB;
    const sinAcosB_right = 0.5 * (Math.sin(aRad + bRad) + Math.sin(aRad - bRad));

    // cosA sinB = (1/2)[sin(A+B) - sin(A-B)]
    const cosAsinB_left = cosA * sinB;
    const cosAsinB_right = 0.5 * (Math.sin(aRad + bRad) - Math.sin(aRad - bRad));

    // cosA cosB = (1/2)[cos(A-B) + cos(A+B)]
    const cosAcosB_left = cosA * cosB;
    const cosAcosB_right = 0.5 * (Math.cos(aRad - bRad) + Math.cos(aRad + bRad));

    // sinA sinB = (1/2)[cos(A-B) - cos(A+B)]
    const sinAsinB_left = sinA * sinB;
    const sinAsinB_right = 0.5 * (Math.cos(aRad - bRad) - Math.cos(aRad + bRad));

    return [
      {
        label: "sinA cosB",
        formulaTex: "\\sin A \\cos B = \\tfrac{1}{2}[\\sin(A+B) + \\sin(A-B)]",
        left: sinAcosB_left,
        right: sinAcosB_right,
        leftTex: `\\sin ${aDeg}^\\circ \\cos ${bDeg}^\\circ`,
        rightTex: `\\tfrac{1}{2}[\\sin ${aDeg + bDeg}^\\circ + \\sin ${aDeg - bDeg}^\\circ]`,
      },
      {
        label: "cosA sinB",
        formulaTex: "\\cos A \\sin B = \\tfrac{1}{2}[\\sin(A+B) - \\sin(A-B)]",
        left: cosAsinB_left,
        right: cosAsinB_right,
        leftTex: `\\cos ${aDeg}^\\circ \\sin ${bDeg}^\\circ`,
        rightTex: `\\tfrac{1}{2}[\\sin ${aDeg + bDeg}^\\circ - \\sin ${aDeg - bDeg}^\\circ]`,
      },
      {
        label: "cosA cosB",
        formulaTex: "\\cos A \\cos B = \\tfrac{1}{2}[\\cos(A-B) + \\cos(A+B)]",
        left: cosAcosB_left,
        right: cosAcosB_right,
        leftTex: `\\cos ${aDeg}^\\circ \\cos ${bDeg}^\\circ`,
        rightTex: `\\tfrac{1}{2}[\\cos ${Math.abs(aDeg - bDeg)}^\\circ + \\cos ${aDeg + bDeg}^\\circ]`,
      },
      {
        label: "sinA sinB",
        formulaTex: "\\sin A \\sin B = \\tfrac{1}{2}[\\cos(A-B) - \\cos(A+B)]",
        left: sinAsinB_left,
        right: sinAsinB_right,
        leftTex: `\\sin ${aDeg}^\\circ \\sin ${bDeg}^\\circ`,
        rightTex: `\\tfrac{1}{2}[\\cos ${Math.abs(aDeg - bDeg)}^\\circ - \\cos ${aDeg + bDeg}^\\circ]`,
      },
    ];
  }, [aRad, bRad, aDeg, bDeg]);

  // ---- Sum to Product ----
  // For sum_to_product, use C=A, D=B reinterpreted:
  // C+D = A+B, C-D = A-B, so (C+D)/2 = (A+B)/2, (C-D)/2 = (A-B)/2
  const sumToProduct = useMemo(() => {
    const cDeg = aDeg;
    const dDeg = bDeg;
    const cRad = aRad;
    const dRad = bRad;
    const halfSum = (cRad + dRad) / 2;
    const halfDiff = (cRad - dRad) / 2;
    const halfSumDeg = (cDeg + dDeg) / 2;
    const halfDiffDeg = (cDeg - dDeg) / 2;

    // sinC + sinD = 2sin((C+D)/2)cos((C-D)/2)
    const sinCplusD_left = Math.sin(cRad) + Math.sin(dRad);
    const sinCplusD_right = 2 * Math.sin(halfSum) * Math.cos(halfDiff);

    // sinC - sinD = 2cos((C+D)/2)sin((C-D)/2)
    const sinCminusD_left = Math.sin(cRad) - Math.sin(dRad);
    const sinCminusD_right = 2 * Math.cos(halfSum) * Math.sin(halfDiff);

    // cosC + cosD = 2cos((C+D)/2)cos((C-D)/2)
    const cosCplusD_left = Math.cos(cRad) + Math.cos(dRad);
    const cosCplusD_right = 2 * Math.cos(halfSum) * Math.cos(halfDiff);

    // cosC - cosD = -2sin((C+D)/2)sin((C-D)/2)
    const cosCminusD_left = Math.cos(cRad) - Math.cos(dRad);
    const cosCminusD_right = -2 * Math.sin(halfSum) * Math.sin(halfDiff);

    return [
      {
        label: "sinC + sinD",
        formulaTex: "\\sin C + \\sin D = 2\\sin\\tfrac{C+D}{2}\\cos\\tfrac{C-D}{2}",
        left: sinCplusD_left,
        right: sinCplusD_right,
        leftTex: `\\sin ${cDeg}^\\circ + \\sin ${dDeg}^\\circ`,
        rightTex: `2\\sin ${halfSumDeg}^\\circ \\cos ${halfDiffDeg}^\\circ`,
      },
      {
        label: "sinC - sinD",
        formulaTex: "\\sin C - \\sin D = 2\\cos\\tfrac{C+D}{2}\\sin\\tfrac{C-D}{2}",
        left: sinCminusD_left,
        right: sinCminusD_right,
        leftTex: `\\sin ${cDeg}^\\circ - \\sin ${dDeg}^\\circ`,
        rightTex: `2\\cos ${halfSumDeg}^\\circ \\sin ${halfDiffDeg}^\\circ`,
      },
      {
        label: "cosC + cosD",
        formulaTex: "\\cos C + \\cos D = 2\\cos\\tfrac{C+D}{2}\\cos\\tfrac{C-D}{2}",
        left: cosCplusD_left,
        right: cosCplusD_right,
        leftTex: `\\cos ${cDeg}^\\circ + \\cos ${dDeg}^\\circ`,
        rightTex: `2\\cos ${halfSumDeg}^\\circ \\cos ${halfDiffDeg}^\\circ`,
      },
      {
        label: "cosC - cosD",
        formulaTex: "\\cos C - \\cos D = -2\\sin\\tfrac{C+D}{2}\\sin\\tfrac{C-D}{2}",
        left: cosCminusD_left,
        right: cosCminusD_right,
        leftTex: `\\cos ${cDeg}^\\circ - \\cos ${dDeg}^\\circ`,
        rightTex: `-2\\sin ${halfSumDeg}^\\circ \\sin ${halfDiffDeg}^\\circ`,
      },
    ];
  }, [aRad, bRad, aDeg, bDeg]);

  const currentData = mode === "product_to_sum" ? productToSum : sumToProduct;

  const colorClasses = [
    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">積和変換・和積変換</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          三角関数の積を和に、和を積に変換する公式
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("product_to_sum")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            mode === "product_to_sum"
              ? "bg-blue-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          積 → 和（積和）
        </button>
        <button
          onClick={() => setMode("sum_to_product")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            mode === "sum_to_product"
              ? "bg-purple-500 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          和 → 積（和積）
        </button>
      </div>

      {/* Formulas overview */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-800 space-y-2">
        <h4 className="font-bold text-indigo-700 dark:text-indigo-400 text-sm mb-2">
          {mode === "product_to_sum" ? "積和の公式" : "和積の公式"}
        </h4>
        {currentData.map((item, i) => (
          <KBlock key={i} tex={item.formulaTex} />
        ))}
      </div>

      {/* Sliders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-blue-600">
              <K tex={`${mode === "product_to_sum" ? "A" : "C"} = ${aDeg}^\\circ`} />
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={aDeg}
            onChange={(e) => setADeg(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0°</span>
            <span>180°</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-purple-600">
              <K tex={`${mode === "product_to_sum" ? "B" : "D"} = ${bDeg}^\\circ`} />
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={bDeg}
            onChange={(e) => setBDeg(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0°</span>
            <span>180°</span>
          </div>
        </div>
      </div>

      {/* Verification cards */}
      <div className="space-y-3">
        {currentData.map((item, i) => (
          <div
            key={i}
            className={`rounded-xl p-4 border ${colorClasses[i]} space-y-2`}
          >
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[10px] text-slate-400 mb-1">左辺</div>
                <div className="font-mono">
                  <K tex={`${item.leftTex} = ${fmt(item.left)}`} />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 mb-1">右辺</div>
                <div className="font-mono">
                  <K tex={`${item.rightTex} = ${fmt(item.right)}`} />
                </div>
              </div>
            </div>
            <div
              className={`text-xs font-bold ${
                Math.abs(item.left - item.right) < 1e-8
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {Math.abs(item.left - item.right) < 1e-8
                ? "一致"
                : `差: ${Math.abs(item.left - item.right).toExponential(2)}`}
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <HintButton
        hints={[
          {
            step: 1,
            text: "積和公式は加法定理の和・差から導けます。sin(A+B) + sin(A-B) を展開してみましょう。",
          },
          {
            step: 2,
            text: "sin(A+B) = sinA cosB + cosA sinB、sin(A-B) = sinA cosB - cosA sinB なので、足すと 2sinA cosB になります。",
          },
          {
            step: 3,
            text: "和積公式は積和公式の逆変換です。C = A+B, D = A-B とおくと A = (C+D)/2, B = (C-D)/2 で変換できます。",
          },
        ]}
      />

      {/* Derivation */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800">
        <h4 className="font-bold text-green-700 dark:text-green-400 text-sm mb-3">導出の核心</h4>
        <div className="space-y-2 text-sm">
          <KBlock tex="\\sin(A+B) = \\sin A \\cos B + \\cos A \\sin B" />
          <KBlock tex="\\sin(A-B) = \\sin A \\cos B - \\cos A \\sin B" />
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-green-200 dark:border-green-700 text-center">
            <div className="text-xs text-green-600 dark:text-green-400 font-bold mb-1">辺々を加えると</div>
            <KBlock tex="\\sin(A+B) + \\sin(A-B) = 2\\sin A \\cos B" />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-green-200 dark:border-green-700 text-center">
            <div className="text-xs text-green-600 dark:text-green-400 font-bold mb-1">辺々を引くと</div>
            <KBlock tex="\\sin(A+B) - \\sin(A-B) = 2\\cos A \\sin B" />
          </div>
        </div>
        <p className="text-sm text-green-600 dark:text-green-300 mt-3">
          cos の積和公式も同様に cos(A+B) と cos(A-B) の加法定理の和・差から得られます。
        </p>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
        <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm mb-2">活用ポイント</h4>
        <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1 list-disc list-inside">
          <li>積和変換: 三角関数の積の積分で和に直すと計算が簡単になる</li>
          <li>和積変換: sin75° + sin15° のように特殊角の和を計算するときに便利</li>
          <li>和積公式は C+D = 2A, C-D = 2B の置換で積和公式から導ける</li>
          <li>暗記よりも「加法定理から導出できる」ことが重要</li>
        </ul>
      </div>
    </div>
  );
}
