
'use client';

import { useState, useMemo, useEffect } from 'react';
import AdBanner from '@/components/ad-banner';
import Header from '@/components/header';
import { WallpaperGrid } from '@/components/wallpaper-grid';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { OnboardingDialog } from '@/components/onboarding-dialog';
import { TermsDialog } from '@/components/terms-dialog';

const ONBOARDING_KEY = 'snapwallpaper_onboarding_complete';
const TERMS_ACCEPTED_KEY = 'snapwallpaper_terms_accepted';


export default function Home() {
  const [query, setQuery] = useState('sci-fi');
  const [inputValue, setInputValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const [showTerms, setShowTerms] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);


  useEffect(() => {
    // We need to wait for the client to be ready to check localStorage
    const termsAccepted = localStorage.getItem(TERMS_ACCEPTED_KEY);
    if (!termsAccepted) {
      setShowTerms(true);
    } else {
      setIsAppReady(true);
      const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleTermsAccepted = () => {
    localStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
    setShowTerms(false);
    setIsAppReady(true);

    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const allCategories = [
    // Core & Foundational
    'Abstract', 'Action', 'Advanced', 'Adventure', 'Aether', 'Aftermath', 'Agent', 'AI', 'Alien', 'Alien Colony', 'Alien Culture',
    'Alien Forest', 'Alien Invasion', 'Alien Jungle', 'Alien Landscape', 'Alien Race', 'Alternate Reality',
    'Andromeda', 'Android', 'Anti-gravity', 'Apocalypse', 'AR', 'Arcade', 'Archaeology', 'Arcology', 'Artificial', 'Assassin',
    'Astral', 'Asteroid', 'Astronaut', 'Astrophysics', 'Atmosphere', 'Atomic', 'Augmented', 'Augmented Reality', 'Aurora',
    'Automaton', 'Automation', 'Awesome', 'Barren', 'Battle', 'Battleship', 'Beam', 'Big Data', 'Bio-Dome', 
    'Bio-Engineering', 'Bio-luminescence', 'Bio-mechanical', 'Bioluminescent', 'Biopunk', 'Biotechnology', 'Black-and-White', 'Black Hole', 'Blade Runner', 'Blast', 'Blaster', 'Blockade', 'Blue', 'Blueprint',
    'Bot', 'Bounty Hunter', 'Breach', 'Bridge', 'Bright', 'Brutalist', 'Bubble',
    'Bunker', 'Camouflage', 'Canopy', 'Canyon', 'Capital', 'Capsule', 'Captain', 'Cargo', 'Cave', 'Celestial', 'Centauri',
    'Chamber', 'Chaos', 'Character', 'Chemical', 'Chrome', 'Chronos', 'Cinematic', 'Circuit', 'Circuit Board', 'Citadel', 'Cityscape', 'Civilization',
    'Cliff', 'Clockwork', 'Clone', 'Cloud', 'Cockpit', 'Code', 'Colony', 'Colorful', 'Combat', 'Comet', 'Command', 'Commander', 'Communication',
    'Complex', 'Component', 'Computer', 'Conduit', 'Connection', 'Consciousness', 'Construction', 'Containment', 'Concept Art', 'Constellation', 'Cosmic', 'Cosmic Dust', 'Cosmic Horror', 
    'Cosmic Rays', 'Cosmonaut', 'Cosmos', 'Core', 'Corporation', 'Corridor', 'Corruption', 'Crate', 'Crater', 'Creature', 'Crew',
    'Crime', 'Criminal', 'Crisis', 'Crossfire', 'Cruiser', 'Cryo', 'Cryogenics', 'Cryosleep', 'Cryptic', 'Crystal', 'Crystal Cave',
    'Cube', 'Cult', 'Cyber', 'Cyber-crime', 'Cyber-espionage', 'Cyber-fantasy', 'Cyber-mage', 'Cyber-ninja', 'Cyber-Noir', 'Cyber-punk city', 'Cyber-runner', 'Cyber-samurai', 'Cyber-Security', 'Cyber-soldier', 'Cyber-Warfare',
    'Cybernetics', 'Cyborg', 'Cyborg Ninja',
    'Cyborg Samurai', 'Cyborg Soldier', 'Cyberspace', 'Cylinder', 'Damage', 'Danger', 'Dark', 'Dark Matter', 'Darkness', 'Dashboard',
    'Data', 'Data Stream', 'Database', 'Dawn', 'Debris', 'Decay', 'Deception', 'Deep', 'Deep Space', 'Defense', 'Delta', 'Derelict', 'Desert',
    'Desert Planet', 'Desolate', 'Destroyer', 'Destruction', 'Detail', 'Device', 'Diamond', 'Digital', 'Digital Art', 'Digital Brain',
    'Digital City', 'Digital Frontier', 'Digital Life', 'Digital Rain', 'Digital World', 
    'Diode', 'Discovery', 'Disintegration', 'Display', 'DNA', 'Dock', 'Dogfight', 'Dome', 'Doomsday', 'Doomsday Machine',
    'Droid', 'Drone', 'Dune', 'Dusk', 'Dwarf Star', 'Dynamic', 'Dystopian', 'Dyson Sphere', 'Earth', 'Echo', 'Eclipse', 'Eco-punk', 'Edge',
    'Elder', 'Electric', 'Electricity', 'Electromagnetic', 'Electronic', 'Element', 'Elite', 'Empire', 'Encounter',
    'Encryption', 'Enforcer', 'Engine', 'Engineer', 'Enigma', 'Entity', 'Environment', 'Eon', 'Epic', 'Escape', 'Ether',
    'Ethereal', 'Event Horizon', 'Everlasting', 'Evolution', 'Excavation', 'Exo-suit', 'Exodus', 'Exoplanet', 'Exosuit', 'Experiment',
    'Experimental', 'Exploration', 'Explorer', 'Explosion', 'Exterior', 'Extinction', 'Extra-terrestrial', 'Facility',
    'Factory', 'Fade', 'Fallout', 'Fantasy', 'Fighter', 'Fire', 'Firefight', 'Firewall', 'Fleet', 'Flight', 'Floating Island', 'Flora',
    'Flow', 'Fog', 'Forbidden', 'Force Field', 'Forest', 'Fortress', 'Foundation', 'Fountain', 'Fractal', 'Freighter', 'Frequency',
    'Fuel', 'Fugitive', 'Fusion', 'Futurism', 'Futuristic', 'Futuristic Architecture', 'Gadget', 'Gaggle', 'Galactic', 'Galaxy', 'Game', 'Gamma', 'Gas Giant', 'Gateway', 'Gear',
    'Gem', 'Generation', 'Genesis', 'Genetic', 'Genetics', 'Geo-engineering', 'Geode', 'Geometric', 'Ghetto', 'Ghost in the Shell', 'Giant',
    'Glacier', 'Glass', 'Glitch', 'Glitch Art', 'Glow', 'Glowing', 'God', 'Gothic', 'Graphene', 'Graphite', 'Gravity', 'Grid',
    'Grim', 'Guardian', 'Guerilla', 'Gun', 'Gunship', 'Habitat', 'Hacker', 'Hall', 'Hallway', 'Hangar', 'Harbinger',
    'Hard Sci-Fi', 'Hardware', 'Harvest', 'Haven', 'Hazard', 'Headquarters', 'Heavy', 'Helix', 'Helmet', 'High Tech', 'Hive', 'Hologram', 'Holographic',
    'Hope', 'Horizon', 'Hovercraft', 'Hub', 'Hull', 'Humanoid', 'Hunter', 'Hybrid', 'Hyper-drive', 'Hyper-lane', 'Hyper-loop', 'Hyperdrive', 'Hyperspace', 'Ice', 'Ice Planet',
    'Illuminated', 'Illusion', 'Illustration', 'Immortal', 'Impact', 'Implant', 'Inception', 
    'Industrial', 'Infinity', 'Information', 'Infrared', 'Infrastructure', 'Inhabitant', 'Injection', 'Inorganic', 'Inside',
    'Installation', 'Intelligence', 'Interface', 'Interior', 'Interloper', 'Interstellar', 'Invasion', 'Invention', 'Inventor',
    'Ion', 'Iron', 'Irradiated', 'Island', 'Isolation', 'Isotope', 'Jedi', 'Jet', 'Juggernaut', 'Junction',
    'Jungle', 'Junk', 'Junkyard', 'Jupiter', 'Kinetics', 'King', 'Knight', 'Labyrinth', 'Lagoon', 'Lake', 'Landscape', 'Last', 'Laser', 'Launch',
    'Lava', 'Lava Planet', 'Law', 'Layer', 'Legacy', 'Legend', 'Legion', 'Lens', 'Leviathan', 'Life', 'Light', 'Light Cycle', 'Light-speed',
    'Lightning', 'Liquid', 'Living', 'Logic', 'Lonely', 'Lost', 'Low Life', 'Lunar', 'Lush', 'Luxury', 'Machine', 'Mad Max', 'Madness',
    'Maelstrom', 'Mage', 'Magma', 'Magnetic', 'Mainframe', 'Mankind', 'Mantle', 'Manufacture', 'Map', 'Marine',
    'Market', 'Mars', 'Marvel', 'Mask', 'Massive', 'Matter', 'Matrix', 'Maze', 'Mecha', 'Mechanical', 'Mechanism', 'Medic', 'Mega-corporation',
    'Megacity', 'Megastructure', 'Memory', 'Mercenary', 'Mercury', 'Metal', 'Metropolis', 'Micro', 'Microchip', 'Micro-organism', 'Midnight', 'Military', 'Mind',
    'Mine', 'Mineral', 'Mining', 'Mirage', 'Mirror', 'Misty', 'Mobile', 'Model', 'Modern', 'Module', 'Molecule',
    'Molten', 'Monk', 'Monochrome', 'Monolith', 'Monster', 'Monument', 'Moonbase', 'Moonlight', 'Morning',
    'Mothership', 'Mountain', 'Mutant', 'Mutation', 'Myriad', 'Mysterious', 'Mystery', 'Myth', 'Nano',
    'Nanobot', 'Nanopunk', 'Nanotechnology', 'NASA', 'Nature', 'Navigator', 'Nebula', 'Necromancer', 'Neo',
    'Neon', 'Neon City', 'Neon Noir', 'Nerve', 'Net', 'Netrunner', 'Network', 'Neuro', 'Neuron', 'Neutron',
    'New', 'Nexus', 'Night', 'Night City', 'Nightfall', 'Ninja', 'Noble', 'Nomad', 'Nova', 'Nuclear',
    'Nucleus', 'Oasis', 'Object', 'Oblivion', 'Observer', 'Obsidian', 'Ocean', 'Ominous', 'Onyx', 'Operation',
    'Operator', 'Oracle', 'Orb', 'Orbit', 'Orbital', 'Orbital Ring', 'Order', 'Organ', 'Organic', 'Organism',
    'Origin', 'Outcast', 'Outer', 'Outlaw', 'Outpost', 'Outrun', 'Overgrowth', 'Overlord', 'Palace', 'Pale',
    'Pandemic', 'Panel', 'Panorama', 'Paradox', 'Parallel', 'Parasite', 'Particle', 'Passage', 'Path', 'Patrol',
    'Pattern', 'Peace', 'Peak', 'Pebble', 'Person', 'Phantom', 'Phase', 'Phenomenon', 'Philosopher', 'Phoenix',
    'Photon', 'Pillar', 'Pilot', 'Pipe', 'Pipeline', 'Pirate', 'Pistol', 'Pixel', 'Plague', 'Plain', 'Planet',
    'Planetary', 'Plasma', 'Platform', 'Plaza', 'Pod', 'Poison', 'Police', 'Pollution', 'Polygonal', 'Pool',
    'Portal', 'Portrait', 'Post-Apocalyptic', 'Power', 'Precipice', 'Predator', 'Prehistoric', 'Priest',
    'Primal', 'Prime', 'Primitive', 'Prince', 'Princess', 'Prism', 'Prison', 'Probe', 'Processor', 'Program',
    'Propaganda', 'Prophet', 'Prosthetic', 'Protocol', 'Prototype', 'Psychedelic', 'Psychic', 'Pulsar', 'Punk',
    'Pyramid', 'Quantum', 'Quantum Realm', 'Quarantine', 'Quasar', 'Queen', 'Quest', 'Quiet', 'Radar',
    'Radiation', 'Radical', 'Radio', 'Radioactive', 'Rage', 'Raid', 'Raider', 'Rain', 'Ranger', 'Ray', 'Reactor',
    'Reality', 'Realm', 'Rebel', 'Rebellion', 'Rebirth', 'Receiver', 'Recon', 'Red', 'Reflection', 'Refuge',
    'Refugee', 'Regenesis', 'Reign', 'Rejuvenation', 'Relic', 'Remnant', 'Renegade', 'Repair', 'Replicant',
    'Research', 'Reservoir', 'Resistance', 'Resonance', 'Resource', 'Retreat', 'Retro', 'Retrofuturism',
    'Revenant', 'Revolution', 'Rider', 'Rift', 'Rifle', 'Rig', 'Ring', 'Ringed Planet', 'Riot', 'Rise', 'Risk',
    'River', 'Road', 'Robo-cop', 'Robot', 'Robotics', 'Rock', 'Rocket', 'Rogue', 'Room', 'Rotor', 'Rover', 'Royal',
    'Royalty', 'Ruin', 'Ruler', 'Rune', 'Runner', 'Rust', 'Sabotage', 'Sacred', 'Sadness', 'Safe', 'Samurai',
    'Sanctuary', 'Sand', 'Sand-dune', 'Satellite', 'Savage', 'Savior', 'Scale', 'Scan', 'Scanner', 'Scavenger',
    'Scene', 'Scheme', 'Scholar', 'School', 'Science', 'Scout', 'Scrap', 'Scrapyard', 'Scream', 'Screen',
    'Script', 'Sculpture', 'Sea', 'Search', 'Secret', 'Sector', 'Security', 'Seed', 'Seeker', 'Sentinel',
    'Sequence', 'Serene', 'Serenity', 'Server', 'Shadow', 'Shaft', 'Shaman', 'Shape', 'Shard', 'Shelter',
    'Shield', 'Shimmer', 'Ship', 'Shipwreck', 'Shock', 'Shockwave', 'Shoot', 'Shooter', 'Shop', 'Shore',
    'Shot', 'Shuttle', 'Siege', 'Signal', 'Silence', 'Silhouette', 'Silicon', 'Silver', 'Simple', 'Simulation',
    'Simulator', 'Singularity', 'Sinister', 'Sith', 'Skeleton', 'Sketch', 'Skill', 'Skull', 'Sky', 'Sky-fi',
    'Skyscraper', 'Slave', 'Sleeper', 'Slum', 'Smoke', 'Smuggler', 'Snow', 'Social', 'Soft', 'Software',
    'Solar', 'Solarpunk', 'Soldier', 'Solitude', 'Solution', 'Sorcerer', 'Soul', 'Source', 'Sovereign',
    'Space', 'Space Marine', 'Space Station', 'Spacecraft', 'Spaceship', 'Spark', 'Special', 'Specter',
    'Spectrum', 'Speed', 'Spell', 'Sphere', 'Spider', 'Spike', 'Spine', 'Spiral', 'Spirit', 'Spire',
    'Spore', 'Squad', 'Square', 'Stability', 'Staff', 'Stair', 'Stalker', 'Star', 'Star Cluster',
    'Star-Wars', 'Star-bridge', 'Star-chart', 'Star-cruiser', 'Star-destroyer', 'Star-drive', 'Star-fighter',
    'Star-gate', 'Starlight', 'Star-map', 'Star-port', 'Star-ship', 'Stasis', 'Station', 'Stealth',
    'Steam', 'Steampunk', 'Steel', 'Stellar', 'Stone', 'Storm', 'Stormtrooper', 'Stranded', 'Strange',
    'Stranger', 'Strategy', 'Stream', 'Street', 'Strike', 'Strip', 'Structure', 'Struggle', 'Sub-atomic',
    'Sub-light', 'Sub-marine', 'Substance', 'Subterranean', 'Subway', 'Sun', 'Sunken', 'Sunrise',
    'Sunset', 'Super-computer', 'Super-hero', 'Super-nova', 'Super-soldier', 'Super-structure',
    'Surface', 'Surreal', 'Survivor', 'Swamp', 'Swarm', 'Sword', 'Symbol', 'Symmetry', 'Synapse',
    'Synth', 'Synthwave', 'System', 'Tactical', 'Tank', 'Target', 'Tears', 'Tech', 'Techno', 'Techno-mage',
    'Technocracy', 'Technology', 'Telekinesis', 'Telepathy', 'Teleport', 'Temple', 'Terminal', 'Terraform',
    'Terraformed Planet', 'Terror', 'Tesseract', 'Test', 'Texture', 'Theory', 'Thief', 'Thorn', 'Threat',
    'Throne', 'Thunder', 'Time', 'Time Travel', 'Titan', 'Titanium', 'Token', 'Tomb', 'Tool', 'Tornado',
    'Torrent', 'Torture', 'Touch', 'Tower', 'Town', 'Toxic', 'Trace', 'Track', 'Trade', 'Trader', 'Tragedy',
    'Trail', 'Train', 'Training', 'Trance', 'Tranquility', 'Transcendent', 'Transducer', 'Transfer',
    'Transformation', 'Transistor', 'Transition', 'Transmission', 'Transmitter', 'Transport', 'Trap',
    'Travel', 'Treason', 'Treasure', 'Tree', 'Trench', 'Trial', 'Triangle', 'Tribe', 'Tribute', 'Trigger',
    'Trinity', 'Triumph', 'Trooper', 'Trophy', 'Trouble', 'Truck', 'Truth', 'Tsunami', 'Tube', 'Tundra',
    'Tunnel', 'Turbine', 'Turmoil', 'Turret', 'Twilight', 'Twin', 'Twist', 'Tycoon', 'Tyranny', 'Tyrant',
    'Ultimate', 'Ultra', 'Umbra', 'Uncertainty', 'Under-construction', 'Under-developed', 'Under-ground',
    'Underwater', 'Underwater City', 'Undead', 'Uniform', 'Union', 'Unique', 'Unit', 'Unity', 'Universal',
    'Universe', 'Unknown', 'Unreal', 'Unstable', 'Uprising', 'Urban', 'Utopia', 'Utopian', 'Vacuum',
    'Vagrant', 'Valley', 'Valor', 'Vampire', 'Vanish', 'Vapor', 'Vaporwave', 'Vault', 'Vector', 'Veil',
    'Velocity', 'Venom', 'Venture', 'Verdant', 'Verse', 'Vertical', 'Vessel', 'Veteran', 'Vex', 'Vibrant',
    'Vice', 'Victim', 'Victory', 'View', 'Vigil', 'Vigilante', 'Viking', 'Village', 'Villain', 'Violet',
    'Virtual', 'Virtual Reality', 'Virtue', 'Virus', 'Vision', 'Visitor', 'Vista', 'Vitality', 'Void',
    'Volcanic', 'Volcanic Planet', 'Volcano', 'Volt', 'Voltage', 'Vortex', 'Voyage', 'Voyager', 'VR', 'Wall',
    'Wanderer', 'War', 'War-drone', 'War-fare', 'War-game', 'War-hammer', 'War-head', 'War-lock', 'War-lord',
    'War-machine', 'War-monger', 'War-ship', 'Warden', 'Warehouse', 'Warp', 'Warp Drive', 'Warrior', 'Wasteland',
    'Watch', 'Watcher', 'Water', 'Waterfall', 'Wave', 'Weapon', 'Weary', 'Weather', 'Web', 'Weird', 'West',
    'Western', 'Wet', 'Whale', 'Whirlpool', 'Whisper', 'White', 'White-hole', 'Wild', 'Wilderness', 'Wind',
    'Window', 'Winter', 'Wire', 'Wisdom', 'Witch', 'Wizard', 'Wolf', 'Wonder', 'Wood', 'Work', 'Worker',
    'Workshop', 'World', 'Wormhole', 'Worn', 'Worship', 'Wrath', 'Wreck', 'Wreckage', 'Writer', 'X-ray',
    'Xenomorph', 'Xenophobia', 'Year', 'Yellow', 'Yin-yang', 'Youth', 'Zealot', 'Zen', 'Zenith', 'Zero',
    'Zero-gravity', 'Zone'
  ];
  
  const initialCategories = ['Cyberpunk', 'Space', 'NASA', 'Abstract', 'Neon', 'Glitch', 'Futuristic'];

  const noDuplicates = useMemo(() => {
    const uniqueCategories = [...new Set(allCategories.map(c => c.toLowerCase()))];
    return uniqueCategories.map(lc => allCategories.find(c => c.toLowerCase() === lc)!);
  }, [allCategories]);

  const filteredCategories = useMemo(() => 
    noDuplicates.filter(c => c.toLowerCase().includes(categoryFilter.toLowerCase()))
    .sort()
    , [categoryFilter, noDuplicates]
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
       <TermsDialog open={showTerms} onAccept={handleTermsAccepted} />
       <OnboardingDialog 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding}
        onContinue={handleOnboardingComplete}
      />
      <Header />
      <main className="flex-grow">
        {isAppReady ? (
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
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            {/* You can add a spinner here if you like */}
          </div>
        )}
      </main>
      {isAppReady && <AdBanner />}
    </div>
  );
}

    