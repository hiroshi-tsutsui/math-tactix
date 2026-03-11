"use client";

import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';

const BenchWordProblemViz = () => {
  const [benches, setBenches] = useState(5);
  // Problem: 4 per bench -> 5 left over (Total students = 4x + 5)
  // If 5 per bench -> 1 empty bench, and the last occupied bench has 1 to 5 students.

  const totalStudents = 4 * benches + 5;
  const capacityIf5 = 5 * benches;

  // Let's visualize the benches.
  const renderBenches = () => {
    let elements = [];
    let studentsPlaced = 0;

    for (let i = 0; i < benches; i++) {
      let studentsOnThisBench = 0;
      if (studentsPlaced + 5 <= totalStudents) {
        studentsOnThisBench = 5;
      } else if (studentsPlaced < totalStudents) {
        studentsOnThisBench = totalStudents - studentsPlaced;
      }
      studentsPlaced += studentsOnThisBench;

      const isFull = studentsOnThisBench === 5;
      const isEmpty = studentsOnThisBench === 0;
      const isLastOccupied = !isFull && !isEmpty;

      elements.push(
        <div key={i} className={`flex flex-col items-center p-2 border-2 rounded w-24 h-24 m-1 ${isEmpty ? 'border-dashed border-gray-400 bg-gray-50' : 'border-blue-500 bg-blue-50'}`}>
          <div className="text-xs text-gray-500 mb-1">長椅子 {i + 1}</div>
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className={`w-4 h-4 rounded-full ${j < studentsOnThisBench ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <div className="text-sm font-bold mt-auto">
            {studentsOnThisBench}人
          </div>
        </div>
      );
    }
    return elements;
  };

  // Conditions
  // The (x-1)th bench is full? No, in the standard problem:
  // "Last bench has 1 to 5 people, and exactly one bench is completely empty" => meaning bench x is empty, bench x-1 has 1~5 people.
  // So we need: 5(x-2) < 4x+5 <= 5(x-1)
  
  const minStudentsNeededForCondition = 5 * (benches - 2) + 1;
  const maxStudentsAllowedForCondition = 5 * (benches - 1);
  
  const isValid = totalStudents >= minStudentsNeededForCondition && totalStudents <= maxStudentsAllowedForCondition;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm mr-2">1次不等式</span>
        過不足の問題 (長椅子)
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <strong>問題:</strong> 生徒を長椅子に座らせる。1脚に4人ずつ座ると5人が座れなくなる。<br/>
          1脚に5人ずつ座ると、最後の1脚は誰も座らず、その手前の1脚には1人以上5人以下が座る。<br/>
          長椅子の数 <InlineMath math="x" /> を求めよ。
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          長椅子の数 <InlineMath math="x" />: {benches}脚
        </label>
        <input
          type="range"
          min={3}
          max={12}
          step={1}
          value={benches}
          onChange={(e) => setBenches(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>3脚</span>
          <span>12脚</span>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="font-bold text-blue-800 mb-2 text-center">
          生徒の総数: <InlineMath math="4x + 5" /> = {totalStudents}人
        </div>
        <p className="text-xs text-center text-blue-600 mb-4">5人ずつ座らせた場合の配置をシミュレーションします</p>
        
        <div className="flex flex-wrap justify-center items-end">
          {renderBenches()}
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border-2 transition-colors ${isValid ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          <h4 className="font-bold mb-2 text-sm flex items-center">
            {isValid ? (
              <><span className="text-green-600 mr-2">✓</span>条件を完全に満たしています</>
            ) : (
              <><span className="text-red-600 mr-2">✗</span>条件を満たしていません</>
            )}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="font-bold mb-1 text-gray-700">条件1: 最後の椅子は0人</div>
              <div className={totalStudents <= 5 * (benches - 1) ? 'text-green-600' : 'text-red-500'}>
                <InlineMath math="4x + 5 \le 5(x - 1)" />
                <br/>
                {totalStudents} {'<='} {5 * (benches - 1)}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="font-bold mb-1 text-gray-700">条件2: 最後から2番目は1人以上</div>
              <div className={totalStudents > 5 * (benches - 2) ? 'text-green-600' : 'text-red-500'}>
                <InlineMath math="5(x - 2) < 4x + 5" />
                <br/>
                {5 * (benches - 2)} {'<'} {totalStudents}
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <BlockMath math={`5(x - 2) < 4x + 5 \\le 5(x - 1)`} />
            <div className="text-sm mt-2 text-gray-600">
              これを解くと <InlineMath math="10 \le x < 15" /> となり、<br/>
              椅子の数は自然数なので、<InlineMath math="x = 10, 11, 12, 13, 14" /> となるはずです。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchWordProblemViz;
