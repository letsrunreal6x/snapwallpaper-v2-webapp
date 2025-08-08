
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface TermsDialogProps {
    open: boolean;
    onAccept: () => void;
}

const termsContent = `Effective Date: ${new Date().toLocaleDateString()}

Welcome to SnapWallpaper (“App”, “we”, “our”, or “us”). By downloading or using the app, you agree to be bound by the following terms and conditions (“Terms”). Please read them carefully before using the app.

1. Acceptance of Terms
By accessing or using the app, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use the app.

2. Use of the App
The app provides access to wallpaper images sourced from public domain, royalty-free, or Creative Commons (CC0) licensed content available on third-party websites (such as NASA, Pixabay, Pexels, Unsplash, and others) via their official, public APIs. We do not host, own, modify, or sell any of the images shown through the app. You are responsible for reviewing and complying with the licensing terms provided by the original source of each image.

3. Downloading Images
Users may download images for personal or commercial use as permitted by the original license. Image downloads are not hosted by our servers and occur directly from the source websites. Before using any image commercially, users must verify the license or attribution requirements from the original provider.

4. Monetization and Ads
We may display advertisements in the app, including rewarded ads that allow users to unlock download functionality. Viewing ads supports the development and maintenance of the app. By using the app, you agree to our use of advertising services (e.g., Google AdMob, Facebook Audience Network).

5. Intellectual Property
All app content, excluding third-party images, including logos, UI/UX design, and branding elements, are the property of SnapWallpaper and protected by applicable intellectual property laws.

6. User Conduct
You agree not to:
- Use the app for illegal purposes
- Attempt to reverse engineer or tamper with the app
- Use automated tools to download images at scale

7. Limitation of Liability
We do not take responsibility for how users use downloaded images. We are not liable for:
- Any copyright or license violations arising from misuse
- Inaccuracies or omissions in third-party image information
- Errors or bugs within third-party content

8. Termination
We may suspend or terminate your access to the app if you violate these Terms or misuse the service.

9. Changes to the Terms
We reserve the right to update or modify these Terms at any time. Continued use of the app after changes constitutes acceptance of the new Terms.

10. Contact Us
If you have any questions or concerns regarding these Terms, contact us at: support@example.com
`;

export function TermsDialog({ open, onAccept }: TermsDialogProps) {
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <Dialog open={open}>
      <DialogContent className="font-body bg-card/90 backdrop-blur-sm border-primary/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary text-glow">
            Terms and Conditions
          </DialogTitle>
          <DialogDescription>
            Please read and accept the terms before using SnapWallpaper.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96 w-full rounded-md border p-4 whitespace-pre-wrap text-sm">
            {termsContent}
        </ScrollArea>

        <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="terms" checked={isAccepted} onCheckedChange={(checked) => setIsAccepted(checked as boolean)} />
            <Label htmlFor="terms" className="cursor-pointer">I have read and agree to the Terms and Conditions.</Label>
        </div>
        
        <DialogFooter>
            <Button onClick={onAccept} disabled={!isAccepted}>
                Accept & Continue
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
