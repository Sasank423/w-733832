import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ThumbsUp, 
  MessageSquare,
  Share2,
  Flag,
  ArrowLeft,
  Eye
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CommentSidebar from '@/components/meme/CommentSidebar';
import { useMeme, useVoteMutation, useUserVote } from '@/hooks/useMemes';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Meme } from '@/types/database';

const MemePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const { data: meme, isLoading, error } = useMeme(id);
  const { data: userVote } = useUserVote(id);
  const voteMutation = useVoteMutation();
  const [showComments, setShowComments] = useState(false);

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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  if (isLoading) {
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
            <CardHeader className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-48 bg-gray-100 dark:bg-gray-800 rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
            </CardContent>
            <CardFooter className="animate-pulse border-t">
              <div className="flex gap-4">
                <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
                <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  if (error || !meme) {
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
            <CardContent className="py-12">
              <div className="text-center text-red-500 space-y-4">
                <p className="text-xl font-semibold">Oops! Something went wrong</p>
                <p>{error?.toString() || 'Meme not found'}</p>
                <Button onClick={handleGoBack}>Go Back</Button>
              </div>
            </CardContent>
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

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Card className="overflow-hidden">
              {(meme.is_meme_of_day || meme.is_weekly_champion) && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-brand-purple text-white">
                    {meme.is_meme_of_day ? 'Meme of the Day' : 'Weekly Champion'}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={meme.creator?.avatar} />
                    <AvatarFallback className="bg-brand-purple text-white">
                      {meme.creator?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{meme.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Link to={`/user/${meme.creator_id}`} className="hover:underline font-medium">
                        {meme.creator?.username}
                      </Link>
                      <span className="mx-1">•</span>
                      <span>{formatDistanceToNow(new Date(meme.created_at))} ago</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="relative bg-gray-50 dark:bg-gray-900 flex justify-center">
                  <img 
                    src={meme.image_url} 
                    alt={meme.title}
                    className="max-h-[70vh] object-contain"
                  />
                </div>
                
                {meme.description && (
                  <div className="p-4">
                    <p className="text-muted-foreground">{meme.description}</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between p-4 border-t">
                <div className="flex gap-4 items-center">
                  {/* Like Button */}
                  <div className="flex items-center rounded-md overflow-hidden border border-input">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={!isAuthenticated} 
                      className={`px-2 rounded-none ${!isAuthenticated ? 'text-muted-foreground' : ''} ${userVote?.value === 1 ? 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''}`}
                      onClick={() => handleVote(1)}
                    >
                      <motion.div
                        whileTap={{ scale: 1.3 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex items-center"
                      >
                        <ThumbsUp className={`mr-1 h-4 w-4 ${userVote?.value === 1 ? 'fill-current' : ''}`} />
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
                      className={`px-2 rounded-none ${!isAuthenticated ? 'text-muted-foreground' : ''} ${userVote?.value === -1 ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}
                      onClick={() => handleVote(-1)}
                    >
                      <motion.div
                        whileTap={{ scale: 1.3 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="flex items-center"
                      >
                        <ThumbsUp className={`mr-1 h-4 w-4 rotate-180 ${userVote?.value === -1 ? 'fill-current' : ''}`} />
                      </motion.div>
                    </Button>
                    <div className="px-2 bg-muted/50 text-sm font-medium">{meme.dislike_count}</div>
                  </div>
                  
                  {/* Comment Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleComments}
                    className={showComments ? "bg-muted" : ""}
                  >
                    <MessageSquare className="mr-1 h-4 w-4" />
                    <span>{meme.comment_count || 0}</span>
                  </Button>
                  
                  {/* View Count */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{meme.view_count || 0} views</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-1 h-4 w-4" />
                    Share
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleReport}
                  >
                    <Flag className="mr-1 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Comments Section */}
          <div className="lg:w-1/3">
            {showComments && (
              <CommentSidebar memeId={id!} onClose={toggleComments} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemePage;
