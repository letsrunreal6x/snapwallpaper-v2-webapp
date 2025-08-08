
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Wallpaper } from '@/lib/definitions';
import { Capacitor } from '@capacitor/core';


const FAVORITES_KEY = 'snapwallpaper_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client-side
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && Capacitor.isBrowser) {
        try {
            const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Could not read favorites from localStorage", error);
            setFavorites([]);
        }
    }
  }, [isReady]);

  const saveFavorites = (newFavorites: Wallpaper[]) => {
    if (Capacitor.isBrowser) {
        try {
            setFavorites(newFavorites);
            window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        } catch (error) {
            console.error("Could not save favorites to localStorage", error);
        }
    } else {
        // On native, you might use Capacitor's Storage API
        setFavorites(newFavorites);
    }
  };

  const addFavorite = useCallback((wallpaper: Wallpaper) => {
    setFavorites(f => [...f, wallpaper]);
  }, []);

  const removeFavorite = useCallback((wallpaperId: string) => {
     setFavorites(f => f.filter((fav) => fav.id !== wallpaperId));
  }, []);

  const isFavorite = useCallback((wallpaperId: string) => {
    return favorites.some((fav) => fav.id === wallpaperId);
  }, [favorites]);

  const toggleFavorite = useCallback((wallpaper: Wallpaper) => {
    const currentlyFavorite = isFavorite(wallpaper.id);
    let newFavorites;
    if (currentlyFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== wallpaper.id);
    } else {
      newFavorites = [...favorites, wallpaper];
    }
    saveFavorites(newFavorites);
  }, [isFavorite, favorites]); // `addFavorite` and `removeFavorite` are not stable, so we inline logic

  return { favorites, toggleFavorite, isFavorite };
};
