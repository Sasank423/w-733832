import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import FeedFilters, { FeedType } from '@/components/meme/FeedFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { ThumbsUp, MessageSquare, Share2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CommentSidebar from '@/components/meme/CommentSidebar';
import TrendingMemes from '@/components/meme/TrendingMemes';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useVoteMutation, useUserVote } from '@/hooks/useMemes';
import { useComments, useAddCommentMutation } from '@/hooks/useComments';
import { AnimatePresence, motion } from 'framer-motion';

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState<FeedType>('new');
  const [memes, setMemes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const observer = useRef<IntersectionObserver | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
  const [showTrendingSection, setShowTrendingSection] = useState(true);
  const queryClient = useQueryClient();
  const voteMutation = useVoteMutation();
  const addCommentMutation = useAddCommentMutation();
  // Track user votes for each meme
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const commentsSubscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Fetch memes from Supabase
  const fetchMemes = useCallback(async (reset = false) => {
    setIsLoading(true);
    
    // Get current date for time-based filters
    const now = new Date();
    
    // Base query
    let query = supabase
      .from('memes')
      .select(`
        *,
        creator:profiles(id, username, avatar, created_at, updated_at)
      `);
    
    // Apply filter logic based on activeFilter
    switch (activeFilter) {
      case 'new':
        // For 'new', order by creation date (newest first)
        query = query.order('created_at', { ascending: false });
        break;
        
      case 'top-day': {
        // For 'top-day', get memes from the last 24 hours ordered by vote count
        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        query = query
          .gte('created_at', oneDayAgo.toISOString())
          .order('vote_count', { ascending: false })
          .order('created_at', { ascending: false });
        break;
      }
        
      case 'top-week': {
        // For 'top-week', get memes from the last 7 days ordered by vote count
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        query = query
          .gte('created_at', oneWeekAgo.toISOString())
          .order('vote_count', { ascending: false })
          .order('created_at', { ascending: false });
        break;
      }
        
      case 'top-all':
        // For 'top-all', order all memes by vote count (highest first)
        query = query
          .order('vote_count', { ascending: false })
          .order('created_at', { ascending: false });
        break;
    }
    
    // Apply pagination
    query = query.range(reset ? 0 : memes.length, (reset ? 0 : memes.length) + 9);
    
    // Execute the query
    const { data, error } = await query;
    
    if (!error) {
      setMemes(prev => reset ? (data || []) : [...prev, ...(data || [])]);
      setHasMore((data?.length || 0) === 10);
    } else {
      console.error('Error fetching memes:', error);
    }
    
    setIsLoading(false);
  }, [memes.length, activeFilter]);

  // Infinite scroll
  const lastMemeElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasMore) {
        fetchMemes();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchMemes]);

  useEffect(() => {
    // Reset when filter changes
    fetchMemes(true);
    setPage(1);
    setHasMore(true);
  }, [activeFilter, fetchMemes]);

  const handleFilterChange = (filter: FeedType) => {
    setActiveFilter(filter);
    // This will trigger the useEffect that calls fetchMemes(true)
  };

  // Load user votes when component mounts or user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchUserVotes = async () => {
        const { data, error } = await supabase
          .from('votes')
          .select('meme_id, value')
          .eq('user_id', user.id);
          
        if (!error && data) {
          // Create a map of meme_id -> vote value
          const votesMap: Record<string, number> = {};
          data.forEach(vote => {
            votesMap[vote.meme_id] = vote.value;
          });
          setUserVotes(votesMap);
        }
      };
      
      fetchUserVotes();
    }
  }, [isAuthenticated, user]);
  
  const handleVote = async (memeId: string, value: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like or dislike memes.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Fetch current meme counts
      const { data: memeData, error: memeError } = await supabase
        .from('memes')
        .select('vote_count, dislike_count')
        .eq('id', memeId)
        .single();
      if (memeError) {
        console.error('Error fetching meme counts:', memeError);
        throw memeError;
      }
      console.log('Fetched meme counts:', memeData);
      const { vote_count: initialVoteCount, dislike_count: initialDislikeCount } = memeData as unknown as { vote_count: number; dislike_count: number };
      let vote_count = initialVoteCount || 0;
      let dislike_count = initialDislikeCount || 0;

      // 2. Fetch user's current vote
      const { data: voteData, error: voteError } = await supabase
        .from('votes')
        .select('id, value')
        .eq('meme_id', memeId)
        .eq('user_id', user?.id)
        .maybeSingle();
      if (voteError) {
        console.error('Error fetching user vote:', voteError);
        throw voteError;
      }
      console.log('Fetched user vote:', voteData);

      // 3. Update counts and votes as needed
      if (voteData) {
        if (voteData.value === value) {
          // Remove vote
          const { error: deleteError } = await supabase.from('votes').delete().eq('id', voteData.id);
          if (deleteError) {
            console.error('Error deleting vote:', deleteError);
            throw deleteError;
          }
          if (value === 1) vote_count--;
          else dislike_count--;
          console.log('Removed vote. New counts:', { vote_count, dislike_count });
          
          // Update local state to remove vote
          setUserVotes(prev => {
            const newVotes = { ...prev };
            delete newVotes[memeId];
            return newVotes;
          });
        } else {
          // Switch vote
          const { error: updateVoteError } = await supabase.from('votes').update({ value }).eq('id', voteData.id);
          if (updateVoteError) {
            console.error('Error updating vote:', updateVoteError);
            throw updateVoteError;
          }
          if (value === 1) {
            vote_count++;
            dislike_count--;
          } else {
            vote_count--;
            dislike_count++;
          }
          console.log('Switched vote. New counts:', { vote_count, dislike_count });
          
          // Update local state with new vote value
          setUserVotes(prev => ({
            ...prev,
            [memeId]: value
          }));
        }
      } else {
        // New vote
        const { error: insertError } = await supabase.from('votes').insert({ meme_id: memeId, user_id: user?.id, value });
        if (insertError) {
          console.error('Error inserting vote:', insertError);
          throw insertError;
        }
        if (value === 1) vote_count++;
        else dislike_count++;
        console.log('Inserted new vote. New counts:', { vote_count, dislike_count });
        
        // Update local state with new vote
        setUserVotes(prev => ({
          ...prev,
          [memeId]: value
        }));
      }

      // 4. Update memes table
      const { error: updateMemeError } = await supabase.from('memes').update({ vote_count, dislike_count }).eq('id', memeId);
      if (updateMemeError) {
        console.error('Error updating meme counts:', updateMemeError);
        throw updateMemeError;
      }
      console.log('Updated meme counts in DB:', { vote_count, dislike_count });

      // 5. Fetch and display updated counts
      const { data: updatedMeme, error: updatedMemeError } = await supabase
        .from('memes')
        .select('vote_count, dislike_count')
        .eq('id', memeId)
        .single();
      if (updatedMemeError) {
        console.error('Error fetching updated meme counts:', updatedMemeError);
        throw updatedMemeError;
      }
      const { vote_count: updatedVoteCount, dislike_count: updatedDislikeCount } = updatedMeme as unknown as { vote_count: number; dislike_count: number };
      console.log('Fetched updated meme counts:', { updatedVoteCount, updatedDislikeCount });

      setMemes(prevMemes => prevMemes.map(meme =>
        meme.id === memeId
          ? { ...meme, vote_count: updatedVoteCount, dislike_count: updatedDislikeCount }
          : meme
      ));

      // Optionally, invalidate queries if you want to keep react-query in sync
      queryClient.invalidateQueries({ queryKey: ['meme-feed'] });
      queryClient.invalidateQueries({ queryKey: ['vote', memeId] });
    } catch (error: any) {
      console.error('Vote failed:', error);
      toast({
        title: "Vote failed",
        description: error.message || "Failed to register vote",
        variant: "destructive",
      });
    }
  };

  const handleCommentClick = (memeId: string) => {
    setSelectedMeme(selectedMeme === memeId ? null : memeId);
  };

  // Set up real-time subscription for comments
  useEffect(() => {
    // Subscribe to changes on the comments table
    const subscription = supabase
      .channel('comments-channel-browse')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'comments'
      }, (payload) => {
        // When a comment is added, updated, or deleted, invalidate the meme-feed query
        // This will cause React Query to refetch the data and update the UI
        queryClient.invalidateQueries({ queryKey: ['meme-feed'] });
      })
      .subscribe();
    
    commentsSubscriptionRef.current = subscription;
    
    return () => {
      // Clean up subscription when component unmounts
      if (commentsSubscriptionRef.current) {
        commentsSubscriptionRef.current.unsubscribe();
      }
    };
  }, [queryClient]);
  
  // Invalidate meme-feed after a comment is added
  useEffect(() => {
    if (addCommentMutation.isSuccess) {
      queryClient.invalidateQueries({ queryKey: ['meme-feed'] });
    }
  }, [addCommentMutation.isSuccess, queryClient]);

  return (
    <Layout>
      <div className="container-layout py-8">
        {/* Trending Section */}
        {showTrendingSection && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Now</span>
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTrendingSection(false)}
              >
                Hide Section
              </Button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6">
              <TrendingMemes limit={3} />
            </div>
          </section>
        )}
        
        {/* Feed section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Meme Feed</h2>
          <FeedFilters onFilterChange={handleFilterChange} />
          
          <div className="flex">
            <div className={`transition-all ${selectedMeme ? 'max-w-3xl w-3/5' : 'w-full'}`}>
              {memes.length > 0 && (
                <div className="mx-auto my-8 space-y-16">
                  {memes.map((meme, index) => {
                    // Check if this is the last element to add the ref
                    const isLastElement = index === memes.length - 1;
                    return (
                      <Card 
                        key={`${meme.id}-${index}`} 
                        className="overflow-hidden"
                        ref={isLastElement ? lastMemeElementRef : null}
                        onMouseEnter={async () => {
                          // Increment view count when meme is hovered (viewed)
                          await supabase.from('memes').update({ view_count: (meme.view_count || 0) + 1 }).eq('id', meme.id);
                          queryClient.invalidateQueries({ queryKey: ['meme-feed'] });
                        }}
                      >
                        <CardHeader className="p-4 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 mr-1">
                                <AvatarImage src={meme.creator?.avatar || ''} />
                                <AvatarFallback>
                                  {meme.creator?.username ? meme.creator.username.charAt(0).toUpperCase() : '?'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="font-medium">
                                  {meme.creator?.username || 'Unknown'}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {meme.created_at ? new Date(meme.created_at).toLocaleDateString() : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                          <div className="relative">
                            <img 
                              src={meme.image_url} 
                              alt={meme.title}
                              className="w-full max-h-[70vh] object-contain mx-auto"
                            />
                          </div>
                          
                          <div className="p-4">
                            <h3 className="text-xl font-bold">{meme.title}</h3>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between p-4 border-t">
                          <div className="flex gap-4 items-center">
                            {/* Like Button */}
                            <div className="flex items-center rounded-md overflow-hidden border border-input">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                disabled={!isAuthenticated} 
                                className={`px-2 rounded-none transition-colors duration-200 ${!isAuthenticated ? 'text-muted-foreground' : ''} ${userVotes[meme.id] === 1 ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 font-medium' : 'hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'}`}
                                onClick={() => handleVote(meme.id, 1)}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  animate={userVotes[meme.id] === 1 ? { y: [0, -5, 0], scale: [1, 1.2, 1] } : {}}
                                  transition={{ 
                                    type: 'spring', 
                                    stiffness: 400, 
                                    damping: 10,
                                    duration: 0.3
                                  }}
                                  className="flex items-center"
                                >
                                  <ThumbsUp className={`mr-1 h-4 w-4 transition-colors duration-200 ${userVotes[meme.id] === 1 ? 'fill-current' : ''}`} />
                                </motion.div>
                              </Button>
                              <div className="px-2 bg-muted/50 text-sm font-medium">{meme.vote_count}</div>
                            </div>
                            
                            {/* Dislike Button */}
                            <div className="flex items-center rounded-md overflow-hidden border border-input">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                disabled={!isAuthenticated} 
                                className={`px-2 rounded-none transition-colors duration-200 ${!isAuthenticated ? 'text-muted-foreground' : ''} ${userVotes[meme.id] === -1 ? 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 font-medium' : 'hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400'}`}
                                onClick={() => handleVote(meme.id, -1)}
                              >
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  animate={userVotes[meme.id] === -1 ? { y: [0, 5, 0], scale: [1, 1.2, 1] } : {}}
                                  transition={{ 
                                    type: 'spring', 
                                    stiffness: 400, 
                                    damping: 10,
                                    duration: 0.3
                                  }}
                                  className="flex items-center"
                                >
                                  <ThumbsUp className={`mr-1 h-4 w-4 rotate-180 transition-colors duration-200 ${userVotes[meme.id] === -1 ? 'fill-current' : ''}`} />
                                </motion.div>
                              </Button>
                              <div className="px-2 bg-muted/50 text-sm font-medium">{meme.dislike_count}</div>
                            </div>
                            {/* Comment Button */}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCommentClick(meme.id)}
                              className={selectedMeme === meme.id ? "bg-muted" : ""}
                            >
                              <MessageSquare className="mr-1 h-4 w-4" />
                              <span>{meme.comment_count || 0}</span>
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin + `/meme/${meme.id}`);
                              toast({
                                title: "Link copied",
                                description: "Meme link copied to clipboard!",
                              });
                            }}
                          >
                            <Share2 className="mr-1 h-4 w-4" />
                            Share
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  {isLoading && <div className="text-center py-8">Loading more memes...</div>}
                  {!hasMore && <div className="text-center py-8 text-muted-foreground">No more memes to load.</div>}
                </div>
              )}
            </div>
            {/* Comment Sidebar */}
            {selectedMeme && (
              <div className="max-w-[400px] w-[40%] ml-4 sticky top-16 self-start mt-8">
                <CommentSidebar memeId={selectedMeme} onClose={() => setSelectedMeme(null)} />
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
