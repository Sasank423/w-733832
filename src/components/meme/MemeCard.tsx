
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Flag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MemeCardProps {
  meme: {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: string;
    voteCount: number;
    creator: {
      id: string;
      username: string;
      avatar?: string;
    };
    isFeatured?: boolean;
  };
}

const MemeCard = ({ meme }: MemeCardProps) => {
  const [votes, setVotes] = useState(meme.voteCount);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleUpvote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote.",
        variant: "destructive",
      });
      return;
    }

    if (userVote === 'up') {
      setVotes(votes - 1);
      setUserVote(null);
    } else {
      setVotes(userVote === 'down' ? votes + 2 : votes + 1);
      setUserVote('up');
    }
  };

  const handleDownvote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to vote.",
        variant: "destructive",
      });
      return;
    }

    if (userVote === 'down') {
      setVotes(votes + 1);
      setUserVote(null);
    } else {
      setVotes(userVote === 'up' ? votes - 2 : votes - 1);
      setUserVote('down');
    }
  };

  const handleFlag = () => {
    setShowFlagDialog(true);
  };

  const submitFlag = () => {
    setShowFlagDialog(false);
    toast({
      title: "Thank you",
      description: "This meme has been flagged for review.",
    });
  };

  const formattedDate = new Date(meme.createdAt).toLocaleDateString();

  return (
    <div className={`meme-card group ${meme.isFeatured ? 'border-2 border-brand-purple' : ''}`}>
      {meme.isFeatured && (
        <div className="absolute top-2 right-2 z-10">
          <span className="badge badge-primary">Featured</span>
        </div>
      )}
      
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/meme/${meme.id}`}>
          <img 
            src={meme.imageUrl} 
            alt={meme.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
            <p className="text-white p-4 font-medium text-lg">{meme.title}</p>
          </div>
        </Link>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/meme/${meme.id}`} className="meme-title hover:text-brand-purple-dark">{meme.title}</Link>
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleFlag}
            >
              <Flag className="h-4 w-4" />
              <span className="sr-only">Flag</span>
            </Button>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={meme.creator.avatar} />
              <AvatarFallback className="bg-brand-purple text-white text-xs">
                {meme.creator.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {meme.creator.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              • {formattedDate}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${userVote === 'up' ? 'text-brand-purple' : ''}`}
              onClick={handleUpvote}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span className="sr-only">Upvote</span>
            </Button>
            
            <span className="text-sm font-medium">{votes}</span>
            
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 ${userVote === 'down' ? 'text-brand-purple' : ''}`}
              onClick={handleDownvote}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
              <span className="sr-only">Downvote</span>
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Report inappropriate content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to flag this meme as inappropriate? Our moderators will review this content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitFlag}>Report</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemeCard;
