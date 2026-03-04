"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ja from '../../locales/ja.json';
import en from '../../locales/en.json';

type Locale = 'ja' | 'en';
type Translations = typeof ja;

interface LanguageContextType {
  language: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Locale>('ja');
  const [translations, setTranslations] = useState<Translations>(ja);

  useEffect(() => {
    // Load preference from localStorage if available
    const savedLang = localStorage.getItem('math-tactix-lang') as Locale;
    if (savedLang && (savedLang === 'ja' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    setTranslations(language === 'ja' ? ja : en as unknown as Translations);
    localStorage.setItem('math-tactix-lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ja' ? 'en' : 'ja'));
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }, value);
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
