
'use client';

import { useState, useMemo } from 'react';
import AdBanner from '@/components/ad-banner';
import Header from '@/components/header';
import { WallpaperGrid } from '@/components/wallpaper-grid';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [query, setQuery] = useState('sci-fi');
  const [inputValue, setInputValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const allCategories = [
    // Core
    'Cyberpunk', 'Sci-Fi', 'Space', 'Futuristic', 'Neon', 'Abstract', 'Glitch', 
    // Concepts
    'Dystopian', 'Utopian', 'Post-Apocalyptic', 'Steampunk', 'Solarpunk', 'Biopunk', 'Nanopunk',
    // Locations
    'Alien', 'Planet', 'Galaxy', 'Nebula', 'Stars', 'Cityscape', 'Metropolis', 'Megastructure', 'Underwater City', 'Floating Island',
    // Tech
    'Robot', 'Cyborg', 'Android', 'AI', 'Hologram', 'VR', 'Virtual Reality', 'AR', 'Augmented Reality', 'Drone', 'Mecha', 'Exosuit',
    // Vehicles
    'Spaceship', 'Starship', 'Flying Car', 'Hovercraft', 'Light Cycle',
    // Elements
    'Quantum', 'Dimension', 'Portal', 'Time Travel', 'Wormhole', 'Black Hole',
    // Aesthetics
    '80s Retro', 'Synthwave', 'Vaporwave', 'Outrun', 'Retrofuturism', 'Minimalist Tech',
    // Characters
    'Space Marine', 'Bounty Hunter', 'Android Butler', 'Hacker', 'Netrunner', 'Mutant',
    // Space Objects
    'Asteroid', 'Comet', 'Supernova', 'Moon', 'Exoplanet', 'Ringed Planet',
    // Architecture
    'Brutalist', 'Futuristic Architecture', 'Arcology', 'Space Station', 'Orbital Ring',
    // Nature
    'Alien Jungle', 'Crystal Cave', 'Terraformed Planet', 'Bioluminescent Forest',
    // Moods
    'Dark', 'Moody', 'Cinematic', 'Epic', 'Serene Space', 'Cosmic Horror',
    // Misc
    'NASA', 'Space Probe', 'Satellite', 'Concept Art', 'Digital Art', '3D Render', 'Fractal',
    'Circuit Board', 'Data Stream', 'Code', 'Matrix', 'High Tech', 'Low Life',
    'Alien Landscape', 'Cosmic Dust', 'Star Cluster', 'Pulsar', 'Quasar',

    // Bonus
    'Quantum Realm', 'Cybernetics', 'Cryosleep', 'Warp Drive', 'Laser Grid', 'Force Field',
    'Plasma', 'Antigravity', 'Singularity', 'Bio-Dome', 'Cyber-Noir', 'Tech-Wear',
    'Sentient Plant', 'Gas Giant', 'Ice Planet', 'Desert Planet', 'Volcanic Planet'
  ];
  
  const initialCategories = ['Cyberpunk', 'Space', 'NASA', 'Abstract', 'Neon', 'Glitch', 'Futuristic'];

  const filteredCategories = useMemo(() => 
    allCategories.filter(c => c.toLowerCase().includes(categoryFilter.toLowerCase()))
    , [categoryFilter]
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      setQuery(inputValue);
    }
  };

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    setInputValue(category);
    setPopoverOpen(false);
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search wallpapers..."
                className="w-full pl-10 h-12 text-lg bg-card/50 border-2 border-primary/50 focus:border-primary transition-colors"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium mr-2">Categories:</span>
              {initialCategories.map((category) => (
                <Badge
                  key={category}
                  variant={query.toLowerCase() === category.toLowerCase() ? "default" : "outline"}
                  className="cursor-pointer text-base px-4 py-1 border-accent/50 hover:bg-accent/20 hover:text-foreground transition-colors"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Badge
                    variant="outline"
                    className="cursor-pointer text-base px-4 py-1 border-accent/50 hover:bg-accent/20 hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <MoreHorizontal className="w-4 h-4" /> More
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-card/90 backdrop-blur-sm border-primary/50">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none font-headline text-primary text-glow">All Categories</h4>
                      <p className="text-sm text-muted-foreground">
                        Explore all available categories.
                      </p>
                    </div>
                     <Input
                        placeholder="Filter categories..."
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-9"
                      />
                    <ScrollArea className="h-72">
                      <div className="flex flex-col space-y-2 pr-4">
                        {filteredCategories.map((category) => (
                          <Button
                            key={category}
                            variant={query.toLowerCase() === category.toLowerCase() ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>

            </div>
          </div>
          <WallpaperGrid query={query} />
        </div>
      </main>
      <AdBanner />
    </div>
  );
}
