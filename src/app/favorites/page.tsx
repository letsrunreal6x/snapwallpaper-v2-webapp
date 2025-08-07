
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { WallpaperGrid } from '@/components/wallpaper-grid';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteWallpapers, setFavoriteWallpapers] = useState<any[]>([]);

  useEffect(() => {
    // Since favorites from localStorage are just objects, we map them
    // to match the expected Wallpaper type for WallpaperGrid if needed,
    // or just pass them if the grid is flexible. For now, we'll assume
    // the grid can handle the stored favorite objects.
    setFavoriteWallpapers(favorites);
  }, [favorites]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="font-headline text-3xl text-glow mb-8">Your Favorite Wallpapers</h1>
        {favoriteWallpapers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {favoriteWallpapers.map((wallpaper, index) => (
                <div key={`${wallpaper.id}-${index}`} className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg">
                    <Link
                        href={`/wallpaper/${wallpaper.id}?q=${encodeURIComponent(wallpaper.query || 'favorites')}`}
                        className="block w-full h-full"
                    >
                        <img
                            src={wallpaper.previewUrl}
                            alt={`Wallpaper by ${wallpaper.author}`}
                            className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                         <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-primary group-hover:box-glow"></div>
                    </Link>
                </div>

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
