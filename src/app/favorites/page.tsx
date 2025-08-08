
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { WallpaperCard } from '@/components/wallpaper-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';
import type { Wallpaper } from '@/lib/definitions';


export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteWallpapers, setFavoriteWallpapers] = useState<Wallpaper[]>([]);

  useEffect(() => {
    // Deduplicate favorites in case of any data inconsistency
    const uniqueFavorites = Array.from(new Map(favorites.map(item => [item.id, item])).values());
    setFavoriteWallpapers(uniqueFavorites);
  }, [favorites]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="font-headline text-3xl text-glow mb-8">Your Favorite Wallpapers</h1>
        {favoriteWallpapers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {favoriteWallpapers.map((wallpaper) => (
                <WallpaperCard 
                    key={wallpaper.id}
                    wallpaper={wallpaper} 
                    query={wallpaper.query || 'favorites'} 
                />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg">
            <HeartCrack className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold font-headline text-muted-foreground">No Favorites Yet</h2>
            <p className="text-muted-foreground mt-2">Click the heart on a wallpaper to save it.</p>
            <Button asChild className="mt-6">
              <Link href="/">Find Wallpapers</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
