
import Link from 'next/link';
import Image from 'next/image';
import type { Wallpaper } from '@/lib/definitions';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import React from 'react';

export function WallpaperCard({ wallpaper, query }: { wallpaper: Wallpaper, query: string }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isCurrentlyFavorite = isFavorite(wallpaper.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the detail page
    e.stopPropagation(); // Stop the event from bubbling up
    toggleFavorite({ ...wallpaper, query });
  };

  return (
    <div className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg">
       <Link
        href={`/wallpaper/${wallpaper.id}?q=${encodeURIComponent(query)}`}
        className="block w-full h-full"
      >
        <Image
          src={wallpaper.previewUrl}
          alt={`Wallpaper by ${wallpaper.author}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          data-ai-hint={wallpaper.aiHint}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-primary group-hover:box-glow"></div>
      </Link>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 h-10 w-10 text-white bg-black/30 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50 hover:text-secondary"
        onClick={handleFavoriteClick}
      >
        <Heart className={`w-5 h-5 transition-colors ${isCurrentlyFavorite ? 'text-secondary fill-secondary' : 'text-white'}`} />
      </Button>

      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <div className="flex flex-wrap gap-1">
          {wallpaper.tags.slice(0, 2).map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs bg-black/50 text-primary-foreground backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
         <a 
          href={wallpaper.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-2 text-sm text-primary-foreground/80 font-medium flex items-center gap-1 hover:underline"
          onClick={(e) => e.stopPropagation()}
         >
          from {wallpaper.source} <ExternalLink className="w-3 h-3"/>
        </a>
      </div>
    </div>
  );
}
