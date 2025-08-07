
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Wallpaper } from '@/lib/definitions';
import { WallpaperCard } from './wallpaper-card';
import { Skeleton } from './ui/skeleton';
import { getWallpapers } from '@/lib/image-services/get-wallpapers';
import { InGridAdCard } from './in-grid-ad-card';

const AD_FREQUENCY = 8; // Show an ad every 8 items

export function WallpaperGrid({ query }: { query: string }) {
  const [items, setItems] = useState<(Wallpaper | { isAd: true })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const currentQueryRef = useRef(query);

  const loadMoreWallpapers = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newWallpapers = await getWallpapers({ query, page, per_page: 12 });
      if (newWallpapers.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => {
            const newItems: (Wallpaper | { isAd: true })[] = [...prevItems];
            const wallpaperOnlyCount = newItems.filter(item => !('isAd' in item)).length;
            
            newWallpapers.forEach((wallpaper, index) => {
                const currentTotalWallpapers = wallpaperOnlyCount + index + 1;
                // Add wallpaper
                newItems.push(wallpaper);
                // Check if we should add an ad
                if (currentTotalWallpapers % AD_FREQUENCY === 0) {
                    newItems.push({ isAd: true });
                }
            });

            // Filter out duplicate wallpapers just in case
            const uniqueNewItems: (Wallpaper | { isAd: true })[] = [];
            const seenIds = new Set();
            newItems.forEach(item => {
                if ('isAd' in item) {
                    uniqueNewItems.push(item); // Keep ad placeholders
                } else if (!seenIds.has(item.id)) {
                    uniqueNewItems.push(item);
                    seenIds.add(item.id);
                }
            });

            return uniqueNewItems;
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load wallpapers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, query]);

  useEffect(() => {
    // If query changes, reset everything
    if (currentQueryRef.current !== query) {
        currentQueryRef.current = query;
        setItems([]);
        setPage(1);
        setHasMore(true);
    }
  }, [query]);

   // Effect to load initial data or data when query has changed
   useEffect(() => {
    // Only load if items are empty and we have a query to work with
    if (items.length === 0 && hasMore && query) {
       loadMoreWallpapers();
    }
  }, [items.length, hasMore, query, loadMoreWallpapers]);

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
        {items.map((item, index) => (
           ('isAd' in item) 
             ? <InGridAdCard key={`ad-${index}`} />
             : <WallpaperCard key={`${item.id}-${index}`} wallpaper={item} query={query} />
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
