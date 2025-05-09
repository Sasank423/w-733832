
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { StudioLayout } from '@/components/studio/StudioLayout';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';

// Define draggable text caption structure
interface DraggableCaption {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

// Define meme draft structure
export interface MemeDraft {
  id?: string;
  templateId?: string;
  imageUrl: string;
  imageUrls?: string[];
  textCaptions: DraggableCaption[];
  textColor: string;
  fontSize: number;
  fontFamily: string;
  textShadow: boolean;
  filter: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
  lastSaved?: Date;
}

const MemeCreationStudio = () => {
  // Use protected route hook to redirect if not authenticated
  const { isAuthenticated } = useProtectedRoute({ allowGuest: true });
  const navigate = useNavigate();
  const { toast: shadowToast } = useToast();

  // Track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Initialize meme state with default values
  const [meme, setMeme] = useState<MemeDraft>({
    imageUrl: '',
    imageUrls: [],
    textCaptions: [],
    textColor: '#ffffff',
    fontSize: 32,
    fontFamily: 'Impact',
    textShadow: true,
    filter: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (meme.imageUrls && meme.imageUrls.length > 0) {
      const autosaveTimer = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(autosaveTimer);
    }
  }, [meme]);

  // Handle updates to the meme state
  const handleMemeUpdate = (updates: Partial<MemeDraft>) => {
    setMeme(prev => ({ ...prev, ...updates }));
  };

  // Add a new text caption
  const handleAddCaption = () => {
    const newCaption: DraggableCaption = {
      id: `caption-${Date.now()}`,
      text: 'New Caption',
      position: { x: 50, y: 50 }, // Center of the image
    };

    setMeme(prev => ({
      ...prev,
      textCaptions: [...prev.textCaptions, newCaption],
    }));
  };

  // Update a specific caption
  const handleUpdateCaption = (id: string, updates: Partial<DraggableCaption>) => {
    setMeme(prev => ({
      ...prev,
      textCaptions: prev.textCaptions.map(caption => 
        caption.id === id ? { ...caption, ...updates } : caption
      ),
    }));
  };

  // Remove a caption
  const handleRemoveCaption = (id: string) => {
    setMeme(prev => ({
      ...prev,
      textCaptions: prev.textCaptions.filter(caption => caption.id !== id),
    }));
  };

  // Auto-save the meme draft
  const handleAutoSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('meme-draft', JSON.stringify({ ...meme, lastSaved: new Date() }));
    console.log('Auto-saved draft');
  };

  // Save the meme draft with user confirmation
  const handleSaveDraft = () => {
    if (!isAuthenticated) {
      shadowToast({
        title: 'Authentication required',
        description: 'Please sign in to save drafts.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would save to a backend
    localStorage.setItem('meme-draft', JSON.stringify({ ...meme, lastSaved: new Date() }));
    toast('Draft saved', {
      description: 'Your meme has been saved to drafts.',
    });
  };

  // Publish the meme
  const handlePublish = () => {
    if (!isAuthenticated) {
      shadowToast({
        title: 'Authentication required',
        description: 'Please sign in to publish memes.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate that we have an image and at least some text
    if (!meme.imageUrls || meme.imageUrls.length === 0) {
      shadowToast({
        title: 'Cannot publish',
        description: 'Please select or upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    if (meme.textCaptions.length === 0) {
      shadowToast({
        title: 'Cannot publish',
        description: 'Please add at least one text caption to your meme.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would publish to a backend
    toast('Meme published!', {
      description: 'Your meme is now live for everyone to see.',
    });
    
    // Navigate to the meme details page
    // In a real app, this would navigate to the actual published meme
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Create Your Meme</h1>
        
        <StudioLayout 
          meme={meme}
          onMemeUpdate={handleMemeUpdate}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onAddCaption={handleAddCaption}
          onUpdateCaption={handleUpdateCaption}
          onRemoveCaption={handleRemoveCaption}
          currentImageIndex={currentImageIndex}
          onChangeImage={setCurrentImageIndex}
        />
      </div>
    </Layout>
  );
};

export default MemeCreationStudio;
