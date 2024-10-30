'use client';

import { useState } from 'react';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  loading: boolean;
}

export function PromptInput({ onGenerate, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await onGenerate(prompt);
    }
  };

  const placeholderExamples = [
    "Create a modern SaaS landing page with glass morphism effects...",
    "Design a dark-themed dashboard layout with sidebar navigation...",
    "Build a pricing page with interactive pricing cards...",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Generate UI</h2>
          <p className="text-sm text-gray-400">Describe your desired UI component</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
          <span>GPT-4 Powered</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholderExamples[0]}
            className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg resize-none
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                     transition-all duration-200"
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            {!loading && prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800/50
                         transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <div className="text-xs text-gray-500">
              {prompt.length} chars
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500
                     hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate UI</span>
              </>
            )}
          </button>
          {!loading && (
            <button
              type="button"
              onClick={() => {
                const example = placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)];
                setPrompt(example);
              }}
              className="px-4 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg
                       border border-gray-800 hover:bg-gray-800/50 transition-all duration-200"
            >
              Try an example
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="px-3 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-full">React</span>
        <span className="px-3 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-full">Tailwind CSS</span>
        <span className="px-3 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-full">Modern UI</span>
        <span className="px-3 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-full">Responsive</span>
      </div>
    </div>
  );
}