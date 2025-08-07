
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

  const loadMoreWallpapers = useCallback(async (isNewQuery = false) => {
    if (isLoading || (!hasMore && !isNewQuery)) return;
    
    setIsLoading(true);

    const loadPage = isNewQuery ? 1 : page;
    
    try {
      const newWallpapers = await getWallpapers({ query, page: loadPage, per_page: 12 });
      if (newWallpapers.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => {
            const currentWallpapers = isNewQuery ? [] : prevItems.filter(item => !('isAd' in item));
            const allWallpapers = [...currentWallpapers, ...newWallpapers];
            
            // Re-build the list with ads
            const newItemsWithAds: (Wallpaper | { isAd: true })[] = [];
            const seenIds = new Set(currentWallpapers.map(w => w.id));

            allWallpapers.forEach((wallpaper) => {
                if (!seenIds.has(wallpaper.id)) {
                    newItemsWithAds.push(wallpaper);
                    seenIds.add(wallpaper.id);
                    if (newItemsWithAds.filter(item => !('isAd' in item)).length % AD_FREQUENCY === 0) {
                        newItemsWithAds.push({ isAd: true });
                    }
                }
            });

            return newItemsWithAds;
        });
        setPage(loadPage + 1);
        if(isNewQuery) setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to load wallpapers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, query]);

  useEffect(() => {
    if (currentQueryRef.current !== query) {
        currentQueryRef.current = query;
        setItems([]);
        setPage(1);
        setHasMore(true);
        // Use a timeout to allow state to clear before fetching
        setTimeout(() => loadMoreWallpapers(true), 0);
    }
  }, [query, loadMoreWallpapers]);

   // Effect to load initial data
   useEffect(() => {
    if (items.length === 0 && hasMore && query) {
       loadMoreWallpapers(true);
    }
    // We only want this to run once on initial load or if query was cleared then re-populated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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
      {!isLoading && !hasMore && items.length > 0 && (
        <div className="text-center col-span-full py-8 text-muted-foreground">
            <p>You've reached the end of the galaxy.</p>
        </div>
      )}
    </div>
  );
}
