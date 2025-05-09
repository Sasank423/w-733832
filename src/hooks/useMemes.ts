
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meme, Tag } from '@/types/database';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

export const useFeaturedMeme = () => {
  return useQuery({
    queryKey: ['featured-meme'],
    queryFn: async (): Promise<Meme | null> => {
      const { data, error } = await supabase
        .from('memes')
        .select(`
          *,
          creator:profiles!memes_creator_id_fkey(id, username, avatar)
        `)
        .eq('is_meme_of_day', true)
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (!data) {
        // If no meme of the day, get highest voted
        const { data: topMeme, error: topError } = await supabase
          .from('memes')
          .select(`
            *,
            creator:profiles!memes_creator_id_fkey(id, username, avatar)
          `)
          .order('vote_count', { ascending: false })
          .limit(1)
          .single();
          
        if (topError && topError.code !== 'PGRST116') {
          throw topError;
        }
        
        return topMeme || null;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrendingMemes = (category: 'rising' | 'weekly' | 'allTime', limit: number = 10) => {
  return useQuery({
    queryKey: ['trending-memes', category, limit],
    queryFn: async (): Promise<Meme[]> => {
      let query = supabase
        .from('memes')
        .select(`
          *,
          creator:profiles!memes_creator_id_fkey(id, username, avatar)
        `)
        .limit(limit);
      
      // Different sorting based on category
      if (category === 'rising') {
        // Rising - recent memes with good vote count
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
        query = query
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('vote_count', { ascending: false });
      } else if (category === 'weekly') {
        // Weekly - top memes from the past week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        query = query
          .gte('created_at', oneWeekAgo.toISOString())
          .order('vote_count', { ascending: false });
      } else {
        // All time - just top voted
        query = query.order('vote_count', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useMemeFeed = (filter: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['meme-feed', filter, page],
    queryFn: async (): Promise<{ memes: Meme[], hasMore: boolean }> => {
      let query = supabase
        .from('memes')
        .select(`
          *,
          creator:profiles!memes_creator_id_fkey(id, username, avatar)
        `);
      
      // Apply different sorting based on filter
      if (filter === 'new') {
        query = query.order('created_at', { ascending: false });
      } else if (filter === 'top') {
        query = query.order('vote_count', { ascending: false });
      } else if (filter === 'hot') {
        // "Hot" algorithm - balance between recent and popular
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        query = query
          .gte('created_at', oneWeekAgo.toISOString())
          .order('vote_count', { ascending: false });
      }
      
      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      query = query.range(from, to);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Check if there are more memes to fetch
      const { count, error: countError } = await supabase
        .from('memes')
        .select('*', { count: 'exact', head: true });
      
      const hasMore = countError ? false : (count ? count > (page * limit) : false);
      
      return { 
        memes: data || [],
        hasMore 
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useMeme = (id: string | undefined) => {
  return useQuery({
    queryKey: ['meme', id],
    queryFn: async (): Promise<Meme | null> => {
      if (!id) return null;
      
      // Update view count in a separate call
      await supabase.rpc('increment_view_count', { meme_id: id });
      
      const { data, error } = await supabase
        .from('memes')
        .select(`
          *,
          creator:profiles!memes_creator_id_fkey(id, username, avatar),
          tags:meme_tags(tag_id, tags:tags(id, name))
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useUserVote = (memeId: string | undefined) => {
  const { user, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['vote', memeId, user?.id],
    queryFn: async (): Promise<{ id: string, value: number } | null> => {
      if (!memeId || !user) return null;
      
      const { data, error } = await supabase
        .from('votes')
        .select('id, value')
        .eq('meme_id', memeId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memeId && isAuthenticated,
  });
};

export const useVoteMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ memeId, value }: { memeId: string, value: number }) => {
      if (!user) throw new Error('You must be logged in to vote');
      
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id, value')
        .eq('meme_id', memeId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingVote) {
        // User already voted, update if different value or delete if same value
        if (existingVote.value !== value) {
          // Update to new vote value
          const { data, error } = await supabase
            .from('votes')
            .update({ value })
            .eq('id', existingVote.id)
            .select();
          
          if (error) throw error;
          return data;
        } else {
          // Remove vote (toggle off)
          const { error } = await supabase
            .from('votes')
            .delete()
            .eq('id', existingVote.id);
          
          if (error) throw error;
          return null;
        }
      } else {
        // Create new vote
        const { data, error } = await supabase
          .from('votes')
          .insert({
            meme_id: memeId,
            user_id: user.id,
            value
          })
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vote', variables.memeId] });
      queryClient.invalidateQueries({ queryKey: ['meme', variables.memeId] });
      queryClient.invalidateQueries({ queryKey: ['meme-feed'] });
      queryClient.invalidateQueries({ queryKey: ['trending-memes'] });
      queryClient.invalidateQueries({ queryKey: ['featured-meme'] });
    },
    onError: (error) => {
      toast({
        title: "Vote failed",
        description: (error as Error).message || "Failed to register vote",
        variant: "destructive",
      });
    },
  });
};
