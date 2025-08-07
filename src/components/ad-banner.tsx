'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export default function AdBanner() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2">
      <div className="container mx-auto">
      <div className="relative flex items-center justify-center h-16 bg-card/80 border border-secondary/50 rounded-lg p-4 text-center text-sm text-secondary backdrop-blur-sm">
        <p className="font-code text-glow-secondary animate-pulse">
          [ Simulated Banner Ad - Your Next Favorite App Awaits! ]
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close Ad</span>
        </Button>
      </div>
      </div>
    </div>
  );
}
