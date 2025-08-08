
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { X, Heart } from 'lucide-react';
import type { Wallpaper } from '@/lib/definitions';
import { useFavorites } from '@/hooks/use-favorites';
import { DownloadDialog } from './download-dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface WallpaperViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallpapers: Wallpaper[];
  startIndex: number;
}

export function WallpaperViewer({ open, onOpenChange, wallpapers, startIndex }: WallpaperViewerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: startIndex,
    align: 'center',
  });
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (open && emblaApi) {
        emblaApi.scrollTo(startIndex, true);
        setCurrentIndex(startIndex);
    }
  }, [open, startIndex, emblaApi]);

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      return () => emblaApi.off('select', onSelect);
    }
  }, [emblaApi, onSelect]);

  if (!open || wallpapers.length === 0) return null;

  const currentWallpaper = wallpapers[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 m-0 bg-black/80 backdrop-blur-sm border-none w-full h-full max-w-full max-h-screen rounded-none flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
          {currentWallpaper && (
            <div className="flex flex-col">
              <h3 className="font-bold text-white text-lg drop-shadow-lg">{currentWallpaper.aiHint || `Wallpaper`}</h3>
              <a href={currentWallpaper.authorUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:underline drop-shadow-lg">
                  by {currentWallpaper.author || 'Unknown'} on {currentWallpaper.source || 'Unknown'}
              </a>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white" onClick={() => onOpenChange(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Carousel */}
        <div className="embla flex-grow h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {wallpapers.map((wallpaper, index) => (
              <div key={wallpaper.id} className="embla__slide flex items-center justify-center h-full relative p-4">
                <div className="relative w-full h-full max-w-full max-h-full">
                   <Image
                      src={wallpaper.url}
                      alt={wallpaper.aiHint || `Wallpaper by ${wallpaper.author}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={index === startIndex}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center p-4 gap-4 bg-gradient-to-t from-black/50 to-transparent">
            {currentWallpaper && (
                <>
                <div onClick={(e) => e.stopPropagation()}><DownloadDialog wallpaperUrl={currentWallpaper.url} wallpaperId={currentWallpaper.id} /></div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white bg-black/50 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-black/70 hover:text-secondary"
                    onClick={() => toggleFavorite(currentWallpaper)}
                >
                    <Heart className={cn("w-6 h-6 transition-colors", isFavorite(currentWallpaper.id) ? 'text-secondary fill-secondary' : 'text-white')} />
                </Button>
                </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
