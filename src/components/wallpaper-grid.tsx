'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Wallpaper } from '@/lib/definitions';
import { WallpaperCard } from './wallpaper-card';
import { Skeleton } from './ui/skeleton';

const sources = [
  { source: "Pexels", hint: "neon city" },
  { source: "Pixabay", hint: "cyberpunk art" },
  { source: "Unsplash", hint: "galaxy stars" },
  { source: "NASA", hint: "earth space" },
  { source: "Pexels", hint: "abstract technology" },
  { source: "Pixabay", hint: "sci-fi robot" },
  { source: "Unsplash", hint: "futuristic car" },
  { source: "NASA", hint: "mars rover" },
  { source: "Pexels", hint: "glitch effect" },
  { source: "Pixabay", hint: "hacker code" },
  { source: "Unsplash", hint: "virtual reality" },
  { source: "NASA", hint: "hubble telescope" },
];

const generateWallpaper = (id: number): Wallpaper => {
  const sourceInfo = sources[id % sources.length];
  return {
    id: `wallpaper-${id}`,
    url: 'https://placehold.co/1080x1920.png',
    previewUrl: 'https://placehold.co/400x600.png',
    author: 'AI Artist',
    authorUrl: '#',
    source: sourceInfo.source,
    tags: [sourceInfo.hint.split(" ")[0], sourceInfo.hint.split(" ")[1]],
    aiHint: sourceInfo.hint,
  };
};

export function WallpaperGrid() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMoreWallpapers = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newWallpapers: Wallpaper[] = [];
    const startIndex = (page - 1) * 12;
    for (let i = 0; i < 12; i++) {
      newWallpapers.push(generateWallpaper(startIndex + i));
    }
    setWallpapers((prev) => [...prev, ...newWallpapers]);
    setPage((prev) => prev + 1);
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreWallpapers();
        }
      },
      { rootMargin: '200px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreWallpapers, isLoading]);
  
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
        ))}
      </div>
      <div ref={loaderRef} className="col-span-full">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="aspect-[2/3] w-full">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
