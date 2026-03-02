// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';
import { ArrowLeft, User, Shield, Activity, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { useProgress, ModuleId } from '../contexts/ProgressContext';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { xp, level, title, moduleProgress, calibration } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalModules = Object.keys(moduleProgress).length;
  const masteredCount = Object.values(moduleProgress).filter(m => m.isMastered).length;
  const syncRate = Math.round((masteredCount / totalModules) * 100);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans ${GeistSans.className}`}>
      
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> 戻る
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Profile</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-sm font-bold">{title}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Stats Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm relative overflow-hidden">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-1">{title}</h2>
                <div className="flex items-center gap-2 mb-8">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-500 tracking-wider">LEVEL {level}</span>
                </div>

                <div className="w-full space-y-4">
                   <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>XP Progress</span>
                     <span>{xp % 1000} / 1000</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(xp % 1000) / 10}%` }}
                        className="h-full bg-blue-600"
                      />
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">実力判定状況</span>
              </div>
              {calibration.status === 'COMPLETED' ? (
                <div>
                   <div className="text-4xl font-bold mb-2">{calibration.rate}%</div>
                   <p className="text-xs text-slate-400 font-medium">前回の判定スコア</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 leading-relaxed">まだ実力判定を受けていません。</p>
                  <Link href="/quiz" className="inline-block text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors">
                    テストを受ける
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Module Progress */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
               <div className="space-y-1">
                 <h3 className="text-2xl font-bold tracking-tight">学習の進捗</h3>
                 <p className="text-sm text-slate-500 font-medium">全単元の習得状況を確認できます。</p>
               </div>
               <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">{syncRate}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Mastery</div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(moduleProgress).map((mod) => (
                <div 
                  key={mod.id}
                  className={`p-6 rounded-2xl border transition-all duration-200 bg-white
                    ${mod.isMastered ? 'border-green-100 shadow-sm' : 'border-slate-200 hover:border-blue-300 shadow-sm'}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-sm text-slate-700 capitalize">{mod.id}</span>
                    {mod.isMastered && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                        <CheckCircle2 className="w-2.5 h-2.5" /> マスター
                      </span>
                    )}
                  </div>
                  
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(mod.completedLevels.length / 3) * 100}%` }}
                      className={`h-full ${mod.isMastered ? 'bg-green-500' : 'bg-blue-600'}`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">Progress</span>
                    <span className="text-slate-600 font-mono">{mod.completedLevels.length} / 3 Stages</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100">
               <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900">{totalModules}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">単元数</div>
               </div>
               <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900">{masteredCount}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">完了済み</div>
               </div>
               <div className="space-y-1">
                  <div className="text-xl font-bold text-slate-900">{xp}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">累計ポイント</div>
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
