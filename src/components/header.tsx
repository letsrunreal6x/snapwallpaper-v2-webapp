
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { PremiumDialog } from './premium-dialog';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-3xl font-bold text-glow tracking-wider animate-flicker">
            SnapWallpaper
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <PremiumDialog />
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
