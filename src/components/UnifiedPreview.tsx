'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Maximize2, 
  Code2, 
  Eye,
  Copy,
  Check,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip"
import { Button } from "@/components/ui/button"

interface UnifiedPreviewProps {
  code: string | undefined;
  loading: boolean;
}

export function UnifiedPreview({ code, loading }: UnifiedPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (code && code !== displayedCode) {
      setTypingComplete(false);
      setIsTyping(true);
      setDisplayedCode('');
      let currentIndex = 0;
      
      const typeCode = () => {
        if (currentIndex < code.length) {
          setDisplayedCode(prev => prev + code[currentIndex]);
          currentIndex++;
          setTimeout(typeCode, 5);
        } else {
          setIsTyping(false);
          setTypingComplete(true);
        }
      };

      typeCode();
    }
  }, [code, displayedCode]);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const containerClasses = isFullscreen 
    ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-xl'
    : 'w-full h-full min-h-[600px] rounded-xl border border-gray-800/50 bg-black/60 backdrop-blur-xl';

  const PreviewContent = () => (
    <div className={containerClasses}>
      {/* Header with Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800/50 bg-black/40">
        <div className="flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-['Orbitron'] tracking-[0.2em] uppercase transition-colors
                    ${activeTab === 'preview' 
                      ? 'border-b-2 border-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
              </TooltipTrigger>
              <TooltipContent>View Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-['Orbitron'] tracking-[0.2em] uppercase transition-colors
                    ${activeTab === 'code' 
                      ? 'border-b-2 border-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'}`}
                >
                  <Code2 className="h-4 w-4" />
                  Code
                </button>
              </TooltipTrigger>
              <TooltipContent>View Code</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2 px-4">
          {!isFullscreen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(true)}
                    className="text-gray-400 hover:text-white font-['Orbitron'] tracking-wider"
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Fullscreen
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Enter Fullscreen</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-3rem)]">
        {activeTab === 'preview' ? (
          <iframe
            srcDoc={generatePreviewHtml(code || '')}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            onError={(e) => {
              console.error('Preview error:', e);
            }}
          />
        ) : (
          <div className="relative h-full">
            <pre className="h-full overflow-auto p-4 text-sm font-mono bg-black/40">
              <code className={`text-gray-300 ${isTyping ? 'typing' : ''}`}>
                {displayedCode}
                {isTyping && '|'}
              </code>
            </pre>
            {typingComplete && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white font-['Orbitron'] tracking-wider"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy Code</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`${containerClasses} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <p className="text-gray-400 font-['Orbitron'] tracking-[0.2em] uppercase">
            Loading preview...
          </p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className={`${containerClasses} flex items-center justify-center`}>
        <p className="text-gray-400 font-['Orbitron'] tracking-[0.2em] uppercase">
          Generated content will appear here
        </p>
      </div>
    );
  }

  return (
    <>
      <PreviewContent />
      
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/60 backdrop-blur-xl border-gray-800/50">
          <DialogHeader className="px-4 py-2 border-b border-gray-800/50 bg-black/40">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-['Orbitron'] tracking-[0.2em] uppercase">
                Preview
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 h-[calc(100%-4rem)]">
            <PreviewContent />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function generatePreviewHtml(code: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
        <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0;
            min-height: 100vh;
            background-color: rgb(0 0 0 / 0.6);
            color: white;
          }
          #root { 
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .glass {
            background: rgba(0, 0, 0, 0.6);
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
                },
                fontFamily: {
                  orbitron: ['Orbitron', 'sans-serif'],
                }
              }
            }
          }
        </script>
      </head>
      <body class="dark">
        <div id="root"></div>
        <script type="text/babel">
          try {
            const { useState, useEffect } = React;
            
            ${code}

            ReactDOM.render(
              <PreviewComponent />,
              document.getElementById('root')
            );
          } catch (error) {
            document.getElementById('root').innerHTML = 
              '<div style="color: #f87171; padding: 20px; font-family: Orbitron; letter-spacing: 0.2em; text-transform: uppercase;">' +
              '<strong>Error:</strong><br/>' +
              error.toString() +
              '</div>';
          }
        </script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      </body>
    </html>
  `;
}