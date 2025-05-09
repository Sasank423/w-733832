import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface MemeOfTheDayProps {
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

const MemeOfTheDay = ({ meme }: MemeOfTheDayProps) => {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-100 dark:border-purple-900/30">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-xl font-bold text-brand-purple flex items-center gap-2">
            <Trophy className="h-5 w-5" /> Meme of the Day
          </span>
        </div>
        
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="secondary" className="bg-brand-purple text-white border-none">Today's Best</Badge>
          </div>
          
          <div className="flex flex-col md:flex-row rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div className="relative md:w-2/3 w-full">
              <img 
                src={meme.imageUrl} 
                alt={meme.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            <div className="md:w-1/3 w-full p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 hover:text-brand-purple transition-colors">
                  {meme.title}
                </h2>
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
                    <AvatarFallback className="bg-brand-purple text-white">
                      {meme.creator.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium">
                      {meme.creator.username}
                    </span>
                    <p className="text-xs text-gray-500">{meme.voteCount} votes</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" disabled>View Meme</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemeOfTheDay;
