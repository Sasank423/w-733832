
import { useEffect, useState } from 'react';
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

// Mock data for testing purposes
const MOCK_MEME = {
  id: 'meme1',
  title: 'When the code finally works',
  description: 'That feeling when your code compiles without errors on the first try',
  imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  createdAt: '2023-05-15T12:00:00Z',
  updatedAt: '2023-05-15T12:00:00Z',
  creator: {
    id: 'user1',
    username: 'CodeMaster',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=CodeMaster',
  },
  tags: ['coding', 'programming', 'funny'],
  stats: {
    views: 1250,
    comments: 32,
    shares: 48
  },
  voteCount: 537,
  isWeeklyChampion: true
};

const MemePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [meme, setMeme] = useState(MOCK_MEME);
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [votes, setVotes] = useState(MOCK_MEME.voteCount);

  useEffect(() => {
    // In a real app, fetch the meme data using the ID
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would actually set the meme from API data
    }, 500);
    
    // Update view count
    // In a real app, you'd make an API call to increment the view count
  }, [id]);

  const handleVote = (type: 'up' | 'down') => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote.",
        variant: "destructive",
      });
      return;
    }
    
    if (type === userVote) {
      // User is removing their vote
      setVotes(type === 'up' ? votes - 1 : votes + 1);
      setUserVote(null);
    } else {
      // User is changing vote or adding new vote
      if (userVote === null) {
        // Adding a new vote
        setVotes(type === 'up' ? votes + 1 : votes - 1);
      } else {
        // Changing from up to down or vice versa (counts double)
        setVotes(type === 'up' ? votes + 2 : votes - 2);
      }
      setUserVote(type);
    }
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

  if (isLoading) {
    return (
      <Layout>
        <div className="container-layout py-8 flex justify-center">
          <div className="h-12 w-12 border-4 border-t-brand-purple rounded-full animate-spin"></div>
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
              {meme.isWeeklyChampion && (
                <Badge className="absolute top-4 right-4 bg-amber-500">Weekly Champion</Badge>
              )}
              <img 
                src={meme.imageUrl} 
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
                  <AvatarImage src={meme.creator.avatar} />
                  <AvatarFallback>{meme.creator.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/profile/${meme.creator.id}`} className="font-medium hover:underline">
                    {meme.creator.username}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {new Date(meme.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {meme.tags.map((tag) => (
                  <Link key={tag} to={`/browse?tag=${tag}`}>
                    <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                      #{tag}
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
                      onClick={() => handleVote('up')}
                      className={userVote === 'up' ? 'text-brand-purple' : ''}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    </Button>
                    
                    <span className="mx-1 font-medium">{votes}</span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('down')}
                      className={userVote === 'down' ? 'text-brand-purple' : ''}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <Heart className="h-4 w-4 mr-1" /> {meme.voteCount} votes
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> {meme.stats.comments} comments
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
