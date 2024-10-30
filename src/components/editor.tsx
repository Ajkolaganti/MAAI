'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  Loader2, Send, AlertCircle, X, 
  Copy, Check, RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';

interface EditorProps {
  onGenerate: (code: string) => void;
}

interface GenerationError {
  message: string;
  type: 'error' | 'warning';
}

export function Editor({ onGenerate }: EditorProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GenerationError | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { useCredits, credits } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      
      const hasCredits = await useCredits(1);
      if (!hasCredits) {
        setError({
          message: 'Insufficient credits. Please upgrade your plan to continue.',
          type: 'warning'
        });
        return;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate code. Please try again.');
      }

      const data = await response.json();
      
if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedCode(data.react);
        onGenerate(data.react); 
      
      toast.success('Code generated successfully!', {
        description: 'Your UI component has been generated.'
      });

    } catch (error: any) {
      setError({
        message: error.message || 'An error occurred while generating code.',
        type: 'error'
      });
      toast.error('Generation failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedCode(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900/20 to-black/30 animate-gradient-x" />
      <div className="relative backdrop-blur-xl bg-black/60 rounded-2xl p-8 shadow-2xl border border-gray-800/50">
        <h2 className="text-2xl font-normal tracking-[0.4em] uppercase text-gray-100 font-['Orbitron']">Editor</h2>
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-300">
            Credits Remaining: {credits.total - credits.used}
          </div>
          {error?.type === 'warning' && (
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>

        {error && (
          <div className={`px-4 py-3 rounded-lg flex items-center justify-between mb-6
                        ${error.type === 'error' 
                          ? 'bg-red-500/10 border border-red-500/30' 
                          : 'bg-orange-500/10 border border-orange-500/30'}`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className={`h-5 w-5 ${
                error.type === 'error' ? 'text-red-400' : 'text-orange-400'
              }`} />
              <span className={`text-sm ${
                error.type === 'error' ? 'text-red-400' : 'text-orange-400'
              }`}>
                {error.message}
              </span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the UI component you want to create..."
              className="w-full h-40 px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg
                       text-white placeholder-gray-400 resize-none
                       focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
                       transition-all duration-300 ease-in-out"
              disabled={loading}
            />
            {prompt && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-300
                         bg-gray-800/50 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {prompt.length > 0 && `${prompt.length} characters`}
            </div>
            <div className="flex items-center space-x-3">
              {generatedCode && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-800/70 text-gray-300
                           rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600/80 text-white
                         rounded-lg hover:bg-purple-700/80 disabled:opacity-50 
                         disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {!generatedCode && !loading && (
          <div className="mt-8 px-4 py-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
            <h3 className="text-sm font-normal tracking-[0.4em] uppercase text-gray-300 mb-2 font-['Orbitron']">Tips for better results:</h3>
            <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
              <li>Be specific about the layout and design you want</li>
              <li>Mention any specific styling preferences (colors, spacing, etc.)</li>
              <li>Include responsive design requirements if needed</li>
              <li>Specify any interactive elements or animations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}