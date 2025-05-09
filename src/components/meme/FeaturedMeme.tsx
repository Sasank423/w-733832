import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVoteMutation, useUserVote } from '@/hooks/useMemes';
import { Meme } from '@/types/database';

interface FeaturedMemeProps {
  meme: Meme;
}

const FeaturedMeme = ({ meme }: FeaturedMemeProps) => {
  const { mutate: voteMutation } = useVoteMutation();
  const { data: userVote } = useUserVote(meme.id);
  
  const handleVote = () => {
    voteMutation({ memeId: meme.id, value: 1 });
  };
  
  // Check if creator exists before rendering
  if (!meme.creator) {
    return null;
  }
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-purple/10 to-brand-orange/10 p-1">
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {meme.is_meme_of_day ? 'Meme of the Day' : 'Weekly Champion'}
        </span>
      </div>
      
      <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={meme.creator.avatar} />
              <AvatarFallback className="bg-brand-purple text-white">
                {meme.creator.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium">
                {meme.creator.username}
              </span>
              <p className="text-xs text-muted-foreground">
                {new Date(meme.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="relative bg-gray-50 dark:bg-gray-800">
          <img 
            src={meme.image_url} 
            alt={meme.title}
            className="w-full h-[50vh] md:h-[70vh] object-contain mx-auto p-2"
            style={{ minHeight: '400px' }}
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold">{meme.title}</h3>
        </div>
          
        <div className="p-4 border-t flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{meme.vote_count} votes</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleVote}
              className={`h-8 w-8 ${userVote?.value === 1 ? "text-brand-purple" : ""}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={userVote?.value === 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
              <span className="sr-only">Upvote</span>
            </Button>
            
            <Button asChild size="sm">
              <Link to={`/meme/${meme.id}`}>View Meme</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMeme;
