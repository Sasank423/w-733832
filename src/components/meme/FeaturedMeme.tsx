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
      <div className="absolute top-4 right-4 z-10">
        <span className="badge badge-primary">
          {meme.is_meme_of_day ? 'Meme of the Day' : 'Weekly Champion'}
        </span>
      </div>
      
      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <div className="relative md:w-2/3 w-full">
          <img 
            src={meme.image_url} 
            alt={meme.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        
        <div className="md:w-1/3 w-full p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 hover:text-brand-purple transition-colors">
              {meme.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {meme.description}
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={meme.creator.avatar} />
                <AvatarFallback className="bg-brand-purple text-white">
                  {meme.creator.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span className="text-sm font-medium">
                  {meme.creator.username}
                </span>
                <p className="text-xs text-gray-500">{meme.vote_count} votes</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button asChild>
                <Link to={`/meme/${meme.id}`}>View Meme</Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleVote}
                className={userVote?.value === 1 ? "text-brand-purple" : ""}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={userVote?.value === 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <span className="sr-only">Upvote</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMeme;
