
import Image from 'next/image';
import type { Wallpaper } from '@/lib/definitions';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart, Download } from 'lucide-react';
import { Button } from './ui/button';
import { DownloadDialog } from './download-dialog';
import React from 'react';

export function WallpaperCard({ wallpaper, query }: { wallpaper: Wallpaper, query: string }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(wallpaper.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    toggleFavorite({ ...wallpaper, query });
  };

  return (
    <div className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg bg-card border border-transparent hover:border-primary transition-all duration-300">
        <Image
          src={wallpaper.previewUrl}
          alt={wallpaper.aiHint || `Wallpaper by ${wallpaper.author}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          data-ai-hint={wallpaper.aiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <DownloadDialog wallpaperUrl={wallpaper.url} wallpaperId={wallpaper.id} />
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-white bg-black/50 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-black/70 hover:text-secondary"
                onClick={handleFavoriteClick}
            >
                <Heart className={`w-6 h-6 transition-colors ${isCurrentlyFavorite ? 'text-secondary fill-secondary' : 'text-white'}`} />
            </Button>
        </div>
    </div>
  );
}
