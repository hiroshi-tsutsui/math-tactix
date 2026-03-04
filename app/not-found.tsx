'use client'; // Client Component to access useLanguage

import Link from 'next/link';
import { useLanguage } from './contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-mono text-center">
      <h2 className="text-6xl font-bold text-gray-800 mb-4 tracking-widest">404</h2>
      <p className="text-2xl text-blue-400 mb-2 font-bold tracking-wide">VOID_SECTOR_DETECTED</p>
      
      <p className="text-gray-500 mb-8 max-w-md">
        {t('modules.vectors.mission_title') ? 
          t('modules.vectors.mission_title') // Use Vectors title as a cryptic placeholder 
          : "The requested coordinates do not exist in this dimension."}
      </p>
      
      <div className="flex flex-col items-center space-y-4">
        <Link 
            href="/"
            className="px-8 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-transform hover:scale-105 rounded shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          RETURN_TO_HUB
        </Link>
        <span className="text-xs text-gray-700 mt-8">ERROR_CODE: NULL_POINTER_EXCEPTION</span>
      </div>
    </div>
  );
}
