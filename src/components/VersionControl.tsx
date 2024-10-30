'use client';

import { useState } from 'react';
import { 
  History,  
  FileCode, 
  Compare,
  Clock, 
  ChevronRight,
  ChevronDown,
  Check,
  ArrowRight
} from 'lucide-react';

interface Version {
  id: string;
  timestamp: number;
  code: {
    react: string;
    modifiedCode: string;
  };
  description: string;
}

interface VersionControlProps {
  versions: Version[];
  currentVersion: Version | null;
  onVersionSelect: (version: Version) => void;
  onCompareSelect: (versionA: Version, versionB: Version) => void;
}

export function VersionControl({
  versions,
  currentVersion,
  onVersionSelect,
  onCompareSelect
}: VersionControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareFrom, setCompareFrom] = useState<Version | null>(null);

  const formatVersion = (index: number) => {
    return `v${index + 1}.0.0`;
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-800/50 
                   hover:bg-gray-800/70 transition-all border border-gray-700/50"
      >
        <History className="h-4 w-4 text-purple-400" />
        <span className="text-sm text-gray-300">Version History</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-80 bg-gray-900/95 backdrop-blur-xl 
                       rounded-lg border border-gray-700/50 shadow-xl z-50">
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Versions</span>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-2 py-1 text-xs rounded-md transition-all ${
                  compareMode
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Compare className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {versions.map((version, index) => (
              <div
                key={version.id}
                className={`p-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 
                           transition-all ${
                  currentVersion?.id === version.id ? 'bg-gray-800/30' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileCode className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        {formatVersion(index)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(version.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 truncate">
                      {version.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      {compareMode ? (
                        compareFrom ? (
                          <button
                            onClick={() => {
                              onCompareSelect(compareFrom, version);
                              setCompareMode(false);
                              setCompareFrom(null);
                            }}
                            className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 
                                     rounded-md hover:bg-purple-500/30 transition-all"
                          >
                            Compare with {formatVersion(
                              versions.indexOf(compareFrom)
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => setCompareFrom(version)}
                            className="px-2 py-1 text-xs bg-gray-800 text-gray-400 
                                     rounded-md hover:bg-gray-700 transition-all"
                          >
                            Select for comparison
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => onVersionSelect(version)}
                          className="px-2 py-1 text-xs bg-gray-800 text-gray-400 
                                   rounded-md hover:bg-gray-700 transition-all"
                        >
                          View code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}