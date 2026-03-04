"use client";

import React from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
// import { GeistMono } from 'geist/font/mono'; // Not using Geist for now to simplify
import { Languages } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function XPBar() {
  const { xp, level, title } = useProgress();
  const { language, toggleLanguage, t } = useLanguage();

  const progress = (xp % 1000) / 1000 * 100;
  const nextLevelXp = (Math.floor(xp / 1000) + 1) * 1000;
  
  return (
    <div className={`fixed bottom-0 left-0 w-full bg-white/90 dark:bg-black/80 backdrop-blur-md border-t border-black/10 dark:border-white/10 p-2 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4">
        
        {/* Level Indicator */}
        <div className="flex flex-col items-center justify-center min-w-[60px]">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('components.xp_bar.level_label')}</span>
          <span className="text-2xl font-bold text-black dark:text-white">{Math.floor(xp / 1000) + 1}</span>
        </div>

        {/* Title & Bar */}
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-end text-[10px] uppercase tracking-widest">
             <span className="text-black/70 dark:text-white/70 font-bold">{title || "NO_TITLE"}</span>
             <span className="text-gray-500 dark:text-gray-400">{xp} / {nextLevelXp} XP</span>
          </div>
          
          <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
            
            {/* Subtle scanline effect on bar */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        {/* Controls: Language & Theme */}
        <div className="hidden md:flex items-center gap-4 text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-widest">
           <button 
             onClick={toggleLanguage}
             className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors border border-black/10 dark:border-white/10 px-2 py-1 rounded"
           >
             <Languages className="w-3 h-3" />
             {language === 'ja' ? 'JP' : 'EN'}
           </button>
           
           <ThemeToggle />

           <span className="hidden lg:inline">{t('components.xp_bar.system_online')}</span>
        </div>

      </div>
    </div>
  );
}
