
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/database';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

export const useComments = (memeId: string | undefined) => {
  return useQuery({
    queryKey: ['comments', memeId],
    queryFn: async (): Promise<Comment[]> => {
      if (!memeId) return [];
      
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles!comments_user_id_fkey(id, username, avatar)
        `)
        .eq('meme_id', memeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!memeId,
  });
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ memeId, text }: { memeId: string, text: string }) => {
      if (!user) throw new Error('You must be logged in to comment');
      
      // Add the comment - the trigger will handle updating the count
      const { data, error } = await supabase
        .from('comments')
        .insert({
          meme_id: memeId,
          user_id: user.id,
          text
        })
        .select(`
          *,
          user:profiles!comments_user_id_fkey(id, username, avatar)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ['comments', variables.memeId] });
      queryClient.invalidateQueries({ queryKey: ['meme', variables.memeId] });
      queryClient.invalidateQueries({ queryKey: ['meme-feed'] }); // For the browse page
      queryClient.invalidateQueries({ queryKey: ['trending-memes'] }); // For trending section
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Comment failed",
        description: (error as Error).message || "Failed to post comment",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ commentId, memeId }: { commentId: string, memeId: string }) => {
      // Delete the comment - the trigger will handle updating the count
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      return { commentId, memeId };
    },
    onSuccess: ({ memeId }) => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ['comments', memeId] });
      queryClient.invalidateQueries({ queryKey: ['meme', memeId] });
      queryClient.invalidateQueries({ queryKey: ['meme-feed'] }); // For the browse page
      queryClient.invalidateQueries({ queryKey: ['trending-memes'] }); // For trending section
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: (error as Error).message || "Failed to delete comment",
        variant: "destructive",
      });
    },
  });
};
