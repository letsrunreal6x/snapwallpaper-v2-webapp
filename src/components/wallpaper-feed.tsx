
'use client';
import type { Wallpaper } from '@/lib/definitions';
import { WallpaperCard } from './wallpaper-card';
import { InGridAdCard } from './in-grid-ad-card';
import { Skeleton } from './ui/skeleton';
import { useState, useEffect } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

interface WallpaperFeedProps {
    items: (Wallpaper | { isAd: true })[];
    isLoading: boolean;
    query: string;
    loadNextPage: () => void;
    hasMore: boolean;
}

export function WallpaperFeed({ items, isLoading, query, loadNextPage, hasMore }: WallpaperFeedProps) {
    const [index, setIndex] = useState(0);

    // When the user gets close to the end of the feed, load more wallpapers
    useEffect(() => {
        if (items.length > 0 && index >= items.length - 2 && hasMore && !isLoading) {
            loadNextPage();
        }
    }, [index, items.length, hasMore, isLoading, loadNextPage]);
    
    // Reset index when the search query changes
    useEffect(() => {
      setIndex(0);
    }, [query]);

    const [props, api] = useSprings(items.length, i => ({
        y: i * window.innerHeight,
        scale: 1,
        display: 'block',
    }));

    const bind = useDrag(({ active, movement: [, my], direction: [, yDir], distance, cancel }) => {
        if (active && distance > window.innerHeight / 4) {
            const newIndex = Math.max(0, Math.min(items.length - 1, index + (yDir > 0 ? -1 : 1)));
            setIndex(newIndex);
            cancel();
        }
        api.start(i => {
            if (i < index - 1 || i > index + 1) return { display: 'none' };
            const y = (i - index) * window.innerHeight + (active ? my : 0);
            const scale = active ? 1 - distance / window.innerHeight / 2 : 1;
            return { y, scale, display: 'block' };
        });
    });

    useEffect(() => {
        api.start(i => {
            if (i < index - 1 || i > index + 1) return { display: 'none' };
            const y = (i - index) * window.innerHeight;
            return { y, scale: 1, display: 'block' };
        });
    }, [index, api, items.length]);
    
    if (isLoading && items.length === 0) {
        return (
            <div className="relative h-[80vh] w-full max-w-lg mx-auto overflow-hidden">
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
        )
    }

    return (
        <div className="relative h-[calc(100vh-10rem)] w-full overflow-hidden">
            {props.map((springProps, i) => {
                const item = items[i];
                if (!item) return null;

                return (
                    <animated.div
                        {...bind()}
                        key={i}
                        style={{
                            ...springProps,
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            touchAction: 'none',
                        }}
                    >
                        <div className="w-full h-full max-w-lg mx-auto">
                            {'isAd' in item ? (
                                <InGridAdCard />
                            ) : (
                                <WallpaperCard 
                                    wallpaper={item} 
                                    query={query} 
                                    viewMode="feed" 
                                />
                            )}
                        </div>
                    </animated.div>
                );
            })}
        </div>
    );
}
