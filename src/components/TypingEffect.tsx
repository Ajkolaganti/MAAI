'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingEffect({ text, speed = 10, onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <pre className="font-mono text-sm whitespace-pre-wrap">
      <code className="text-gray-300">{displayedText}</code>
    </pre>
  );
}