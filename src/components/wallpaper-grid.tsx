
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Wallpaper } from '@/lib/definitions';
import { WallpaperCard } from './wallpaper-card';
import { Skeleton } from './ui/skeleton';
import { getWallpapers } from '@/lib/image-services/get-wallpapers';
import { InGridAdCard } from './in-grid-ad-card';
import { useToast } from '@/hooks/use-toast';

const AD_FREQUENCY = 4; // Show an ad every 4 items

function addAdsToItems(items: Wallpaper[]): (Wallpaper | { isAd: true })[] {
  const itemsWithAds: (Wallpaper | { isAd: true })[] = [];
  let wallpaperCount = 0;
  items.forEach((wallpaper) => {
    itemsWithAds.push(wallpaper);
    wallpaperCount++;
    if (wallpaperCount % AD_FREQUENCY === 0) {
      itemsWithAds.push({ isAd: true });
    }
  });
  return itemsWithAds;
}

export function WallpaperGrid({ query, reshuffleTrigger }: { query: string, reshuffleTrigger: number }) {
  const [items, setItems] = useState<(Wallpaper | { isAd: true })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const currentQueryRef = useRef(query);
  const isFetchingRef = useRef(false);
  const initialLoadRef = useRef(false);
  const { toast } = useToast();

  const loadMoreWallpapers = useCallback(async (isNewQuery = false) => {
    if (isFetchingRef.current || (!hasMore && !isNewQuery)) return;
    
    isFetchingRef.current = true;
    setIsLoading(true);

    const loadPage = isNewQuery ? 1 : page;
    
    try {
      const { wallpapers: newWallpapers, failedServices } = await getWallpapers({ query, page: loadPage, per_page: 12 });
      
      if (failedServices.length > 0) {
        toast({
            variant: 'destructive',
            title: 'Image Source Error',
            description: `Could not fetch from ${failedServices.join(', ')}. Rate limit may be exceeded.`,
        });
      }

      if (newWallpapers.length === 0 && !isNewQuery) {
        setHasMore(false);
      } else {
        setItems((prevItems) => {
            const currentWallpapers = isNewQuery ? [] : prevItems.filter(item => !('isAd' in item)) as Wallpaper[];
            // Assign the current query to each new wallpaper
            const processedNewWallpapers = newWallpapers.map(w => ({ ...w, query }));
            const updatedWallpapers = [...currentWallpapers, ...processedNewWallpapers];
            const itemsWithAds = addAdsToItems(updatedWallpapers);
            return itemsWithAds;
        });
        setPage(loadPage + 1);
        if(isNewQuery) setHasMore(true);
      }
    } catch (error) {
      console.error("Failed to load wallpapers:", error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong while fetching wallpapers.',
      });
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore, query, toast]);

  const handleReshuffle = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setItems([]); // Clear existing items
    setPage(1); // Reset page
    setHasMore(true); // Reset hasMore
    window.scrollTo(0, 0);

    try {
        const { wallpapers: newWallpapers } = await getWallpapers({ query, page: 1, per_page: 12 });
        setPage(2);
        const processedNewWallpapers = newWallpapers.map(w => ({ ...w, query }));
        const shuffledWithAds = addAdsToItems(processedNewWallpapers);
        setItems(shuffledWithAds);
    } catch(error) {
      console.error("Failed to reshuffle:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [query]);

  useEffect(() => {
    if (reshuffleTrigger > 0) {
      handleReshuffle();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reshuffleTrigger]);

  useEffect(() => {
    if (currentQueryRef.current !== query) {
        currentQueryRef.current = query;
        setItems([]);
        setPage(1);
        setHasMore(true);
        initialLoadRef.current = false; // Reset initial load flag
        window.scrollTo(0, 0);
        // Use a timeout to allow state to clear before fetching
        setTimeout(() => loadMoreWallpapers(true), 0);
    }
  }, [query, loadMoreWallpapers]);

   // Effect to load initial data
   useEffect(() => {
    if (!initialLoadRef.current && items.length === 0 && hasMore && query) {
        initialLoadRef.current = true;
        loadMoreWallpapers(true);
    }
  }, [query, items.length, hasMore, loadMoreWallpapers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current && hasMore) {
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
  }, [loadMoreWallpapers, hasMore]);
  
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item, index) => (
           ('isAd' in item) 
             ? <InGridAdCard key={`ad-${index}`} />
             : <WallpaperCard key={`${item.id}-${item.query}-${index}`} wallpaper={item} query={query} />
        ))}
        {isLoading && Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="aspect-[2/3] w-full">
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
        ))}
      </div>
      <div ref={loaderRef} className="col-span-full h-20" />
      
      {!isLoading && !hasMore && items.length > 0 && (
        <div className="text-center col-span-full py-8 text-muted-foreground">
            <p>You've reached the end of the galaxy.</p>
        </div>
      )}
    </div>
  );
}
