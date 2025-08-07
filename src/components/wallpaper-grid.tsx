
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { Wallpaper } from '@/lib/definitions';
import { WallpaperCard } from './wallpaper-card';
import { Skeleton } from './ui/skeleton';
import { getWallpapers } from '@/lib/image-services/get-wallpapers';
import { InGridAdCard } from './in-grid-ad-card';

const AD_FREQUENCY = 4; // Show an ad every 4 items

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function WallpaperGrid({ query }: { query: string }) {
  const [items, setItems] = useState<(Wallpaper | { isAd: true })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const currentQueryRef = useRef(query);
  const pathname = usePathname();
  const lastPathnameRef = useRef(pathname);

  // Reshuffle on navigating back to home
  useEffect(() => {
    const lastPathname = lastPathnameRef.current;
    if (pathname === '/' && lastPathname !== '/') {
      setItems((prevItems) => shuffleArray([...prevItems]));
      window.scrollTo(0, 0);
    }
    lastPathnameRef.current = pathname;
  }, [pathname]);

  // Reshuffle when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setItems((prevItems) => shuffleArray([...prevItems]));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
            const currentItems = isNewQuery ? [] : prevItems;
            const newItemsWithAds: (Wallpaper | { isAd: true })[] = [...currentItems];
            
            newWallpapers.forEach((wallpaper) => {
              newItemsWithAds.push(wallpaper);
              // Add an ad after a certain number of wallpapers
              const wallpaperCount = newItemsWithAds.filter(item => !('isAd' in item)).length;
              if (wallpaperCount > 0 && wallpaperCount % AD_FREQUENCY === 0) {
                  newItemsWithAds.push({ isAd: true });
              }
            });

            return isNewQuery ? shuffleArray(newItemsWithAds) : newItemsWithAds;
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
        window.scrollTo(0, 0);
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
