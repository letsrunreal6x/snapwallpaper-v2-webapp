
import Image from 'next/image';
import type { Wallpaper } from '@/lib/definitions';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart } from 'lucide-react';
import { DownloadDialog } from './download-dialog';
import React from 'react';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  query: string;
}


function WallpaperCardComponent({ wallpaper, query }: WallpaperCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(wallpaper.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    toggleFavorite({ ...wallpaper, query });
  };

  return (
    <div 
      className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg bg-card border border-transparent hover:border-primary transition-all duration-300"
    >
        <Image
          src={wallpaper.previewUrl}
          alt={wallpaper.aiHint || `Wallpaper by ${wallpaper.author}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          data-ai-hint={wallpaper.aiHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center transition-opacity duration-300">
            <div onClick={(e) => e.stopPropagation()}><DownloadDialog wallpaperUrl={wallpaper.url} wallpaperId={wallpaper.id} /></div>
            <button 
                className="text-white bg-black/50 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-black/70 hover:text-secondary flex items-center justify-center transition-all"
                onClick={handleFavoriteClick}
            >
                <Heart className={`w-6 h-6 transition-colors ${isCurrentlyFavorite ? 'text-secondary fill-secondary' : 'text-white'}`} />
            </button>
        </div>
    </div>
  );
}

// Memoize the component to prevent re-renders when parent state changes
export const WallpaperCard = React.memo(WallpaperCardComponent);
