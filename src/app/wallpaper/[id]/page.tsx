import Image from 'next/image';
import Link from 'next/link';
import { Download, Heart, Home, Lock, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DownloadDialog } from '@/components/download-dialog';

// In a real app, you would fetch this data based on the id
const getWallpaperData = (id: string) => {
  return {
    id,
    url: 'https://placehold.co/1080x1920.png',
    author: 'Stell-AI-r Painter',
    authorUrl: '#',
    source: 'NASA Archives',
    sourceUrl: '#',
    tags: ['nebula', 'galaxy', 'stars'],
    aiHint: 'space nebula',
  };
};

export default function WallpaperPage({ params }: { params: { id: string } }) {
  const wallpaper = getWallpaperData(params.id);

  return (
    <div className="relative w-full h-screen">
      <Image
        src={wallpaper.url}
        alt={`Wallpaper ${wallpaper.id}`}
        fill
        className="object-cover"
        data-ai-hint={wallpaper.aiHint}
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <Button asChild variant="ghost" size="icon" className="absolute top-5 left-5 z-20 h-12 w-12 bg-black/30 hover:bg-black/50 text-white hover:text-primary">
        <Link href="/">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </Button>
      
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white text-center md:text-left">
              <h1 className="font-headline text-2xl font-bold text-glow">
                Cosmic Drift
              </h1>
              <p>by <a href={wallpaper.authorUrl} className="underline hover:text-primary">{wallpaper.author}</a> from <a href={wallpaper.sourceUrl} className="underline hover:text-primary">{wallpaper.source}</a></p>
            </div>

            <div className="flex items-center gap-2 bg-black/50 border border-border p-2 rounded-full">
              <DownloadDialog />
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/10 rounded-full h-12 w-12">
                <Share2 className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10 rounded-full h-12 w-12">
                <Heart className="w-6 h-6" />
              </Button>
            </div>

             <div className="flex items-center gap-2 bg-black/50 border border-border p-2 rounded-full">
              <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/10 rounded-full h-12 gap-2 px-4" disabled>
                <Home className="w-5 h-5" /> Set Home
              </Button>
              <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/10 rounded-full h-12 gap-2 px-4" disabled>
                <Lock className="w-5 h-5" /> Set Lock
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
