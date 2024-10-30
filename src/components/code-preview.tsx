'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';

interface CodePreviewProps {
  code: string | null;
}

export function CodePreview({ code }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'react' | 'html'>('react');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <Card className="mt-4 bg-black/60 backdrop-blur-xl border-gray-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-['Orbitron'] tracking-[0.2em] uppercase text-gray-100">
            Generated Code
          </CardTitle>
          <div className="space-x-2">
            <Button
              variant={activeTab === 'react' ? 'default' : 'outline'}
              onClick={() => setActiveTab('react')}
              size="sm"
              className={`font-['Orbitron'] tracking-wider ${
                activeTab === 'react' 
                  ? 'bg-purple-600/80 hover:bg-purple-700/80 text-white' 
                  : 'border-gray-700/50 text-gray-400 hover:text-gray-300'
              }`}
            >
              React
            </Button>
            <Button
              variant={activeTab === 'html' ? 'default' : 'outline'}
              onClick={() => setActiveTab('html')}
              size="sm"
              className={`font-['Orbitron'] tracking-wider ${
                activeTab === 'html' 
                  ? 'bg-purple-600/80 hover:bg-purple-700/80 text-white' 
                  : 'border-gray-700/50 text-gray-400 hover:text-gray-300'
              }`}
            >
              HTML
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="p-4 bg-gray-900/50 rounded-lg overflow-x-auto border border-gray-800/50">
            <code className="text-sm text-gray-300">
              {activeTab === 'react' ? code : code}
            </code>
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 border-gray-700/50 text-gray-400 hover:text-gray-300 
                     font-['Orbitron'] tracking-wider"
            onClick={() => code && copyToClipboard(code)}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}