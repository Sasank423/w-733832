import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { DraggableCaption } from '@/types/database';
import { MemeDraft } from '@/pages/MemeCreationStudio';

// Define the database draft type based on Supabase schema
type SupabaseDraft = {
  id: string;
  user_id: string;
  title: string;
  template_id: string | null;
  image_urls: string[];
  text_captions: any; // Using any here as Json type from Supabase
  text_color: string;
  font_size: number;
  font_family: string;
  text_shadow: boolean;
  filter_brightness: number;
  filter_contrast: number;
  filter_saturation: number;
  created_at: string;
  updated_at: string;
};

// Convert MemeDraft to database format for storage
const convertToDBFormat = (draft: MemeDraft, userId: string, title: string = 'Untitled Draft') => {
  // Need to stringify the text_captions to ensure it's stored as JSON in Supabase
  return {
    user_id: userId,
    title,
    template_id: draft.templateId || null,
    image_urls: draft.imageUrls || [],
    text_captions: JSON.stringify(draft.textCaptions), // Convert to JSON string
    text_color: draft.textColor,
    font_size: draft.fontSize,
    font_family: draft.fontFamily,
    text_shadow: draft.textShadow,
    filter_brightness: draft.filter.brightness,
    filter_contrast: draft.filter.contrast,
    filter_saturation: draft.filter.saturation,
  };
};

// Convert database format to MemeDraft for application use
const convertFromDBFormat = (dbDraft: SupabaseDraft): MemeDraft & { id: string, title: string, lastSaved: Date } => {
  // Parse the text_captions from JSON string back to array of DraggableCaption objects
  let textCaptions: DraggableCaption[] = [];
  try {
    if (typeof dbDraft.text_captions === 'string') {
      textCaptions = JSON.parse(dbDraft.text_captions);
    } else if (Array.isArray(dbDraft.text_captions)) {
      textCaptions = dbDraft.text_captions;
    }
  } catch (error) {
    console.error('Error parsing text captions:', error);
  }

  return {
    id: dbDraft.id,
    title: dbDraft.title,
    templateId: dbDraft.template_id || undefined,
    imageUrl: dbDraft.image_urls[0] || '',
    imageUrls: dbDraft.image_urls,
    textCaptions,
    textColor: dbDraft.text_color,
    fontSize: dbDraft.font_size,
    fontFamily: dbDraft.font_family,
    textShadow: dbDraft.text_shadow,
    filter: {
      brightness: dbDraft.filter_brightness,
      contrast: dbDraft.filter_contrast,
      saturation: dbDraft.filter_saturation,
    },
    lastSaved: new Date(dbDraft.updated_at),
  };
};

export const useDrafts = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<(MemeDraft & { id: string, title: string, lastSaved: Date })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all drafts for the current user
  const fetchDrafts = async () => {
    if (!isAuthenticated || !user) {
      setDrafts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('meme_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedDrafts = (data || []).map(draft => convertFromDBFormat(draft as SupabaseDraft));
      setDrafts(formattedDrafts);
    } catch (err) {
      console.error('Error fetching drafts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch drafts'));
    } finally {
      setIsLoading(false);
    }
  };

  // Save a draft to the database
  const saveDraft = async (draft: MemeDraft, title: string = 'Untitled Draft', draftId?: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to save drafts.',
        variant: 'destructive',
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const draftData = convertToDBFormat(draft, user.id, title);

      let result;
      if (draftId) {
        // Update existing draft
        result = await supabase
          .from('meme_drafts')
          .update(draftData)
          .eq('id', draftId)
          .eq('user_id', user.id) // Security check
          .select()
          .single();
      } else {
        // Create new draft
        result = await supabase
          .from('meme_drafts')
          .insert(draftData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      const savedDraft = convertFromDBFormat(result.data as SupabaseDraft);
      
      // Update local drafts state
      setDrafts(prevDrafts => {
        const existingIndex = prevDrafts.findIndex(d => d.id === savedDraft.id);
        if (existingIndex >= 0) {
          // Replace existing draft
          const newDrafts = [...prevDrafts];
          newDrafts[existingIndex] = savedDraft;
          return newDrafts;
        } else {
          // Add new draft to the beginning
          return [savedDraft, ...prevDrafts];
        }
      });

      return savedDraft;
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err instanceof Error ? err : new Error('Failed to save draft'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a draft from the database
  const deleteDraft = async (draftId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to delete drafts.',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('meme_drafts')
        .delete()
        .eq('id', draftId)
        .eq('user_id', user.id); // Security check

      if (error) throw error;

      // Update local drafts state
      setDrafts(prevDrafts => prevDrafts.filter(draft => draft.id !== draftId));
      return true;
    } catch (err) {
      console.error('Error deleting draft:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete draft'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load drafts when user authentication changes
  useEffect(() => {
    fetchDrafts();
  }, [isAuthenticated, user?.id]);

  return {
    drafts,
    isLoading,
    error,
    fetchDrafts,
    saveDraft,
    deleteDraft,
  };
};
