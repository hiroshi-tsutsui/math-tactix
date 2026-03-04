'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type GamificationContextType = {
  xp: number;
  level: number;
  streak: number;
  unlockedBadges: string[];
  addXP: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    // 1. Load XP
    const savedXP = localStorage.getItem('math-tactix-xp');
    const currentXP = savedXP ? parseInt(savedXP, 10) : 0;
    setXP(currentXP);
    setLevel(Math.floor(currentXP / 1000) + 1);

    // 2. Load Streak & Login Date
    const savedStreak = localStorage.getItem('math-tactix-streak');
    const lastLoginDate = localStorage.getItem('math-tactix-last-login');
    const today = new Date().toDateString(); // "Wed Mar 04 2026"

    let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;

    if (lastLoginDate !== today) {
      if (lastLoginDate) {
        const last = new Date(lastLoginDate);
        const current = new Date(today);
        const diffTime = Math.abs(current.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive login
          currentStreak += 1;
        } else {
          // Streak broken
          currentStreak = 1;
        }
      } else {
        // First ever login
        currentStreak = 1;
      }

      // Save new state
      setStreak(currentStreak);
      localStorage.setItem('math-tactix-streak', currentStreak.toString());
      localStorage.setItem('math-tactix-last-login', today);
    } else {
      // Same day login, just restore streak
      setStreak(currentStreak);
    }

    // 3. Load Badges
    const savedBadges = localStorage.getItem('math-tactix-badges');
    if (savedBadges) {
      setUnlockedBadges(JSON.parse(savedBadges));
    }
  }, []);

  const addXP = (amount: number) => {
    const newXP = xp + amount;
    setXP(newXP);
    setLevel(Math.floor(newXP / 1000) + 1);
    localStorage.setItem('math-tactix-xp', newXP.toString());
  };

  const unlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      const newBadges = [...unlockedBadges, badgeId];
      setUnlockedBadges(newBadges);
      localStorage.setItem('math-tactix-badges', JSON.stringify(newBadges));
      // Optional: Add notification logic here (e.g. toast)
      console.log(`Badge Unlocked: ${badgeId}`);
    }
  };

  return (
    <GamificationContext.Provider value={{ xp, level, streak, unlockedBadges, addXP, unlockBadge }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
