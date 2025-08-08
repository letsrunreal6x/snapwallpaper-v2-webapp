
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
  // Initialize state directly from localStorage
  const [favorites, setFavorites] = useState<Wallpaper[]>(getStoredFavorites);

  // Effect to update localStorage whenever favorites change
  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
    }
  }, [favorites]);

  const isFavorite = useCallback((wallpaperId: string): boolean => {
    // Check if a wallpaper with the given ID exists in the favorites list
    return favorites.some((fav) => fav.id === wallpaperId);
  }, [favorites]);

  const toggleFavorite = useCallback((wallpaper: Wallpaper) => {
    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.some(fav => fav.id === wallpaper.id);
      if (isCurrentlyFavorite) {
        // Remove the wallpaper if it's already a favorite
        return prevFavorites.filter(fav => fav.id !== wallpaper.id);
      } else {
        // Add the wallpaper if it's not a favorite
        return [...prevFavorites, wallpaper];
      }
    });
  }, []);
  
  return { favorites, toggleFavorite, isFavorite };
};
