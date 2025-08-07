import Link from 'next/link';
import Image from 'next/image';
import type { Wallpaper } from '@/lib/definitions';
import { Badge } from './ui/badge';
import { ExternalLink } from 'lucide-react';

export function WallpaperCard({ wallpaper, query }: { wallpaper: Wallpaper, query: string }) {
  return (
    <Link
      href={`/wallpaper/${wallpaper.id}?q=${encodeURIComponent(query)}`}
      className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg"
    >
      <Image
        src={wallpaper.previewUrl}
        alt={`Wallpaper by ${wallpaper.author}`}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        data-ai-hint={wallpaper.aiHint}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-primary group-hover:box-glow"></div>
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <div className="flex flex-wrap gap-1">
          {wallpaper.tags.map((tag, index) => (
            <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs bg-black/50 text-primary-foreground backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-primary-foreground/80 font-medium flex items-center gap-1">
          from {wallpaper.source} <ExternalLink className="w-3 h-3"/>
        </p>
      </div>
    </Link>
  );
}
