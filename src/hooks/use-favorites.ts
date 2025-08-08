
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Wallpaper } from '@/lib/definitions';

const FAVORITES_KEY = 'snapwallpaper_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage only after the component has mounted on the client
  useEffect(() => {
    // This check ensures localStorage is only accessed on the client side.
    if (typeof window !== 'undefined') {
      try {
        const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
        setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      } catch (error) {
        console.error("Could not read favorites from localStorage", error);
        setFavorites([]);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Effect to update localStorage whenever favorites change
  useEffect(() => {
    // Only update localStorage if initialization is complete to avoid overwriting on first render
    // and only run on the client.
    if (isInitialized && typeof window !== 'undefined') {
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
        // Prevent adding duplicates just in case
        if (prevFavorites.some(fav => fav.id === wallpaper.id)) {
            return prevFavorites;
        }
        return [...prevFavorites, wallpaper];
      }
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);
  
  return { favorites, toggleFavorite, isFavorite, isInitialized, clearFavorites };
};
