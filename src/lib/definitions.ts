export type Wallpaper = {
  id: string;
  url: string;
  previewUrl: string;
  author: string;
  authorUrl: string;
  source: string;
  sourceUrl: string; // URL to the original image source page
  tags: string[];
  aiHint: string;
  width: number;
  height: number;
  query?: string; // Optional query used to find this wallpaper
};
