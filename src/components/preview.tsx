// src/components/preview.tsx

'use client';

import { useState } from 'react';
import { Code2, Eye, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PreviewProps {
  code: string | null;
}

export function Preview({ code }: PreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code', {
        description: err instanceof Error ? err.message : 'An error occurred while copying code.'
      });
    }
  };

  const generatePreviewHtml = (code: string) => {
    // Clean up the code by removing imports and exports
    const cleanCode = code
      .replace(/import\s+.*from\s+['"].*['"];?/g, '')
      .replace(/export\s+default\s+/g, '')
      .trim();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0;
              min-height: 100vh;
              background-color: #111827;
              color: white;
            }
            #root { 
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }
            .glass {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
            }
          </style>
          <script>
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    gray: {
                      900: '#111827',
                      800: '#1F2937',
                      700: '#374151',
                    }
                  }
                }
              }
            }
          </script>
        </head>
        <body class="dark">
          <div id="root"></div>
          <script type="text/babel" data-type="module">
            try {
              const { useState, useEffect } = React;
              
              ${cleanCode}

              const componentName = '${cleanCode.match(/const\s+([A-Za-z0-9_]+)\s*=/)?.[1] || 'App'}';
              const Component = eval(componentName);
              
              ReactDOM.render(
                React.createElement(Component),
                document.getElementById('root')
              );
            } catch (error) {
              document.getElementById('root').innerHTML = \`
                <div style="color: red; padding: 20px;">
                  <strong>Error rendering component:</strong><br/>
                  \${error.message}
                </div>
              \`;
              console.error('Preview error:', error);
            }
          </script>
        </body>
      </html>
    `;
  };

  return (
    <div className={`${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-gray-950' 
        : 'w-full h-[600px]'
    } rounded-lg border border-gray-800 overflow-hidden`}>
      {/* Preview Header */}
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeTab === 'preview'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeTab === 'code'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code2 className="h-4 w-4 inline mr-2" />
            Code
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {code && (
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-400 hover:text-white rounded-md
                       hover:bg-gray-800 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-400 hover:text-white rounded-md
                     hover:bg-gray-800 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-[calc(100%-3rem)] bg-gray-950">
        {!code ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Your preview will appear here
          </div>
        ) : activeTab === 'preview' ? (
          <div className="h-full">
            <iframe
              srcDoc={generatePreviewHtml(code)}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              onError={(e) => {
                console.error('iframe error:', e);
              }}
            />
          </div>
        ) : (
          <pre className="p-4 overflow-auto h-full">
            <code className="text-gray-300 text-sm font-mono">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}