'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-mono">
      <h2 className="text-4xl font-bold text-red-500 mb-4">SYSTEM_FAILURE</h2>
      <p className="text-gray-400 mb-8 max-w-md text-center">
        {error.message || t('settings.data_danger_desc') || "An unexpected error occurred within the simulation."}
      </p>
      
      <div className="flex space-x-4">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded border border-blue-500"
        >
          REBOOT_SYSTEM
        </button>
        <a
            href="/"
            className="px-6 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors rounded"
        >
            RETURN_TO_HUB
        </a>
      </div>
    </div>
  );
}
