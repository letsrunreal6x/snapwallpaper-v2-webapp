'use server';
import { createClient, PhotosWithTotalResults, ErrorResponse } from 'pexels';
import type { Wallpaper } from '@/lib/definitions';

const getClient = () => {
    if (!process.env.PEXELS_API_KEY) {
        return null;
    }
    return createClient(process.env.PEXELS_API_KEY);
}


export async function search({ query, page, per_page }: { query: string; page: number; per_page: number }): Promise<Wallpaper[]> {
  const client = getClient();
  if (!client) {
      console.warn('Pexels API key is not configured.');
      return [];
  }

  try {
    const response: PhotosWithTotalResults | ErrorResponse = await client.photos.search({ query, page, per_page, orientation: 'portrait' });
    
    if ('error' in response) {
        console.error('Pexels API error:', response.error);
        return [];
    }

    return response.photos.map(photo => ({
        id: `pexels-${photo.id}`,
        url: photo.src.original,
        previewUrl: photo.src.large,
        author: photo.photographer,
        authorUrl: photo.photographer_url,
        source: 'Pexels',
        tags: query.split(' '),
        aiHint: `${photo.alt?.split(' ')[0]} ${photo.alt?.split(' ')[1]}`,
        width: photo.width,
        height: photo.height,
    }));
  } catch (error) {
      console.error('Error fetching from Pexels API:', error);
      return [];
  }
}
