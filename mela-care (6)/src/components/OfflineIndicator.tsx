import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { AppLanguage } from '../types';

interface OfflineIndicatorProps {
  lang: AppLanguage;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] mx-auto bg-amber-600 text-white px-3.5 py-2 rounded-2xl shadow-lg border border-amber-400 flex items-center justify-between gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 min-w-0">
        <WifiOff className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span className="truncate">
          {lang === 'am' || lang === 'har'
            ? 'ያለ ኢንተርኔት (ኦፍላይን) እየሰሩ ነው — ሁሉም መመሪያዎች ተቀምጠዋል'
            : lang === 'om'
            ? 'Interneetii malee hojjechaa jirtu — Qajeelfamoonni qophiidha'
            : 'Offline Mode Active — Clinical guides work offline'}
        </span>
      </div>
      <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full shrink-0">
        Offline ✓
      </span>
    </div>
  );
};
