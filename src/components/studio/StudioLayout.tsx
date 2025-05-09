
import { useState } from 'react';
import { MemeDraft } from '@/pages/MemeCreationStudio';
import EditingTools from './EditingTools';
import MemePreview from './MemePreview';
import TemplateGallery from './TemplateGallery';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Save, Upload, Eye } from 'lucide-react';

interface StudioLayoutProps {
  meme: MemeDraft;
  onMemeUpdate: (updates: Partial<MemeDraft>) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onAddCaption: () => void;
  onUpdateCaption: (id: string, updates: any) => void;
  onRemoveCaption: (id: string) => void;
  currentImageIndex?: number;
  onChangeImage?: (index: number) => void;
}

export const StudioLayout = ({
  meme,
  onMemeUpdate,
  onSaveDraft,
  onPublish,
  onAddCaption,
  onUpdateCaption,
  onRemoveCaption,
  currentImageIndex = 0,
  onChangeImage
}: StudioLayoutProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("edit");
  
  // Update a specific caption property
  const handleCaptionUpdate = (id: string, updates: any) => {
    onUpdateCaption(id, updates);
  };

  // Handle image navigation
  const goToPreviousImage = () => {
    if (meme.imageUrls?.length > 1) {
      if (onChangeImage) {
        onChangeImage(currentImageIndex === 0 ? meme.imageUrls.length - 1 : currentImageIndex - 1);
      }
    }
  };

  const goToNextImage = () => {
    if (meme.imageUrls?.length > 1) {
      if (onChangeImage) {
        onChangeImage(currentImageIndex === meme.imageUrls.length - 1 ? 0 : currentImageIndex + 1);
      }
    }
  };

  // Get the current image URL
  const currentImageUrl = meme.imageUrls && meme.imageUrls.length > 0 
    ? meme.imageUrls[currentImageIndex] 
    : '';

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit">
            <EditingTools 
              meme={meme} 
              onMemeUpdate={onMemeUpdate}
              onAddCaption={onAddCaption}
              onUpdateCaption={handleCaptionUpdate}
              onRemoveCaption={onRemoveCaption}
              currentImageIndex={currentImageIndex}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            {meme.imageUrls && meme.imageUrls.length > 1 && (
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="icon" onClick={goToPreviousImage}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>{currentImageIndex + 1} / {meme.imageUrls.length}</span>
                <Button variant="outline" size="icon" onClick={goToNextImage}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <MemePreview 
              meme={{...meme, imageUrl: currentImageUrl}} 
              onUpdateCaption={handleCaptionUpdate} 
            />
          </TabsContent>
          
          <TabsContent value="templates">
            <TemplateGallery 
              onTemplateSelect={(imageUrl) => {
                if (meme.imageUrls) {
                  const newImageUrls = [...meme.imageUrls];
                  newImageUrls[currentImageIndex] = imageUrl;
                  onMemeUpdate({ imageUrls: newImageUrls });
                } else {
                  onMemeUpdate({ imageUrls: [imageUrl] });
                }
                setActiveTab("edit");
              }} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 mt-4 sticky bottom-0 bg-background p-4 border-t">
          <Button 
            variant="outline" 
            onClick={onSaveDraft}
            className="flex-1"
          >
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button 
            onClick={onPublish}
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left panel: Editing tools */}
      <div className="col-span-3">
        <EditingTools 
          meme={meme} 
          onMemeUpdate={onMemeUpdate}
          onAddCaption={onAddCaption}
          onUpdateCaption={handleCaptionUpdate}
          onRemoveCaption={onRemoveCaption}
          currentImageIndex={currentImageIndex}
        />
      </div>

      {/* Center: Live preview */}
      <div className="col-span-6">
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Preview</h2>
          
          {meme.imageUrls && meme.imageUrls.length > 1 && (
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="icon" onClick={goToPreviousImage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>{currentImageIndex + 1} / {meme.imageUrls.length}</span>
              <Button variant="outline" size="icon" onClick={goToNextImage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <MemePreview 
            meme={{...meme, imageUrl: currentImageUrl}} 
            onUpdateCaption={handleCaptionUpdate}
            currentImageIndex={currentImageIndex}
            onChangeImage={onChangeImage}
          />
        </div>
        
        <div className="flex justify-center gap-4 mt-6">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onSaveDraft}
          >
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button 
            size="lg" 
            onClick={onPublish}
          >
            <Upload className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
      </div>

      {/* Right panel: Template gallery */}
      <div className="col-span-3">
        <TemplateGallery 
          onTemplateSelect={(imageUrl) => {
            if (meme.imageUrls) {
              const newImageUrls = [...meme.imageUrls];
              newImageUrls[currentImageIndex] = imageUrl;
              onMemeUpdate({ imageUrls: newImageUrls });
            } else {
              onMemeUpdate({ imageUrls: [imageUrl] });
            }
          }} 
        />
      </div>
    </div>
  );
};
