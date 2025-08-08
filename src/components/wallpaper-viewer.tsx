
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { X, Heart, Wallpaper as WallpaperIcon, Loader2 } from 'lucide-react';
import type { Wallpaper } from '@/lib/definitions';
import { useFavorites } from '@/hooks/use-favorites';
import { DownloadDialog } from './download-dialog';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { usePinch } from 'react-use-pinch-zoom';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';


interface WallpaperViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallpapers: Wallpaper[];
  startIndex: number;
  onIndexChange: (index: number) => void;
}

function ZoomableImage({ wallpaper, onSwipeDown, priority }: { wallpaper: Wallpaper, onSwipeDown: () => void, priority: boolean }) {
  const target = React.useRef(null);
  const {
    x,
    y,
    scale,
    isPanning,
    setTransform
  } = usePinch({
    minScale: 1,
    maxScale: 4,
    onSwipe: (event) => {
        if (event.direction === 'down' && event.distance > 80 && scale === 1) {
            onSwipeDown();
        }
    }
  });

  const handleDoubleClick = () => {
    if (scale > 1) {
        setTransform({ scale: 1, x: 0, y: 0, config: { duration: 200 } });
    } else {
        setTransform({ scale: 3, config: { duration: 200 } });
    }
  }


  return (
    <div
      ref={target}
      className="relative w-full h-full max-w-full max-h-full touch-none"
      onDoubleClick={handleDoubleClick}
      style={{ touchAction: 'none' }} // Critical for gesture handling
    >
      <Image
        src={wallpaper.url}
        alt={wallpaper.aiHint || `Wallpaper by ${wallpaper.author}`}
        fill
        sizes="100vw"
        className={cn("object-contain transition-transform duration-300 ease-in-out", isPanning ? 'cursor-grabbing' : 'cursor-grab')}
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: 'center center',
          touchAction: 'none',
        }}
        draggable={false}
        priority={priority}
      />
    </div>
  );
}


export function WallpaperViewer({ open, onOpenChange, wallpapers, startIndex, onIndexChange }: WallpaperViewerProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    startIndex: startIndex,
    align: 'center',
  });
  const { toggleFavorite, isFavorite } = useFavorites();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isSettingWallpaper, setIsSettingWallpaper] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (emblaApi) {
        if (open && emblaApi.selectedScrollSnap() !== startIndex) {
            emblaApi.scrollTo(startIndex, true);
        }
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  }, [open, startIndex, emblaApi]);

  const onSelect = useCallback(() => {
    if (emblaApi) {
      const newIndex = emblaApi.selectedScrollSnap();
      setCurrentIndex(newIndex);
      onIndexChange(newIndex);
    }
  }, [emblaApi, onIndexChange]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      return () => emblaApi.off('select', onSelect);
    }
  }, [emblaApi, onSelect]);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  if (!open || wallpapers.length === 0) return null;

  const currentWallpaper = wallpapers[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 m-0 bg-black/80 backdrop-blur-sm border-none w-full h-full max-w-full max-h-screen rounded-none flex flex-col"
        onInteractOutside={(e) => e.preventDefault()} // Prevents closing on outside click
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
          {currentWallpaper && (
            <div className="flex flex-col">
              <h3 className="font-bold text-white text-lg drop-shadow-lg">{currentWallpaper.aiHint || `Wallpaper`}</h3>
              <a href={currentWallpaper.authorUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:underline drop-shadow-lg">
                  by {currentWallpaper.author || 'Unknown'} on {currentWallpaper.source || 'Unknown'}
              </a>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white" onClick={handleClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Carousel */}
        <div className="embla flex-grow h-full" ref={emblaRef}>
          <div className="embla__container h-full">
            {wallpapers.map((wallpaper, index) => (
              <div key={`${wallpaper.id}-${index}`} className="embla__slide flex items-center justify-center h-full relative p-4">
                 {/* Only render the ZoomableImage for visible slides to optimize performance */}
                 {(index >= currentIndex - 1 && index <= currentIndex + 1) ? (
                   <ZoomableImage wallpaper={wallpaper} onSwipeDown={handleClose} priority={index === startIndex} />
                 ) : (
                    <div className="w-full h-full bg-transparent" /> // Placeholder for non-visible slides
                 )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center items-center p-4 gap-4 bg-gradient-to-t from-black/50 to-transparent">
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
