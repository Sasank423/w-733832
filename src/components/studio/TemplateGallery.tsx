import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';

interface TemplateGalleryProps {
  onTemplateSelect: (imageUrl: string) => void;
}

// Meme templates (restored and expanded)
const TEMPLATES = [
  { id: 'template1', name: 'Drake Hotline Bling', imageUrl: 'https://i.imgflip.com/30b1gx.jpg', category: 'reactions' },
  { id: 'template2', name: 'Two Buttons', imageUrl: 'https://i.imgflip.com/1g8my4.jpg', category: 'decisions' },
  { id: 'template3', name: 'Distracted Boyfriend', imageUrl: 'https://i.imgflip.com/1ur9b0.jpg', category: 'reactions' },
  { id: 'template4', name: 'Running Away Balloon', imageUrl: 'https://i.imgflip.com/261o3j.jpg', category: 'metaphors' },
  { id: 'template5', name: 'UNO Draw 25 Cards', imageUrl: 'https://i.imgflip.com/3lmzyx.jpg', category: 'decisions' },
  { id: 'template6', name: 'Left Exit 12 Off Ramp', imageUrl: 'https://i.imgflip.com/22bdq6.jpg', category: 'decisions' },
  { id: 'template7', name: 'Expanding Brain', imageUrl: 'https://i.imgflip.com/1jwhww.jpg', category: 'intelligence' },
  { id: 'template8', name: 'Woman Yelling At Cat', imageUrl: 'https://i.imgflip.com/345v97.jpg', category: 'reactions' },
  { id: 'template9', name: 'Disaster Girl', imageUrl: 'https://i.imgflip.com/23ls.jpg', category: 'evil' },
  { id: 'template10', name: 'Change My Mind', imageUrl: 'https://i.imgflip.com/24y43o.jpg', category: 'opinions' },
  { id: 'template11', name: 'Surprised Pikachu', imageUrl: 'https://i.imgflip.com/2kbn1e.jpg', category: 'reactions' },
  { id: 'template12', name: 'One Does Not Simply', imageUrl: 'https://i.imgflip.com/1bij.jpg', category: 'wisdom' },
  { id: 'template13', name: 'Unsettled Tom', imageUrl: 'https://i.imgflip.com/2wifvo.jpg', category: 'reactions' },
  { id: 'template14', name: 'Ancient Aliens', imageUrl: 'https://i.imgflip.com/26am.jpg', category: 'conspiracy' },
  { id: 'template15', name: 'Waiting Skeleton', imageUrl: 'https://i.imgflip.com/2fm6x.jpg', category: 'waiting' },
  { id: 'template16', name: 'Always Has Been', imageUrl: 'https://i.imgflip.com/46e43q.jpg', category: 'conspiracy' },
  { id: 'template17', name: 'Buff Doge vs. Cheems', imageUrl: 'https://i.imgflip.com/43a45p.png', category: 'comparisons' },
  { id: 'template18', name: 'Trade Offer', imageUrl: 'https://i.imgflip.com/54hjww.jpg', category: 'negotiations' },
  { id: 'template19', name: 'Anakin Padme 4 Panel', imageUrl: 'https://i.imgflip.com/5c7lwq.png', category: 'misunderstandings' },
  { id: 'template20', name: 'Bernie Sanders Once Again Asking', imageUrl: 'https://i.imgflip.com/3oevdk.jpg', category: 'requests' },
  { id: 'template21', name: 'So Anyway I Started Blasting', imageUrl: 'https://i.imgflip.com/3m6riq.jpg', category: 'reactions' },
  { id: 'template22', name: 'They\'re The Same Picture', imageUrl: 'https://i.imgflip.com/2za3u1.jpg', category: 'comparisons' },
  { id: 'template23', name: 'This Is Fine', imageUrl: 'https://i.imgflip.com/wxica.jpg', category: 'denial' },
  // Additional popular meme templates
  { id: 'template24', name: 'Hide the Pain Harold', imageUrl: 'https://i.imgflip.com/gk5el.jpg', category: 'reactions' },
  { id: 'template25', name: 'Mocking SpongeBob', imageUrl: 'https://i.imgflip.com/1otk96.jpg', category: 'reactions' },
  { id: 'template26', name: 'Batman Slapping Robin', imageUrl: 'https://i.imgflip.com/9ehk.jpg', category: 'comics' },
  { id: 'template27', name: 'Is This a Pigeon?', imageUrl: 'https://i.imgflip.com/1o00in.jpg', category: 'questions' },
  { id: 'template28', name: 'Boardroom Meeting Suggestion', imageUrl: 'https://i.imgflip.com/m78d.jpg', category: 'work' },
  { id: 'template29', name: 'Roll Safe Think About It', imageUrl: 'https://i.imgflip.com/1h7in3.jpg', category: 'advice' },
  { id: 'template30', name: 'Expanding Brain (Animated)', imageUrl: 'https://i.imgflip.com/1jwhww.gif', category: 'intelligence' },
];

const CATEGORIES = Array.from(new Set(TEMPLATES.map(template => template.category)));

const TemplateGallery = ({ onTemplateSelect }: TemplateGalleryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Filter templates based on search and category
  const filteredTemplates = TEMPLATES.filter(template => {
    // Filter by search query
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter by category
    const matchesCategory = !activeCategory || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-xs py-1 px-2.5 rounded-full ${
              activeCategory === null 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs py-1 px-2.5 rounded-full ${
                activeCategory === category 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        <ScrollArea className="h-96">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredTemplates.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">
                No templates available.
              </div>
            ) : (
              filteredTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template.imageUrl)}
                  className="rounded-lg overflow-hidden border hover:border-primary hover:shadow-md transition-all duration-200 bg-card flex flex-col"
                >
                  <div className="relative w-full h-36 overflow-hidden bg-muted/30">
                    <img 
                      src={template.imageUrl} 
                      alt={template.name} 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-200" 
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2 text-xs text-center font-medium truncate w-full bg-muted/10 border-t">
                    {template.name}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplateGallery;
