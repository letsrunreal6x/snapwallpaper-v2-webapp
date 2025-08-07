'use server';
import type { Wallpaper } from '@/lib/definitions';

const API_KEY = process.env.PIXABAY_API_KEY;
const BASE_URL = 'https://pixabay.com/api/';

type PixabayImage = {
    id: number;
    pageURL: string;
    type: string;
    tags: string;
    previewURL: string;
    webformatURL: string;
    largeImageURL: string;
    user: string;
    userImageURL: string;
    user_id: number;
    imageWidth: number;
    imageHeight: number;
};

export async function search({ query, page, per_page }: { query: string; page: number; per_page: number }): Promise<Wallpaper[]> {
    if (!API_KEY) {
        console.warn('Pixabay API key is not configured.');
        return [];
    }

    const params = new URLSearchParams({
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'vertical',
        page: page.toString(),
        per_page: per_page.toString(),
        safesearch: 'true',
    });

    try {
        const response = await fetch(`${BASE_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Pixabay API request failed with status ${response.status}`);
        }
        const data = await response.json();

        return data.hits.map((image: PixabayImage) => ({
            id: `pixabay-${image.id}`,
            url: image.largeImageURL,
            previewUrl: image.webformatURL,
            author: image.user,
            authorUrl: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
            source: 'Pixabay',
            sourceUrl: image.pageURL,
            tags: image.tags.split(', '),
            aiHint: image.tags.split(', ').slice(0, 2).join(' '),
            width: image.imageWidth,
            height: image.imageHeight,
        }));
    } catch (error) {
        console.error('Error fetching from Pixabay API:', error);
        return [];
    }
}
