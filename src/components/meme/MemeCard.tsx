
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Flag, MessageSquare, Share, Heart, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AnimatePresence, motion } from '@/components/ui/motion';

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
    isMemeOfTheDay?: boolean;
    isWeeklyChampion?: boolean;
    stats?: {
      views?: number;
      comments?: number;
    };
  };
  showBackButton?: boolean;
}

const MemeCard = ({ meme, showBackButton = false }: MemeCardProps) => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState(meme.voteCount);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [showSharePopover, setShowSharePopover] = useState(false);
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
      
      // Show success animation
      toast({
        title: "Vote recorded",
        description: "Your upvote has been counted!",
      });
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
      
      toast({
        title: "Vote recorded",
        description: "Your downvote has been counted!",
      });
    }
  };

  const handleShare = () => {
    setShowSharePopover(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://imagegenhub.com/meme/${meme.id}`);
    toast({
      title: "Link copied",
      description: "Meme link copied to clipboard!",
    });
    setShowSharePopover(false);
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const formattedDate = new Date(meme.createdAt).toLocaleDateString();

  return (
    <div className={`meme-card group relative ${meme.isFeatured ? 'border-2 border-brand-purple' : ''}`}>
      {showBackButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* Badge overlays */}
      {meme.isMemeOfTheDay && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Meme of the Day</Badge>
        </div>
      )}
      
      {meme.isWeeklyChampion && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-blue-500 hover:bg-blue-600">Weekly Champion</Badge>
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
          
          <div className="flex space-x-1">
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
            
            <Popover open={showSharePopover} onOpenChange={setShowSharePopover}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                <div className="space-y-2">
                  <h3 className="font-medium">Share this meme</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                      Copy Link
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reddit" viewBox="0 0 16 16">
                        <path d="M6.167 8a.831.831 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.232.232 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83.458 0 .83-.381.83-.83a.831.831 0 0 0-1.66 0"/>
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.203.203 0 0 0-.153.028.186.186 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224c-.02.115-.029.23-.029.353 0 1.795 2.091 3.256 4.669 3.256 2.577 0 4.668-1.451 4.668-3.256 0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
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
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${userVote === 'up' ? 'text-brand-purple' : ''}`}
                onClick={handleUpvote}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span className="sr-only">Upvote</span>
              </Button>
              
              <AnimatePresence initial={false}>
                <motion.span
                  key={votes}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="text-sm font-medium"
                >
                  {votes}
                </motion.span>
              </AnimatePresence>
              
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${userVote === 'down' ? 'text-brand-purple' : ''}`}
                onClick={handleDownvote}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                <span className="sr-only">Downvote</span>
              </Button>
            </div>
            
            <Link to={`/meme/${meme.id}`} className="flex items-center text-gray-500 hover:text-gray-700">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-xs">{meme.stats?.comments || 0}</span>
            </Link>
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
