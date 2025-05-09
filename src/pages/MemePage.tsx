import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageSquare,
  Share,
  Flag,
  ArrowLeft,
  MessageCircle,
  Share2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CommentSection from '@/components/meme/CommentSection';
import { useMeme, useVoteMutation, useUserVote } from '@/hooks/useMemes';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface Meme {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  image_url: string;
  view_count: number;
  vote_count: number;
  comment_count: number;
  created_at: string;
  creator?: {
    username: string;
    avatar_url: string;
  };
  is_meme_of_day?: boolean;
  is_weekly_champion?: boolean;
  updated_at?: string;
}

const MemePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: userVote } = useUserVote(id);
  const voteMutation = useVoteMutation();

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const { data, error } = await supabase
          .from('memes')
          .select(`
            *,
            creator:creator_id (
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        // Increment view count
        await supabase
          .from('memes')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id);

        // Type guard for creator
        let creator = undefined;
        if (data.creator && typeof data.creator === 'object' && 'username' in data.creator && 'avatar_url' in data.creator) {
          creator = {
            username: data.creator.username,
            avatar_url: data.creator.avatar_url,
          };
        }
        setMeme({
          id: data.id,
          creator_id: data.creator_id,
          title: data.title,
          description: data.description,
          image_url: data.image_url,
          view_count: data.view_count,
          vote_count: data.vote_count,
          comment_count: data.comment_count,
          created_at: data.created_at,
          updated_at: data.updated_at,
          is_meme_of_day: data.is_meme_of_day,
          is_weekly_champion: data.is_weekly_champion,
          creator,
        });
      } catch (err) {
        console.error('Error fetching meme:', err);
        setError('Failed to load meme');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMeme();
    }
  }, [id]);

  const handleVote = (value: 1 | -1) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote.",
        variant: "destructive",
      });
      return;
    }
    
    voteMutation.mutate({ memeId: id!, value });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Meme link copied to clipboard!",
    });
  };

  const handleReport = () => {
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe.",
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-layout py-8">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error || !meme) {
    return (
      <Layout>
        <div className="container-layout py-8">
          <div className="text-center text-red-500">{error || 'Meme not found'}</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={handleGoBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Meme Details</h1>
        </div>

        <Card className="overflow-hidden bg-card">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={meme.creator?.avatar_url} />
                <AvatarFallback>
                  {meme.creator?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{meme.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Posted by {meme.creator?.username} • {formatDistanceToNow(new Date(meme.created_at))} ago
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img 
                src={meme.image_url} 
                alt={meme.title}
                className="w-full rounded-lg"
              />
              {meme.description && (
                <p className="text-muted-foreground">{meme.description}</p>
              )}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-2 h-4 w-4" />
                  {meme.vote_count || 0}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {meme.comment_count || 0}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MemePage;
