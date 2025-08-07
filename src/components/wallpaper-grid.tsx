'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Wallpaper } from '@/lib/definitions';
import { WallpaperCard } from './wallpaper-card';
import { Skeleton } from './ui/skeleton';
import { getWallpapers } from '@/lib/image-services/get-wallpapers';

export function WallpaperGrid() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [currentQuery, setCurrentQuery] = useState('sci-fi');

  const loadMoreWallpapers = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newWallpapers = await getWallpapers({ query: currentQuery, page, per_page: 12 });
      if (newWallpapers.length === 0) {
        setHasMore(false);
      } else {
        setWallpapers((prev) => {
            const existingIds = new Set(prev.map(w => w.id));
            const uniqueNewWallpapers = newWallpapers.filter(w => !existingIds.has(w.id));
            return [...prev, ...uniqueNewWallpapers];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load wallpapers:", error);
      // Optionally, handle the error in the UI
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, currentQuery]);

  useEffect(() => {
    // Reset and load wallpapers when query changes
    setWallpapers([]);
    setPage(1);
    setHasMore(true);
  }, [currentQuery]);

   useEffect(() => {
    if (page === 1 && hasMore) {
       loadMoreWallpapers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore]); // Only re-run when page or hasMore changes.

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
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
  }, [loadMoreWallpapers, isLoading, hasMore]);
  
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wallpapers.map((wallpaper) => (
          <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
        ))}
      </div>
      <div ref={loaderRef} className="col-span-full h-20">
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
      {!isLoading && !hasMore && (
        <div className="text-center col-span-full py-8 text-muted-foreground">
            <p>You've reached the end of the galaxy.</p>
        </div>
      )}
    </div>
  );
}
