
import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageSquare,
  Share,
  Flag,
  ArrowLeft
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CommentSection from '@/components/meme/CommentSection';
import { useMeme, useVoteMutation, useUserVote } from '@/hooks/useMemes';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const MemePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { data: meme, isLoading, error } = useMeme(id);
  const { data: userVote } = useUserVote(id);
  const voteMutation = useVoteMutation();

  useEffect(() => {
    if (id) {
      // Update view count
      supabase.functions.invoke('increment_view_count', {
        body: { memeId: id },
      });
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

  if (error) {
    return (
      <Layout>
        <div className="container-layout py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Meme not found</h2>
            <p className="mt-2 text-muted-foreground">The meme you're looking for might have been removed or doesn't exist.</p>
            <Button className="mt-4" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading || !meme) {
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

          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3">
                <Skeleton className="w-full h-[60vh]" />
              </div>
              
              <div className="md:w-1/3 p-6">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                
                <div className="flex items-center mb-6 mt-4">
                  <Skeleton className="h-8 w-8 rounded-full mr-2" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
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
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 relative">
              {meme.is_weekly_champion && (
                <Badge className="absolute top-4 right-4 bg-amber-500">Weekly Champion</Badge>
              )}
              {meme.is_meme_of_day && (
                <Badge className="absolute top-4 right-4 bg-brand-purple">Meme of the Day</Badge>
              )}
              <img 
                src={meme.image_url} 
                alt={meme.title}
                className="w-full h-auto max-h-[80vh] object-contain bg-black"
              />
            </div>
            
            <div className="md:w-1/3 p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-2">{meme.title}</h2>
              
              {meme.description && (
                <p className="text-muted-foreground mb-4">{meme.description}</p>
              )}
              
              <div className="flex items-center mb-6">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={meme.creator?.avatar} />
                  <AvatarFallback>{meme.creator?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/profile/${meme.creator?.id}`} className="font-medium hover:underline">
                    {meme.creator?.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {new Date(meme.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {meme.tags?.map((tagObj: any) => (
                  <Link key={tagObj.tag_id} to={`/browse?tag=${tagObj.tags?.name}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                      #{tagObj.tags?.name}
                    </Badge>
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(1)}
                      className={userVote?.value === 1 ? 'text-brand-purple' : ''}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote?.value === 1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </Button>
                    
                    <span className="mx-1 font-medium">{meme.vote_count}</span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(-1)}
                      className={userVote?.value === -1 ? 'text-brand-purple' : ''}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote?.value === -1 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-1" /> Share
                  </Button>
                  
                  {isAuthenticated && (
                    <Button variant="outline" size="sm" onClick={handleReport}>
                      <Flag className="h-4 w-4 mr-1" /> Report
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground mt-auto pt-4 border-t">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" /> {meme.vote_count} votes
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> {meme.comment_count} comments
                </span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="mt-8 max-w-3xl">
          <CommentSection memeId={id || ''} />
        </div>
      </div>
    </Layout>
  );
};

export default MemePage;
