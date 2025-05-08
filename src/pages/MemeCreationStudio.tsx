
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { StudioLayout } from '@/components/studio/StudioLayout';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';

// Define meme draft structure
export interface MemeDraft {
  id?: string;
  templateId?: string;
  imageUrl: string;
  topCaption: string;
  bottomCaption: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
  textShadow: boolean;
  additionalCaptions: Array<{
    text: string;
    position: { x: number; y: number };
  }>;
  filter: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
  lastSaved?: Date;
}

const MemeCreationStudio = () => {
  // Use protected route hook to redirect if not authenticated
  useProtectedRoute();
  const navigate = useNavigate();
  const { toast: shadowToast } = useToast();

  // Initialize meme state with default values
  const [meme, setMeme] = useState<MemeDraft>({
    imageUrl: '',
    topCaption: '',
    bottomCaption: '',
    textColor: '#ffffff',
    fontSize: 32,
    fontFamily: 'Impact',
    alignment: 'center',
    textShadow: true,
    additionalCaptions: [],
    filter: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (meme.imageUrl) {
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

  // Auto-save the meme draft
  const handleAutoSave = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('meme-draft', JSON.stringify({ ...meme, lastSaved: new Date() }));
    console.log('Auto-saved draft');
  };

  // Save the meme draft with user confirmation
  const handleSaveDraft = () => {
    // In a real app, this would save to a backend
    localStorage.setItem('meme-draft', JSON.stringify({ ...meme, lastSaved: new Date() }));
    toast('Draft saved', {
      description: 'Your meme has been saved to drafts.',
    });
  };

  // Publish the meme
  const handlePublish = () => {
    // Validate that we have an image and at least some text
    if (!meme.imageUrl) {
      shadowToast({
        title: 'Cannot publish',
        description: 'Please select or upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    if (!meme.topCaption && !meme.bottomCaption && meme.additionalCaptions.length === 0) {
      shadowToast({
        title: 'Cannot publish',
        description: 'Please add at least one caption to your meme.',
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
        />
      </div>
    </Layout>
  );
};

export default MemeCreationStudio;
