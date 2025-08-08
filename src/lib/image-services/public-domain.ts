
'use server';

import * as cheerio from 'cheerio';
import type { Wallpaper } from '@/lib/definitions';

const BASE_URL = 'https://www.publicdomainpictures.net/en/';

function getDimensionFromUrl(url: string): { width: number, height: number } {
    const match = url.match(/-(\d+)x(\d+)\.jpg$/);
    if (match) {
        return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    }
    // Return default portrait-oriented dimensions if not found
    return { width: 1080, height: 1920 };
}

export async function search({ query, page, per_page }: { query: string; page: number; per_page: number }): Promise<Wallpaper[]> {
    const searchUrl = `${BASE_URL}browse-pictures.php?search=${encodeURIComponent(query)}&page=${page}`;

    try {
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch public domain pictures: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const wallpapers: Wallpaper[] = [];
        const items = $('table[width="98%"][border="0"][cellspacing="2"][cellpadding="4"] > tbody > tr > td[align="center"][valign="top"]');

        items.slice(0, per_page).each((i, el) => {
            const linkElement = $(el).find('a').first();
            const imgElement = linkElement.find('img').first();
            const authorElement = $(el).find('a[href^="view-artist.php"]');

            const pageUrl = linkElement.attr('href');
            const previewUrl = imgElement.attr('src');
            
            if (pageUrl && previewUrl) {
                const fullPageUrl = new URL(pageUrl, BASE_URL).href;
                const fullPreviewUrl = new URL(previewUrl, BASE_URL).href;
                const author = authorElement.text().trim() || 'Unknown Artist';
                const authorUrl = new URL(authorElement.attr('href') || '#', BASE_URL).href;
                const title = linkElement.attr('title') || query;
                const { width, height } = getDimensionFromUrl(fullPreviewUrl);
                
                // Construct a higher-quality URL if possible (site-specific logic)
                // For publicdomainpictures, the preview and final image are often the same path but on different servers
                const url = fullPreviewUrl.replace('pictures', 'images');

                wallpapers.push({
                    id: `publicdomain-${pageUrl.split('=')[1]}`,
                    url: url,
                    previewUrl: fullPreviewUrl,
                    author: author,
                    authorUrl: authorUrl,
                    source: 'Public Domain Pictures',
                    sourceUrl: fullPageUrl,
                    tags: title.split(' ').map(t => t.toLowerCase()),
                    aiHint: title.split(' ').slice(0, 2).join(' '),
                    width: width,
                    height: height,
                });
            }
        });

        return wallpapers;

    } catch (error) {
        console.error('Error fetching from Public Domain Pictures:', error);
        return [];
    }
}
