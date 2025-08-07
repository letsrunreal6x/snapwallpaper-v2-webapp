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
import { Download, Film, CheckCircle } from 'lucide-react';
import { Progress } from './ui/progress';

export function DownloadDialog() {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setIsDownloaded(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWatchingAd(false);
          setIsDownloaded(true);
          // In a real app, trigger download here
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsWatchingAd(false);
      setIsDownloaded(false);
      setProgress(0);
    }
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 w-12">
          <Download className="w-6 h-6" />
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
              : 'Watch a short ad to start your high-resolution download for free.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isWatchingAd && (
          <div className="py-4">
            <Progress value={progress} className="w-full h-3 bg-accent/20 border border-accent/50" />
            <p className="text-center text-sm mt-2 text-muted-foreground">Ad in progress... {progress}%</p>
          </div>
        )}

        {isDownloaded && (
            <div className="flex items-center justify-center py-4 gap-2 text-green-400">
                <CheckCircle className="w-8 h-8"/>
                <span className="text-lg font-bold">Thank you!</span>
            </div>
        )}

        {!isDownloaded && !isWatchingAd && (
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
