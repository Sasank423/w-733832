
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';
import { useTrendingMemes } from '@/hooks/useMemes';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TrendingMemesProps {
  limit?: number;
}

const TrendingMemes = ({ limit = 3 }: TrendingMemesProps) => {
  const [activeTab, setActiveTab] = useState<'rising' | 'weekly' | 'allTime'>('rising');
  const [localMemes, setLocalMemes] = useState<any[]>([]);
  const { data: memes, isLoading } = useTrendingMemes(activeTab, limit);
  const queryClient = useQueryClient();
  
  // Keep local state in sync with the query data
  useEffect(() => {
    if (memes) {
      setLocalMemes(memes);
    }
  }, [memes]);
  
  // Set up real-time subscription for vote updates
  useEffect(() => {
    // Subscribe to changes on the votes table
    const subscription = supabase
      .channel('votes-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'votes' 
      }, (payload) => {
        // When a vote changes, refetch the trending memes
        queryClient.invalidateQueries({ queryKey: ['trending-memes'] });
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  return (
    <div className="trending-memes">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending</span>
        </h2>
        <Link to="/trending" className="text-brand-purple hover:underline text-sm">
          View All
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'rising' | 'weekly' | 'allTime')} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rising">Rising</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Best</TabsTrigger>
          <TabsTrigger value="allTime">All Time</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(limit)].map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200 animate-pulse"></div>
                <CardHeader className="p-3 pb-0">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                </CardHeader>
                <CardFooter className="p-3 pt-1 flex justify-between">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="rising" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {memes?.map((meme, index) => (
                  <TrendingMemeCard key={meme.id} meme={meme} rank={index + 1} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {memes?.map((meme, index) => (
                  <TrendingMemeCard key={meme.id} meme={meme} rank={index + 1} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="allTime" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {memes?.map((meme, index) => (
                  <TrendingMemeCard key={meme.id} meme={meme} rank={index + 1} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

interface TrendingMemeCardProps {
  meme: any;
  rank: number;
}

const TrendingMemeCard = ({ meme, rank }: TrendingMemeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <Link to={`/meme/${meme.id}`}>
          <img 
            src={meme.image_url} 
            alt={meme.title} 
            className="w-full h-40 object-cover"
          />
        </Link>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
            #{rank}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">
          <Link to={`/meme/${meme.id}`} className="hover:text-brand-purple">
            {meme.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center text-xs space-x-1">
          <Avatar className="h-4 w-4 mr-1">
            <AvatarImage src={meme.creator.avatar} />
            <AvatarFallback className="text-[8px]">
              {meme.creator.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{meme.creator.username}</span>
          <span>•</span>
          <span>{new Date(meme.created_at).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-3 pt-1 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm">
          {/* Likes */}
          <div className="flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1 text-blue-500" />
            <span className="text-xs">{meme.vote_count}</span>
          </div>
          {/* Dislikes */}
          <div className="flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1 rotate-180 text-red-500" />
            <span className="text-xs">{meme.dislike_count}</span>
          </div>
          {/* Comments */}
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span className="text-xs">{meme.comment_count}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrendingMemes;
