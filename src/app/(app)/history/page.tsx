// src/app/(app)/history/page.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Clock, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const [generations, setGenerations] = useState([]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-['Orbitron'] tracking-wider mb-8">
          Generation History
        </h1>
        
        <div className="space-y-4">
          {generations.length > 0 ? (
            generations.map((generation, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-900/50 border border-gray-800
                         hover:border-purple-500/50 transition-colors"
              >
                {/* Add your generation history item content here */}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No generations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}