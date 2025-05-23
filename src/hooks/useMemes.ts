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
          creator:profiles(id, username, avatar, created_at, updated_at)
        `)
        .eq('is_weekly_champion', true)
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (!data) {
        // If no weekly champion, get highest voted
        const { data: topMeme, error: topError } = await supabase
          .from('memes')
          .select(`
            *,
            creator:profiles(id, username, avatar, created_at, updated_at)
          `)
          .order('vote_count', { ascending: false })
          .limit(1)
          .single();
          
        if (topError && topError.code !== 'PGRST116') {
          throw topError;
        }
        
        // Ensure the returned data conforms to the Meme interface
        if (topMeme) {
          return {
            ...topMeme,
            dislike_count: 'dislike_count' in topMeme ? topMeme.dislike_count : 0
          } as Meme;
        }
        
        return null;
      }
      
      // Ensure the returned data conforms to the Meme interface
      return {
        ...data,
        dislike_count: 'dislike_count' in data ? data.dislike_count : 0
      } as Meme;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMemeOfTheDay = () => {
  return useQuery({
    queryKey: ['meme-of-the-day'],
    queryFn: async (): Promise<Meme | null> => {
      // Calculate 24 hours ago from the current time
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      // Get the meme with the highest vote count in the last 24 hours
      const { data, error } = await supabase
        .from('memes')
        .select(`
          *,
          creator:profiles(id, username, avatar, created_at, updated_at)
        `)
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('vote_count', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // Ensure the returned data conforms to the Meme interface
      if (data) {
        // Make sure dislike_count is included (required by Meme interface)
        return {
          ...data,
          dislike_count: 'dislike_count' in data ? data.dislike_count : 0
        } as Meme;
      }
      
      return null;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
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
          creator:profiles(id, username, avatar, created_at, updated_at)
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
      
      // Ensure all items have the required properties for the Meme interface
      return (data || []).map(item => ({
        ...item,
        dislike_count: 'dislike_count' in item ? item.dislike_count : 0
      })) as Meme[];
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
          creator:profiles(id, username, avatar, created_at, updated_at)
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
      
      // Ensure all items have the required properties for the Meme interface
      const memes = (data || []).map(item => ({
        ...item,
        dislike_count: 'dislike_count' in item ? item.dislike_count : 0
      })) as Meme[];
      
      return { 
        memes,
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
      
      // Try to update view count using the edge function
      try {
        await supabase.functions.invoke('increment_view_count', {
          body: { memeId: id }
        });
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
      
      const { data, error } = await supabase
        .from('memes')
        .select(`
          *,
          creator:profiles(id, username, avatar, created_at, updated_at),
          tags:meme_tags(tag_id, tags:tags(id, name))
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // The returned data might need to be transformed to match our expected type structure
      if (data) {
        // Keep the data as is, we've updated the MemeTag interface to match
        return data as Meme;
      }
      
      return null;
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
      // value: 1 for like, -1 for dislike

      try {
        // Use the new vote_on_meme function which works with our trigger system
        const { data, error } = await supabase.rpc('vote_on_meme', {
          p_meme_id: memeId,
          p_vote_value: value
        });

        if (error) {
          console.error('Error voting on meme:', error);
          throw error;
        }

        // After successful vote, get the current vote status
        const { data: voteData, error: voteError } = await supabase
          .from('votes')
          .select('id, value')
          .eq('meme_id', memeId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (voteError) throw voteError;
        return voteData; // This might be null if the vote was removed
      } catch (error) {
        console.error('Failed to vote:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate all relevant queries to ensure UI is in sync
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
