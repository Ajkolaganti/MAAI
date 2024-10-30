'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import Image from 'next/image';
import Maai from '../../../../public/Maai.png';
import { 
  User, ChevronDown, LogOut, CreditCard, 
  Settings, Plus, History 
} from 'lucide-react';

export default function GeneratePage() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [gradientPosition, setGradientPosition] = useState(0);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, credits, logout } = useAuth();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGradientPosition((prevPosition) => (prevPosition + 1) % 100);
    }, 50);

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGenerate = useCallback((code: string) => {
    const cleanCode = code
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
    
    setGeneratedCode(cleanCode);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"
        style={{
          maskImage: `linear-gradient(to right, transparent, black ${gradientPosition}%, transparent ${gradientPosition + 5}%)`,
          WebkitMaskImage: `linear-gradient(to right, transparent, black ${gradientPosition}%, transparent ${gradientPosition + 5}%)`,
        }}
      />
      
      {/* Navigation */}
      <nav className="relative z-100 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/generate" className="inline-block">
            <h1 className="text-xl font-['Orbitron'] tracking-[0.4em] uppercase text-white">
              <Image src={Maai} alt="MAAI" className="h-8 w-auto" width={32} height={32} />
            </h1>
          </Link>

          {/* Account Button & Dropdown */}
          <div className="relative z-[100]" ref={dropdownRef}>
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg
                       bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm text-gray-300">{user?.email}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                isAccountOpen ? 'transform rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-lg bg-gray-900 border border-gray-800 shadow-xl">
                {/* Credits Section */}
                <div className="p-4 border-b border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Credits Available</span>
                    <span className="text-lg font-bold text-white">
                      {credits.total - credits.used}
                    </span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/#pricing'}
                    className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600
                             rounded-lg text-sm font-medium transition-colors
                             flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buy More Credits</span>
                  </button>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/history"
                    className="w-full px-4 py-2 text-left text-sm text-gray-300
                             hover:bg-gray-800 flex items-center space-x-3
                             transition-colors"
                  >
                    <History className="w-4 h-4 text-gray-400" />
                    <span>Generation History</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="w-full px-4 py-2 text-left text-sm text-gray-300
                             hover:bg-gray-800 flex items-center space-x-3
                             transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400
                             hover:bg-gray-800 flex items-center space-x-3
                             transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-['Orbitron'] tracking-wider text-white">
              Generate UI Component
            </h2>
            <p className="mt-2 text-gray-400 font-['Orbitron'] tracking-wide">
              Describe your UI component in natural language and let AI generate the code.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Section */}
            <div className="space-y-6">
              <Editor onGenerate={handleGenerate} />
            </div>

            {/* Preview Section */}
            <div className="lg:pl-8">
              <Preview code={generatedCode} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}