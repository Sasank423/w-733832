
import { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import FeedFilters, { FeedType } from '@/components/meme/FeedFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CommentSidebar from '@/components/meme/CommentSidebar';

// Mock data - In a real app, this would come from an API
const MOCK_MEMES = [
  {
    id: 'meme2',
    title: 'Debugging at 2am',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    createdAt: '2023-05-07T10:30:00Z',
    voteCount: 453,
    creator: {
      id: 'user2',
      username: 'NightCoder',
    },
    stats: {
      views: 1872,
      comments: 42,
    }
  },
  {
    id: 'meme3',
    title: 'Monday mornings be like',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    createdAt: '2023-05-06T09:15:00Z',
    voteCount: 287,
    creator: {
      id: 'user3',
      username: 'CoffeeAddict',
    },
    isFeatured: true,
    isWeeklyChampion: true,
    stats: {
      views: 2453,
      comments: 57,
    }
  },
  {
    id: 'meme4',
    title: 'When you fix one bug and create ten more',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    createdAt: '2023-05-05T15:45:00Z',
    voteCount: 742,
    creator: {
      id: 'user4',
      username: 'BugHunter',
    },
    stats: {
      views: 3241,
      comments: 86,
    }
  },
  {
    id: 'meme5',
    title: 'The perfect code doesn\'t exi...',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    createdAt: '2023-05-04T18:20:00Z',
    voteCount: 521,
    creator: {
      id: 'user5',
      username: 'CleanCoder',
    },
    stats: {
      views: 1568,
      comments: 32,
    }
  },
];

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState<FeedType>('new');
  const [memes, setMemes] = useState(MOCK_MEMES);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const observer = useRef<IntersectionObserver | null>(null);
  const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
  
  // Function to fetch more memes (simulated)
  const fetchMoreMemes = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // In a real app, you'd append new memes from the API based on the page
      if (page < 4) {
        setMemes(prev => [...prev, ...MOCK_MEMES.slice(0, 2)]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    }, 1000);
  }, [isLoading, hasMore, page]);
  
  // Handle intersection observer for infinite scroll
  const lastMemeElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasMore) {
        fetchMoreMemes();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, fetchMoreMemes]);
  
  useEffect(() => {
    // Reset when filter changes
    setMemes(MOCK_MEMES);
    setPage(1);
    setHasMore(true);
  }, [activeFilter]);

  const handleFilterChange = (filter: FeedType) => {
    setActiveFilter(filter);
    // In a real app, you'd fetch new data based on the filter
  };
  
  const handleVote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to like memes.",
        variant: "destructive",
      });
    }
  };

  const handleCommentClick = (memeId: string) => {
    setSelectedMeme(selectedMeme === memeId ? null : memeId);
  };

  return (
    <Layout>
      <div className="container-layout py-8">
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
                      >
                        <CardHeader className="p-4 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 mr-1">
                                <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${meme.creator.username}`} />
                                <AvatarFallback>
                                  {meme.creator.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <Link to={`/user/${meme.creator.id}`} className="font-medium hover:underline">
                                  {meme.creator.username}
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(meme.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                          <Link to={`/meme/${meme.id}`}>
                            <div className="relative">
                              <img 
                                src={meme.imageUrl} 
                                alt={meme.title}
                                className="w-full max-h-[70vh] object-contain mx-auto"
                              />
                            </div>
                          </Link>
                          
                          <div className="p-4">
                            <h3 className="text-xl font-bold">{meme.title}</h3>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between p-4 border-t">
                          <div className="flex gap-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              disabled={!isAuthenticated} 
                              className={!isAuthenticated ? 'text-muted-foreground' : ''}
                              onClick={handleVote}
                            >
                              <ThumbsUp className="mr-1 h-4 w-4" />
                              <span>{meme.voteCount}</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCommentClick(meme.id)}
                              className={selectedMeme === meme.id ? "bg-muted" : ""}
                            >
                              <MessageSquare className="mr-1 h-4 w-4" />
                              <span>{meme.stats?.comments}</span>
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Share2 className="mr-1 h-4 w-4" />
                            Share
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  
                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  
                  {!hasMore && !isLoading && (
                    <div className="text-center py-8 text-muted-foreground">
                      You've reached the end of the feed
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {selectedMeme && (
              <div className="w-2/5 pl-4">
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
