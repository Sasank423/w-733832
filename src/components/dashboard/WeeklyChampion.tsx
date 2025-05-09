
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface WeeklyChampionProps {
  meme: {
    id: string;
    title: string;
    imageUrl: string;
    description?: string;
    creator: {
      id: string;
      username: string;
    };
    voteCount: number;
    createdAt: string;
  };
}

const WeeklyChampion = ({ meme }: WeeklyChampionProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/30">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-xl font-bold text-amber-500 flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Weekly Champion
          </span>
        </div>
        
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-amber-500 text-white border-none">Weekly Champion</Badge>
          </div>
          
          <div className="flex flex-col md:flex-row rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="relative md:w-2/3 w-full">
              <Link to={`/meme/${meme.id}`}>
                <img 
                  src={meme.imageUrl} 
                  alt={meme.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </Link>
            </div>
            
            <div className="md:w-1/3 w-full p-6 flex flex-col justify-between">
              <div>
                <Link to={`/meme/${meme.id}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-amber-500 transition-colors">
                    {meme.title}
                  </h2>
                </Link>
                {meme.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {meme.description}
                  </p>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${meme.creator.username}`} />
                    <AvatarFallback className="bg-amber-500 text-white">
                      {meme.creator.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link to={`/user/${meme.creator.id}`} className="text-sm font-medium hover:text-amber-500">
                      {meme.creator.username}
                    </Link>
                    <p className="text-xs text-gray-500">{meme.voteCount} votes</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button asChild variant="outline">
                    <Link to={`/meme/${meme.id}`}>View Meme</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyChampion;
