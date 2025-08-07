
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

export function InGridAdCard() {
  return (
    <div
      className="group relative block aspect-[2/3] w-full overflow-hidden rounded-lg bg-card border-2 border-dashed border-secondary/50 flex flex-col items-center justify-center p-4 text-center"
    >
      <Image 
        src="https://placehold.co/400x600.png"
        alt="Simulated Ad"
        width={400}
        height={600}
        className="absolute inset-0 w-full h-full object-cover opacity-10"
        data-ai-hint="abstract texture"
      />
      <div className="z-10">
        <h3 className="font-headline text-lg text-secondary text-glow-secondary">Your Ad Here</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Promote your product or service to a galaxy of users.
        </p>
        <Button asChild variant="secondary" size="sm" className="mt-4">
          <Link href="#" target="_blank">
            Learn More <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
