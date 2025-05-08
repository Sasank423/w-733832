
import { ChangeEvent, useRef } from 'react';
import { MemeDraft } from '@/pages/MemeCreationStudio';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  SliderHorizontal,
  FileImage
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface EditingToolsProps {
  meme: MemeDraft;
  onMemeUpdate: (updates: Partial<MemeDraft>) => void;
}

const FONT_OPTIONS = [
  { value: 'Impact', label: 'Impact (Classic)' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Comic Sans MS', label: 'Comic Sans' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times' },
  { value: 'Courier New', label: 'Courier' },
  { value: 'Verdana', label: 'Verdana' },
];

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const EditingTools = ({ meme, onMemeUpdate }: EditingToolsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast('Invalid file type', {
        description: 'Please upload a JPG, PNG, or GIF file.',
      });
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast('File too large', {
        description: `Maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }
    
    // Create a URL for the file
    const imageUrl = URL.createObjectURL(file);
    onMemeUpdate({ imageUrl });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              ref={fileInputRef}
              type="file" 
              className="hidden"
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
            />
            <Button 
              onClick={triggerFileUpload} 
              variant="outline" 
              className="w-full"
            >
              <FileImage className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            
            <div className="text-xs text-muted-foreground">
              JPG, PNG, GIF formats. Max {MAX_FILE_SIZE_MB}MB.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Caption</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topCaption">Top Caption</Label>
            <Input 
              id="topCaption"
              value={meme.topCaption}
              onChange={(e) => onMemeUpdate({ topCaption: e.target.value })}
              placeholder="TOP TEXT HERE"
            />
          </div>
          
          <div>
            <Label htmlFor="bottomCaption">Bottom Caption</Label>
            <Input 
              id="bottomCaption"
              value={meme.bottomCaption}
              onChange={(e) => onMemeUpdate({ bottomCaption: e.target.value })}
              placeholder="BOTTOM TEXT HERE"
            />
          </div>
          
          <div>
            <Label htmlFor="fontFamily">Font</Label>
            <Select 
              value={meme.fontFamily} 
              onValueChange={(value) => onMemeUpdate({ fontFamily: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2">
              <Input 
                id="textColor"
                type="color" 
                value={meme.textColor}
                onChange={(e) => onMemeUpdate({ textColor: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input 
                value={meme.textColor}
                onChange={(e) => onMemeUpdate({ textColor: e.target.value })}
                className="flex-1"
                maxLength={7}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="fontSize">Font Size: {meme.fontSize}px</Label>
            </div>
            <Slider
              id="fontSize"
              min={16}
              max={72}
              step={1}
              value={[meme.fontSize]}
              onValueChange={(value) => onMemeUpdate({ fontSize: value[0] })}
              className="py-4"
            />
          </div>
          
          <div>
            <Label>Alignment</Label>
            <div className="flex gap-2 mt-2">
              <Button 
                type="button"
                variant={meme.alignment === 'left' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onMemeUpdate({ alignment: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant={meme.alignment === 'center' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onMemeUpdate({ alignment: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                type="button"
                variant={meme.alignment === 'right' ? 'default' : 'outline'}
                size="icon"
                onClick={() => onMemeUpdate({ alignment: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced Options</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="textShadow">Text Shadow</Label>
                <input
                  type="checkbox"
                  id="textShadow"
                  checked={meme.textShadow}
                  onChange={(e) => onMemeUpdate({ textShadow: e.target.checked })}
                  className="ml-auto"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="brightness">Brightness: {meme.filter.brightness}%</Label>
                </div>
                <Slider
                  id="brightness"
                  min={50}
                  max={150}
                  step={1}
                  value={[meme.filter.brightness]}
                  onValueChange={(value) => 
                    onMemeUpdate({ 
                      filter: { ...meme.filter, brightness: value[0] } 
                    })
                  }
                  className="py-3"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="contrast">Contrast: {meme.filter.contrast}%</Label>
                </div>
                <Slider
                  id="contrast"
                  min={50}
                  max={150}
                  step={1}
                  value={[meme.filter.contrast]}
                  onValueChange={(value) => 
                    onMemeUpdate({ 
                      filter: { ...meme.filter, contrast: value[0] } 
                    })
                  }
                  className="py-3"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <Label htmlFor="saturation">Saturation: {meme.filter.saturation}%</Label>
                </div>
                <Slider
                  id="saturation"
                  min={0}
                  max={200}
                  step={1}
                  value={[meme.filter.saturation]}
                  onValueChange={(value) => 
                    onMemeUpdate({ 
                      filter: { ...meme.filter, saturation: value[0] } 
                    })
                  }
                  className="py-3"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default EditingTools;
