'use server';
import { createApi } from 'unsplash-js';
import type { Wallpaper } from '@/lib/definitions';
import type { Photos } from 'unsplash-js/dist/methods/search/types';

const getApi = () => {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
        return null;
    }
    return createApi({
        accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });
}

export async function search({ query, page, per_page }: { query: string; page: number; per_page: number }): Promise<Wallpaper[]> {
    const unsplashApi = getApi();
    if (!unsplashApi) {
        console.warn('Unsplash Access Key is not configured.');
        return [];
    }
    try {
        const response = await unsplashApi.search.getPhotos({
            query,
            page,
            perPage: per_page,
            orientation: 'portrait',
        });

        if (response.type === 'error') {
            console.error('Unsplash API error:', response.errors);
            return [];
        }

        const photos = response.response as Photos;
        return photos.results.map(photo => ({
            id: `unsplash-${photo.id}`,
            url: photo.urls.full,
            previewUrl: photo.urls.regular,
            author: photo.user.name,
            authorUrl: photo.user.links.html,
            source: 'Unsplash',
            sourceUrl: photo.links.html,
            tags: photo.tags.map(t => t.title),
            aiHint: `${photo.alt_description?.split(" ").slice(0,2).join(" ")}`,
            width: photo.width,
            height: photo.height,
        }));
    } catch (error) {
        console.error('Error fetching from Unsplash API:', error);
        return [];
    }
}
