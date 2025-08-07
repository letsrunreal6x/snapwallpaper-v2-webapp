
'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Heart, Home, Lock, Share2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DownloadDialog } from '@/components/download-dialog';
import { getWallpapers } from '@/lib/image-services/get-wallpapers';
import { Wallpaper } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

// This component now fetches all wallpapers for the given query
// to enable client-side navigation.
export default function WallpaperPage({ params, searchParams }: { params: { id: string }, searchParams: { q: string } }) {
  const router = useRouter();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(params.id);

  const query = searchParams.q || 'sci-fi';

  useEffect(() => {
    const fetchWallpapers = async () => {
      if (!id) return;
      setIsLoading(true);
      // Fetch a larger list to make swiping more meaningful
      const fetchedWallpapers = await getWallpapers({ query, page: 1, per_page: 50 });
      setWallpapers(fetchedWallpapers);
      const index = fetchedWallpapers.findIndex(w => w.id === id);
      setCurrentIndex(index);
      setIsLoading(false);
    };

    fetchWallpapers();
  }, [query, id]);

  const navigateToWallpaper = useCallback((index: number) => {
    if (index >= 0 && index < wallpapers.length) {
      const wallpaper = wallpapers[index];
      router.push(`/wallpaper/${wallpaper.id}?q=${encodeURIComponent(query)}`);
    }
  }, [wallpapers, router, query]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < wallpapers.length - 1) {
      navigateToWallpaper(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      navigateToWallpaper(currentIndex - 1);
    }
  };

  // Touch handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleSwipe('left');
    } else if (isRightSwipe) {
      handleSwipe('right');
    }
    
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  if (isLoading || currentIndex === -1) {
    return (
      <div className="relative w-full h-screen bg-background">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }
  
  const wallpaper = wallpapers[currentIndex];
  if (!wallpaper) {
      return (
          <div className="relative w-full h-screen flex items-center justify-center bg-background text-foreground">
              <p>Wallpaper not found or failed to load.</p>
               <Button asChild variant="ghost" size="icon" className="absolute top-5 left-5 z-20 h-12 w-12 bg-black/30 hover:bg-black/50 text-white hover:text-primary">
                <Link href="/">
                  <ArrowLeft className="h-6 w-6" />
                </Link>
              </Button>
          </div>
      )
  }

  return (
    <div className="relative w-full h-screen" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <Image
        key={wallpaper.id}
        src={wallpaper.url}
        alt={`Wallpaper ${wallpaper.id}`}
        fill
        className="object-cover animate-fade-in"
        data-ai-hint={wallpaper.aiHint}
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <Button asChild variant="ghost" size="icon" className="absolute top-5 left-5 z-20 h-12 w-12 bg-black/30 hover:bg-black/50 text-white hover:text-primary">
        <Link href="/">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </Button>

       {/* Prev/Next buttons for non-touch devices */}
      <Button 
        variant="ghost" size="icon" 
        className="absolute top-1/2 left-2 -translate-y-1/2 z-20 h-14 w-14 bg-black/30 hover:bg-black/50 text-white hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
        onClick={() => handleSwipe('right')}
        disabled={currentIndex <= 0}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
       <Button 
        variant="ghost" size="icon" 
        className="absolute top-1/2 right-2 -translate-y-1/2 z-20 h-14 w-14 bg-black/30 hover:bg-black/50 text-white hover:text-primary disabled:opacity-20 disabled:cursor-not-allowed hidden md:flex"
        onClick={() => handleSwipe('left')}
        disabled={currentIndex >= wallpapers.length - 1}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-center md:text-left">
              <h1 className="font-headline text-2xl font-bold text-glow">
                Cosmic Drift
              </h1>
              <p>by <a href={wallpaper.authorUrl} className="underline hover:text-primary">{wallpaper.author}</a> from <a href={wallpaper.sourceUrl} className="underline hover:text-primary">{wallpaper.source}</a></p>
            </div>

            <div className="flex items-center gap-2 bg-black/50 border border-border p-2 rounded-full">
              <DownloadDialog wallpaperUrl={wallpaper.url} wallpaperId={wallpaper.id} />
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10 rounded-full h-12 w-12">
                <Share2 className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10 rounded-full h-12 w-12">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

             <div className="flex items-center gap-2 bg-black/50 border border-border p-2 rounded-full">
              <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/10 rounded-full h-12 gap-2 px-4" disabled>
                <Home className="w-5 h-5" /> Set Home
              </Button>
              <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/10 rounded-full h-12 gap-2 px-4" disabled>
                <Lock className="w-5 h-5" /> Set Lock
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
