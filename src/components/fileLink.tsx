'use client';

import { useState } from 'react';
import { FileCode, ChevronRight, Clock, GitBranch } from 'lucide-react';

interface FileLinkProps {
  filename: string;
  version: string;
  timestamp: number;
  description: string;
  onClick: () => void;
}

export function FileLink({ filename, version, timestamp, description, onClick }: FileLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex items-center space-x-2 px-4 py-3 rounded-lg 
                   bg-gray-800/50 hover:bg-gray-800/70 transition-all
                   border border-gray-700/50 hover:border-purple-500/50
                   backdrop-blur-sm w-full"
      >
        <div className="flex-shrink-0">
          <FileCode className="h-5 w-5 text-purple-400" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300 group-hover:text-white">
              {filename}
            </span>
            <span className="text-xs text-gray-500 flex items-center">
              <GitBranch className="h-3 w-3 mr-1" />
              {version}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-400 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-400 
                                transform group-hover:translate-x-1 transition-all" />
      </button>
      
      {isHovered && (
        <div className="px-4 py-2 text-xs text-gray-400 bg-gray-800/30 
                       rounded-md border border-gray-700/30 backdrop-blur-sm">
          {description}
        </div>
      )}
    </div>
  );
}