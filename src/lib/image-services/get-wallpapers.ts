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
  { name: 'Pexels', search: pexelsSearch },
  { name: 'Pixabay', search: pixabaySearch },
  { name: 'Unsplash', search: unsplashSearch },
  { name: 'NASA', search: nasaSearch },
];

export async function getWallpapers({ query, page, per_page }: GetWallpapersParams): Promise<Wallpaper[]> {
  const perServicePageSize = Math.ceil(per_page / services.length);
  
  const promises = services.map(service => 
    service.search({ query, page, per_page: perServicePageSize })
      .catch(error => {
        console.error(`Error fetching from ${service.name}:`, error);
        return []; // Return empty array on error to not fail the whole request
      })
  );

  const results = await Promise.all(promises);
  
  // Flatten and shuffle the results
  const allWallpapers = results.flat();
  return shuffleArray(allWallpapers);
}


function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
