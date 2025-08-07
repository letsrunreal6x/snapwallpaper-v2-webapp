
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Wallpaper } from '@/lib/definitions';

const FAVORITES_KEY = 'snapwallpaper_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
        console.error("Could not read favorites from localStorage", error);
        setFavorites([]);
    }
  }, []);

  const saveFavorites = (newFavorites: Wallpaper[]) => {
    try {
        setFavorites(newFavorites);
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
        console.error("Could not save favorites to localStorage", error);
    }
  };

  const addFavorite = useCallback((wallpaper: Wallpaper) => {
    const newFavorites = [...favorites, wallpaper];
    saveFavorites(newFavorites);
  }, [favorites]);

  const removeFavorite = useCallback((wallpaperId: string) => {
    const newFavorites = favorites.filter((fav) => fav.id !== wallpaperId);
    saveFavorites(newFavorites);
  }, [favorites]);

  const isFavorite = useCallback((wallpaperId: string) => {
    return favorites.some((fav) => fav.id === wallpaperId);
  }, [favorites]);

  const toggleFavorite = useCallback((wallpaper: Wallpaper) => {
    if (isFavorite(wallpaper.id)) {
      removeFavorite(wallpaper.id);
    } else {
      addFavorite(wallpaper);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, toggleFavorite, isFavorite };
};
