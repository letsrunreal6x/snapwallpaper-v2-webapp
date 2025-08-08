
'use client';

import Header from '@/components/header';
import { WallpaperCard } from '@/components/wallpaper-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack, Loader2, Trash2 } from 'lucide-react';
import type { Wallpaper } from '@/lib/definitions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function FavoritesPage() {
  const { favorites, isInitialized, clearFavorites } = useFavorites();

  if (!isInitialized) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
            </main>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-3xl text-glow">Your Favorite Wallpapers</h1>
          {favorites.length > 0 && (
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all
                    your favorite wallpapers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearFavorites}>
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {favorites.map((wallpaper: Wallpaper) => (
                <WallpaperCard 
                    key={wallpaper.id}
                    wallpaper={wallpaper} 
                    query={wallpaper.query || 'favorites'}
                    viewMode="grid"
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
