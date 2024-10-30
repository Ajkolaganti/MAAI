'use client';

import { useAuth } from '@/contexts/auth-context';
import { Zap, AlertTriangle } from 'lucide-react';

export function CreditsDisplay() {
  const { credits } = useAuth();
  const remainingCredits = credits.total - credits.used;
  const isLow = remainingCredits < 10;

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg
                   ${isLow ? 'bg-orange-500/10' : 'bg-gray-800/50'}`}>
      <div className="flex items-center space-x-2">
        {isLow ? (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        ) : (
          <Zap className="w-5 h-5 text-purple-400" />
        )}
        <div>
          <div className="text-sm font-medium text-gray-300">
            Credits Remaining
          </div>
          <div className="text-2xl font-bold">
            {remainingCredits}
            <span className="text-sm text-gray-400 ml-1">/ {credits.total}</span>
          </div>
        </div>
      </div>
      {isLow && (
        <button
          onClick={() => window.location.href = '/#pricing'}
          className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg
                   hover:bg-orange-500/30 transition-all text-sm"
        >
          Get More Credits
        </button>
      )}
    </div>
  );
}