
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PremiumDialog() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const handlePurchase = () => {
    setIsPurchasing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPurchasing(false);
      setIsComplete(true);
      toast({
        title: 'Purchase Successful!',
        description: "You've unlocked the premium experience.",
      });
    }, 1500);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when dialog closes after a delay to allow animation
      setTimeout(() => {
        setIsPurchasing(false);
        setIsComplete(false);
      }, 300);
    }
  };


  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Star className="h-5 w-5 text-yellow-400 hover:text-yellow-300 transition-all" />
          <span className="sr-only">Go Premium</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="font-body bg-card/90 backdrop-blur-sm border-primary/50">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary text-glow flex items-center gap-2">
            <Zap className="w-6 h-6" /> Go Premium!
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? "Thank you for upgrading! Enjoy the ad-free experience."
              : "Unlock an enhanced experience and support the app."
            }
          </DialogDescription>
        </DialogHeader>

        {isComplete ? (
           <div className="flex items-center justify-center py-8 gap-2 text-green-400">
             <CheckCircle className="w-12 h-12"/>
             <span className="text-xl font-bold">Purchase Complete!</span>
           </div>
        ) : (
          <div className="py-4">
            <ul className="space-y-2 text-sm list-disc list-inside text-foreground/80">
                <li>Remove all banner and in-grid ads.</li>
                <li>Enjoy an uninterrupted browsing experience.</li>
                <li>Early access to new features.</li>
            </ul>
            <div className="text-center my-6">
                <p className="text-lg text-muted-foreground line-through">$9.99</p>
                <p className="text-4xl font-bold font-headline text-glow">$1.99 <span className="text-base font-body text-muted-foreground">/ one-time</span></p>
                <p className="text-xs text-secondary mt-1">Limited Time Offer!</p>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {isComplete ? (
            <DialogClose asChild>
                <Button>Close</Button>
            </DialogClose>
          ) : (
            <>
                <DialogClose asChild>
                    <Button variant="outline">Maybe Later</Button>
                </DialogClose>
                <Button onClick={handlePurchase} disabled={isPurchasing}>
                    {isPurchasing && <Loader2 className="animate-spin" />}
                    Upgrade Now
                </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
