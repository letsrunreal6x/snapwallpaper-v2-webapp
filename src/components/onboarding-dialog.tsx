
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Heart, Download, Star, Info } from 'lucide-react';

interface OnboardingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onContinue: () => void;
}

export function OnboardingDialog({ open, onOpenChange, onContinue }: OnboardingDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-body bg-card/90 backdrop-blur-sm border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary text-glow flex items-center gap-2">
            <Info className="w-6 h-6" /> Welcome to SnapWallpaper!
          </DialogTitle>
          <DialogDescription>
            Here’s a quick guide to get you started.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
            <ul className="space-y-4 text-sm text-foreground/80">
                <li className="flex items-start gap-3">
                    <Search className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                    <span>Use the <b className="text-foreground">search bar</b> and <b className="text-foreground">categories</b> to find the perfect wallpaper for you.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <Download className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                    <span>Click the download icon on any wallpaper to save it directly to your device after a short ad.</span>
                </li>
                <li className="flex items-start gap-3">
                    <Heart className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                    <span>Tap the heart icon to save your favorite wallpapers. Find them later in the <b className="text-foreground">Favorites</b> page (top-right heart).</span>
                </li>
                <li className="flex items-start gap-3">
                    <Star className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                    <span>Go <b className="text-foreground">Premium</b> to remove all ads for an uninterrupted experience.</span>
                </li>
            </ul>
        </div>
        
        <DialogFooter>
            <Button onClick={onContinue}>
                Let's Go!
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
