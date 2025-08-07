import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-headline text-3xl font-bold text-glow tracking-wider animate-flicker">
            AstroWalls
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/api-keys">
              <Wrench className="h-5 w-5 text-primary hover:text-glow transition-all" />
              <span className="sr-only">API Key Management</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
