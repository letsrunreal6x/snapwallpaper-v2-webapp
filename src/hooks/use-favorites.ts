
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Wallpaper } from '@/lib/definitions';

const FAVORITES_KEY = 'snapwallpaper_favorites';

// Helper to get favorites from localStorage safely
const getStoredFavorites = (): Wallpaper[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error("Could not read favorites from localStorage", error);
    return [];
  }
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage only after the component has mounted on the client
  useEffect(() => {
    setFavorites(getStoredFavorites());
    setIsInitialized(true);
  }, []);

  // Effect to update localStorage whenever favorites change
  useEffect(() => {
    // Only update localStorage if initialization is complete to avoid overwriting on first render
    if (isInitialized) {
      try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Could not save favorites to localStorage", error);
      }
    }
  }, [favorites, isInitialized]);

  const isFavorite = useCallback((wallpaperId: string): boolean => {
    return favorites.some((fav) => fav.id === wallpaperId);
  }, [favorites]);

  const toggleFavorite = useCallback((wallpaper: Wallpaper) => {
    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.some(fav => fav.id === wallpaper.id);
      if (isCurrentlyFavorite) {
        return prevFavorites.filter(fav => fav.id !== wallpaper.id);
      } else {
        // Prevent adding duplicates from the old buggy system
        if (prevFavorites.some(fav => fav.id === wallpaper.id)) {
            return prevFavorites;
        }
        return [...prevFavorites, wallpaper];
      }
    });
  }, []);
  
  return { favorites, toggleFavorite, isFavorite, isInitialized };
};
