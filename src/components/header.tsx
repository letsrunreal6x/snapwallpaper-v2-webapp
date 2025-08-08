
'use client';

import Link from 'next/link';
import { Heart, Star, Home } from 'lucide-react';
import { Button } from './ui/button';
import { PremiumDialog } from './premium-dialog';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Force a full page reload to clear old images and fetch new ones
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" onClick={handleHomeClick} className="flex items-center space-x-2">
          <span className="font-headline text-3xl font-bold text-glow tracking-wider animate-flicker">
            SnapWallpaper
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <PremiumDialog />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" onClick={handleHomeClick}>
                <Home className="h-5 w-5 text-primary hover:text-glow transition-all" />
                <span className="sr-only">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/favorites">
              <Heart className="h-5 w-5 text-secondary hover:text-glow-secondary transition-all" />
              <span className="sr-only">Favorites</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
