
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Download, Film, CheckCircle, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';

interface DownloadDialogProps {
  wallpaperUrl: string;
  wallpaperId: string;
}

export function DownloadDialog({ wallpaperUrl, wallpaperId }: DownloadDialogProps) {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const triggerDownload = async () => {
    setIsDownloading(true);
    try {
      // Use a CORS proxy if direct fetch fails, but for now we try direct.
      const response = await fetch(wallpaperUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch wallpaper: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapwallpaper-${wallpaperId}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsDownloaded(true);
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Could not download the wallpaper. Please try again later.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setIsDownloaded(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          setIsWatchingAd(false);
          triggerDownload();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when dialog closes
      setTimeout(() => {
        setIsWatchingAd(false);
        setIsDownloaded(false);
        setProgress(0);
        setIsDownloading(false);
      }, 300);
    }
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white bg-black/50 backdrop-blur-sm rounded-full h-12 w-12 hover:bg-black/70 hover:text-primary"
        >
          {isDownloading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-body bg-card/90 backdrop-blur-sm border-primary/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-primary text-glow">
            {isDownloaded ? 'Download Complete!' : 'Download Wallpaper'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isWatchingAd
              ? 'Simulating rewarded ad... thank you for your support!'
              : isDownloaded
              ? 'Your wallpaper is ready. Thanks for supporting us!'
              : isDownloading
              ? 'Your download is being prepared...'
              : 'Watch a short ad to start your high-resolution download for free.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {(isWatchingAd || isDownloading) && !isDownloaded && (
          <div className="py-4">
            <Progress value={isDownloading ? 100 : progress} className="w-full h-3 bg-accent/20 border border-accent/50" />
            <p className="text-center text-sm mt-2 text-muted-foreground">
              {isWatchingAd ? `Ad in progress... ${progress}%` : 'Downloading...'}
            </p>
          </div>
        )}

        {isDownloaded && (
            <div className="flex items-center justify-center py-4 gap-2 text-green-400">
                <CheckCircle className="w-8 h-8"/>
                <span className="text-lg font-bold">Thank you!</span>
            </div>
        )}

        {!isDownloaded && !isWatchingAd && !isDownloading && (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWatchAd} className="bg-primary hover:bg-primary/80 text-primary-foreground gap-2">
              <Film className="w-5 h-5" />
              Watch Ad & Download
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
        
        {isDownloaded && (
            <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
