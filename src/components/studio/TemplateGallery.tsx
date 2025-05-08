
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';

interface TemplateGalleryProps {
  onTemplateSelect: (imageUrl: string) => void;
}

// Placeholder templates - in a real app, these would come from an API
const TEMPLATES = [
  {
    id: 'template1',
    name: 'Drake Hotline Bling',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    category: 'reactions'
  },
  {
    id: 'template2',
    name: 'Two Buttons',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    category: 'decisions'
  },
  {
    id: 'template3',
    name: 'Distracted Boyfriend',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    category: 'reactions'
  },
  {
    id: 'template4',
    name: 'Running Away Balloon',
    imageUrl: 'https://i.imgflip.com/261o3j.jpg',
    category: 'metaphors'
  },
  {
    id: 'template5',
    name: 'UNO Draw 25 Cards',
    imageUrl: 'https://i.imgflip.com/3lmzyx.jpg',
    category: 'decisions'
  },
  {
    id: 'template6',
    name: 'Left Exit 12 Off Ramp',
    imageUrl: 'https://i.imgflip.com/22bdq6.jpg',
    category: 'decisions'
  },
  {
    id: 'template7',
    name: 'Expanding Brain',
    imageUrl: 'https://i.imgflip.com/1jwhww.jpg',
    category: 'intelligence'
  },
  {
    id: 'template8',
    name: 'Woman Yelling At Cat',
    imageUrl: 'https://i.imgflip.com/345v97.jpg',
    category: 'reactions'
  }
];

// Categories based on the templates
const CATEGORIES = Array.from(
  new Set(TEMPLATES.map(template => template.category))
);

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
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs py-1 px-2.5 rounded-full capitalize ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <ScrollArea className="h-[400px] rounded-md">
          <div className="grid grid-cols-2 gap-2">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onTemplateSelect(template.imageUrl)}
              >
                <img
                  src={template.imageUrl}
                  alt={template.name}
                  className="w-full h-auto rounded-md object-cover aspect-square"
                />
                <p className="text-xs mt-1 text-center truncate">{template.name}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplateGallery;
