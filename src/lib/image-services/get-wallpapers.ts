'use server';
import { search as pexelsSearch } from './pexels';
import { search as pixabaySearch } from './pixabay';
import { search as unsplashSearch } from './unsplash';
import { search as nasaSearch } from './nasa';
import type { Wallpaper } from '@/lib/definitions';

type GetWallpapersParams = {
  query: string;
  page: number;
  per_page: number;
};

const services = [
  { name: 'Pexels', search: pexelsSearch, enabled: !!process.env.PEXELS_API_KEY },
  { name: 'Pixabay', search: pixabaySearch, enabled: !!process.env.PIXABAY_API_KEY },
  { name: 'Unsplash', search: unsplashSearch, enabled: !!process.env.UNSPLASH_ACCESS_KEY },
  { name: 'NASA', search: nasaSearch, enabled: !!process.env.NASA_API_KEY },
];

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function getWallpapers({ query, page, per_page }: GetWallpapersParams): Promise<Wallpaper[]> {
  const activeServices = services.filter(s => s.enabled);
  if (activeServices.length === 0) {
    console.warn("No image services are configured. Please add API keys to your .env file.");
    return [];
  }
  
  const perServicePageSize = Math.ceil(per_page / activeServices.length);
  
  const promises = activeServices.map(service => 
    service.search({ query, page, per_page: perServicePageSize })
      .catch(error => {
        console.error(`Error fetching from ${service.name}:`, error);
        return [];
      })
  );

  const results = await Promise.all(promises);
  
  const allWallpapers = results.flat();
  return shuffleArray(allWallpapers);
}