
import Image from 'next/image';
import type { Wallpaper } from '@/lib/definitions';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart } from 'lucide-react';
import { DownloadDialog } from './download-dialog';
import React from 'react';
import { cn } from '@/lib/utils';
import { useHaptics } from '@/hooks/use-haptics';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  query: string;
  viewMode: 'grid' | 'feed';
  style?: React.CSSProperties;
}


function WallpaperCardComponent({ wallpaper, query, viewMode, style }: WallpaperCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(wallpaper.id);
  const { impactLight } = useHaptics();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    toggleFavorite({ ...wallpaper, query });
    impactLight();
  };

  return (
    <div 
      style={style}
      className={cn(
        "group relative block w-full overflow-hidden rounded-lg bg-card border border-transparent transition-all duration-300",
        viewMode === 'grid' && "aspect-[2/3] hover:border-primary",
        viewMode === 'feed' && "h-full"
      )}
    >
        <Image
          src={wallpaper.previewUrl}
          alt={wallpaper.aiHint || `Wallpaper by ${wallpaper.author}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            "object-cover",
            viewMode === 'grid' && 'transition-transform duration-300 ease-in-out group-hover:scale-110'
          )}
          data-ai-hint={wallpaper.aiHint}
          priority={viewMode === 'feed'}
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
