// src/app/(app)/history/page.tsx

'use client';

import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/auth-context';
import { Clock } from 'lucide-react';

type Generation = {
  prompt: string;
  timestamp: string;
};

const fetchGenerations = async (): Promise<Generation[]> => {
  // Replace with your actual API endpoint
  const response = await fetch('/api/generations');
  return response.json();
};

export default function HistoryPage() {
//   const { user } = useAuth();
  const [generations, setGenerations] = useState<Generation[]>([]);

  useEffect(() => {
    // Fetch generations and use setGenerations
    fetchGenerations().then(data => setGenerations(data));
  }, []);

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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg text-gray-200">
                      {generation.prompt}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(generation.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm rounded-md bg-purple-600 hover:bg-purple-700 transition-colors">
                      View
                    </button>
                    <button className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
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