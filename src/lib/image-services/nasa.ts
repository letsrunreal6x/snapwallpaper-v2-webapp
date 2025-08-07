'use server';
import type { Wallpaper } from '@/lib/definitions';

const API_KEY = process.env.NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

type ApodEntry = {
    date: string;
    explanation: string;
    hdurl: string;
    media_type: 'image' | 'video';
    service_version: string;
    title: string;
    url: string;
    copyright?: string;
};

export async function search({ per_page }: { query: string; page: number; per_page: number }): Promise<Wallpaper[]> {
  if (!API_KEY) {
    console.warn('NASA API key is not configured.');
    return [];
  }
  
  try {
    const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&count=${per_page}`);
    if (!response.ok) {
        throw new Error(`NASA API request failed with status ${response.status}`);
    }
    const data: ApodEntry[] = await response.json();

    return data
        .filter(item => item.media_type === 'image')
        .map(item => ({
            id: `nasa-${item.date}`,
            url: item.hdurl,
            previewUrl: item.url,
            author: item.copyright || 'NASA',
            authorUrl: '#',
            source: 'NASA',
            tags: [item.title.toLowerCase().split(' ')[0], 'space'],
            aiHint: 'nasa space',
            width: 1920, // APOD images don't have standard sizes, providing sensible defaults
            height: 1080,
    }));
  } catch (error) {
    console.error('Error fetching from NASA API:', error);
    return [];
  }
}
