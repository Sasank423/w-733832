import { ChangeEvent, useRef, useState } from 'react';
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
  SlidersHorizontal,
  FileImage,
  Plus,
  Trash2,
  Edit,
  Images,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface EditingToolsProps {
  meme: MemeDraft;
  onMemeUpdate: (updates: Partial<MemeDraft>) => void;
  onAddCaption: () => void;
  onUpdateCaption: (id: string, updates: any) => void;
  onRemoveCaption: (id: string) => void;
  currentImageIndex?: number;
  onChangeImage?: (index: number) => void;
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

const EditingTools = ({ 
  meme, 
  onMemeUpdate, 
  onAddCaption, 
  onUpdateCaption, 
  onRemoveCaption,
  currentImageIndex = 0,
  onChangeImage
}: EditingToolsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingCaptionId, setEditingCaptionId] = useState<string | null>(null);
  
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
    
    // Update the current image or add a new one
    if (meme.imageUrls) {
      const newImageUrls = [...meme.imageUrls];
      if (currentImageIndex < newImageUrls.length) {
        newImageUrls[currentImageIndex] = imageUrl;
      } else {
        newImageUrls.push(imageUrl);
      }
      onMemeUpdate({ imageUrls: newImageUrls });
    } else {
      onMemeUpdate({ imageUrls: [imageUrl] });
    }
  };

  const addNewImage = () => {
    if (!meme.imageUrls || meme.imageUrls.length === 0) {
      toast('Please upload an image first', {
        description: 'You need at least one image before adding more.',
      });
      return;
    }
    
    // Add a placeholder for a new image
    const newImageUrls = [...(meme.imageUrls || []), ''];
    onMemeUpdate({ imageUrls: newImageUrls });
    
    // Switch to the new image
    if (onChangeImage) {
      onChangeImage(newImageUrls.length - 1);
    }
  };

  const removeCurrentImage = () => {
    if (!meme.imageUrls || meme.imageUrls.length <= 1) {
      toast('Cannot remove', {
        description: 'You need at least one image in your meme.',
      });
      return;
    }

    const newImageUrls = meme.imageUrls.filter((_, index) => index !== currentImageIndex);
    onMemeUpdate({ imageUrls: newImageUrls });
    
    // Adjust current index if needed
    if (onChangeImage && currentImageIndex >= newImageUrls.length) {
      onChangeImage(newImageUrls.length - 1);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleEditCaption = (captionId: string, value: string) => {
    onUpdateCaption(captionId, { text: value });
  };

  const handleCaptionColorChange = (captionId: string, color: string) => {
    onUpdateCaption(captionId, { color });
  };

  const handleCaptionFontSizeChange = (captionId: string, size: number) => {
    onUpdateCaption(captionId, { fontSize: size });
  };

  const handleCaptionFontChange = (captionId: string, fontFamily: string) => {
    onUpdateCaption(captionId, { fontFamily });
  };

  const handlePrevImage = () => {
    if (!meme.imageUrls || !onChangeImage) return;
    const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : meme.imageUrls.length - 1;
    onChangeImage(newIndex);
  };

  const handleNextImage = () => {
    if (!meme.imageUrls || !onChangeImage) return;
    const newIndex = (currentImageIndex + 1) % meme.imageUrls.length;
    onChangeImage(newIndex);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Images</CardTitle>
            <div className="flex gap-1">
              {meme.imageUrls && meme.imageUrls.length > 1 && (
                <Button 
                  size="icon" 
                  variant="destructive" 
                  onClick={removeCurrentImage} 
                  title="Remove current image"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button 
                size="icon" 
                variant="outline" 
                onClick={addNewImage} 
                title="Add another image"
                className="h-8 w-8"
              >
                <Images className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
            
            {meme.imageUrls && meme.imageUrls.length > 1 && (
              <div className="flex justify-between items-center mb-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevImage}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Image {currentImageIndex + 1} of {meme.imageUrls.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextImage}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Button 
              onClick={triggerFileUpload} 
              variant="outline" 
              className="w-full"
            >
              <FileImage className="mr-2 h-4 w-4" /> 
              {meme.imageUrls && meme.imageUrls.length > 0 && meme.imageUrls[currentImageIndex] 
                ? 'Change Image' 
                : 'Upload Image'}
            </Button>
            
            <div className="text-xs text-muted-foreground">
              JPG, PNG, GIF formats. Max {MAX_FILE_SIZE_MB}MB.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Text Captions</CardTitle>
            <Button 
              size="icon" 
              onClick={onAddCaption} 
              variant="outline"
              title="Add Caption"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {meme.textCaptions.length === 0 ? (
            <div className="text-center py-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">No captions added yet.</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2" 
                onClick={onAddCaption}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Your First Caption
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {meme.textCaptions.map((caption) => (
                <div key={caption.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Caption</h4>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6" 
                        onClick={() => setEditingCaptionId(caption.id === editingCaptionId ? null : caption.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-destructive" 
                        onClick={() => onRemoveCaption(caption.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Input 
                    value={caption.text}
                    onChange={(e) => handleEditCaption(caption.id, e.target.value)}
                    className="mb-2"
                  />
                  {editingCaptionId === caption.id && (
                    <div className="space-y-3 mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">X: {caption.position.x.toFixed(0)}%</Label>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[caption.position.x]}
                            onValueChange={(value) => onUpdateCaption(caption.id, { position: { ...caption.position, x: value[0] } })}
                            className="py-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Y: {caption.position.y.toFixed(0)}%</Label>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[caption.position.y]}
                            onValueChange={(value) => onUpdateCaption(caption.id, { position: { ...caption.position, y: value[0] } })}
                            className="py-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`color-${caption.id}`}>Text Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            id={`color-${caption.id}`}
                            type="color" 
                            value={caption.color || meme.textColor}
                            onChange={(e) => handleCaptionColorChange(caption.id, e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                          <Input 
                            value={caption.color || meme.textColor}
                            onChange={(e) => handleCaptionColorChange(caption.id, e.target.value)}
                            className="flex-1"
                            maxLength={7}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`font-${caption.id}`}>Font</Label>
                        <Select 
                          value={caption.fontFamily || meme.fontFamily} 
                          onValueChange={(value) => handleCaptionFontChange(caption.id, value)}
                        >
                          <SelectTrigger id={`font-${caption.id}`}>
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
                        <div className="flex justify-between mb-2">
                          <Label htmlFor={`size-${caption.id}`}>
                            Font Size: {caption.fontSize || meme.fontSize}px
                          </Label>
                        </div>
                        <Slider
                          id={`size-${caption.id}`}
                          min={16}
                          max={72}
                          step={1}
                          value={[caption.fontSize || meme.fontSize]}
                          onValueChange={(value) => handleCaptionFontSizeChange(caption.id, value[0])}
                          className="py-4"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
