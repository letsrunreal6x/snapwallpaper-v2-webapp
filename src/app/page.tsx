
'use client';

import { useState } from 'react';
import AdBanner from '@/components/ad-banner';
import Header from '@/components/header';
import { WallpaperGrid } from '@/components/wallpaper-grid';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('sci-fi');
  const [inputValue, setInputValue] = useState('');
  const [showMore, setShowMore] = useState(false);

  const allCategories = ['Cyberpunk', 'Space', 'NASA', 'Abstract', 'Neon', 'Glitch', 'Futuristic', 'Robots', 'Planets', 'Alien', 'Cityscape', 'Galaxy', 'Stars', 'Spaceship'];
  const initialCategories = allCategories.slice(0, 7);
  const categoriesToShow = showMore ? allCategories : initialCategories;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      setQuery(inputValue);
    }
  };

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    setInputValue(category);
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
              {categoriesToShow.map((category) => (
                <Badge
                  key={category}
                  variant={query.toLowerCase() === category.toLowerCase() ? "default" : "outline"}
                  className="cursor-pointer text-base px-4 py-1 border-accent/50 hover:bg-accent/20 hover:text-foreground transition-colors"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
              {!showMore && (
                 <Badge
                    variant="outline"
                    className="cursor-pointer text-base px-4 py-1 border-accent/50 hover:bg-accent/20 hover:text-foreground transition-colors flex items-center gap-1"
                    onClick={() => setShowMore(true)}
                  >
                   <Plus className="w-4 h-4" /> More
                  </Badge>
              )}
            </div>
          </div>
          <WallpaperGrid query={query} />
        </div>
      </main>
      <AdBanner />
    </div>
  );
}
