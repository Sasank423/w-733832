
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Heart, TrendingUp } from 'lucide-react';

// Mock data for trending memes
const MOCK_TRENDING_MEMES = {
  rising: [
    {
      id: 'meme7',
      title: 'When you finally fix that bug',
      imageUrl: 'https://images.unsplash.com/photo-1550439062-609e1531270e',
      voteCount: 324,
      commentCount: 42,
      creator: {
        id: 'user7',
        username: 'BugFixPro',
        avatar: ''
      },
      createdAt: '2023-05-05T18:20:00Z'
    },
    {
      id: 'meme8',
      title: 'Coffee first, code later',
      imageUrl: 'https://images.unsplash.com/photo-1517677129300-07b130802f46',
      voteCount: 187,
      commentCount: 18,
      creator: {
        id: 'user8',
        username: 'CaffeineOverload',
        avatar: ''
      },
      createdAt: '2023-05-05T16:15:00Z'
    },
    {
      id: 'meme9',
      title: 'My code in production',
      imageUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2',
      voteCount: 256,
      commentCount: 29,
      creator: {
        id: 'user9',
        username: 'ProdWarrior',
        avatar: ''
      },
      createdAt: '2023-05-05T12:10:00Z'
    }
  ],
  weekly: [
    {
      id: 'meme10',
      title: 'Ultimate debugging technique',
      imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713',
      voteCount: 986,
      commentCount: 104,
      creator: {
        id: 'user10',
        username: 'ConsoleLogMaster',
        avatar: ''
      },
      createdAt: '2023-05-03T12:20:00Z'
    },
    {
      id: 'meme11',
      title: 'Frontend vs Backend',
      imageUrl: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3',
      voteCount: 845,
      commentCount: 92,
      creator: {
        id: 'user11',
        username: 'FullStackWizard',
        avatar: ''
      },
      createdAt: '2023-05-02T10:15:00Z'
    },
    {
      id: 'meme12',
      title: 'When the client wants changes',
      imageUrl: 'https://images.unsplash.com/photo-1535551951406-a19828b0a76b',
      voteCount: 723,
      commentCount: 78,
      creator: {
        id: 'user12',
        username: 'ClientWhisperer',
        avatar: ''
      },
      createdAt: '2023-05-01T14:30:00Z'
    }
  ],
  allTime: [
    {
      id: 'meme13',
      title: 'Stack overflow saves the day',
      imageUrl: 'https://images.unsplash.com/photo-1526649661456-89c7ed4d00b8',
      voteCount: 5642,
      commentCount: 342,
      creator: {
        id: 'user13',
        username: 'SOLegend',
        avatar: ''
      },
      createdAt: '2023-02-15T10:00:00Z'
    },
    {
      id: 'meme14',
      title: 'When your code works on first try',
      imageUrl: 'https://images.unsplash.com/photo-1557599443-2071a2df9c19',
      voteCount: 4987,
      commentCount: 289,
      creator: {
        id: 'user14',
        username: 'FirstTryWizard',
        avatar: ''
      },
      createdAt: '2023-01-10T12:45:00Z'
    },
    {
      id: 'meme15',
      title: 'CSS expectations vs reality',
      imageUrl: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b',
      voteCount: 4521,
      commentCount: 317,
      creator: {
        id: 'user15',
        username: 'CSSStruggler',
        avatar: ''
      },
      createdAt: '2022-12-05T16:30:00Z'
    }
  ]
};

interface TrendingMemesProps {
  limit?: number;
}

const TrendingMemes = ({ limit = 3 }: TrendingMemesProps) => {
  const [activeTab, setActiveTab] = useState('rising');
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real application, we'd fetch data here with useEffect
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  const getMemesToRender = (category: string) => {
    const memes = MOCK_TRENDING_MEMES[category as keyof typeof MOCK_TRENDING_MEMES] || [];
    return limit ? memes.slice(0, limit) : memes;
  };

  return (
    <div className="trending-memes">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <span>Trending</span>
        </h2>
        <Link to="/trending" className="text-brand-purple hover:underline text-sm">
          View All
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="rising">Rising</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Best</TabsTrigger>
          <TabsTrigger value="allTime">All Time</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(limit)].map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200 animate-pulse"></div>
                <CardHeader className="p-3 pb-0">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                </CardHeader>
                <CardFooter className="p-3 pt-1 flex justify-between">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="rising">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMemesToRender('rising').map((meme, index) => (
                  <TrendingMemeCard key={meme.id} meme={meme} rank={index + 1} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMemesToRender('weekly').map((meme, index) => (
                  <TrendingMemeCard key={meme.id} meme={meme} rank={index + 1} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="allTime">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getMemesToRender('allTime').map((meme, index) => (
                  <TrendingMemeCard key={meme.id} meme={meme} rank={index + 1} />
                ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

interface TrendingMemeCardProps {
  meme: {
    id: string;
    title: string;
    imageUrl: string;
    voteCount: number;
    commentCount: number;
    creator: {
      id: string;
      username: string;
      avatar: string;
    };
    createdAt: string;
  };
  rank: number;
}

const TrendingMemeCard = ({ meme, rank }: TrendingMemeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <Link to={`/meme/${meme.id}`}>
          <img 
            src={meme.imageUrl} 
            alt={meme.title} 
            className="w-full h-40 object-cover"
          />
        </Link>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80">
            #{rank}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base">
          <Link to={`/meme/${meme.id}`} className="hover:text-brand-purple">
            {meme.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center text-xs space-x-1">
          <Avatar className="h-4 w-4 mr-1">
            <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${meme.creator.username}`} />
            <AvatarFallback className="text-[8px]">
              {meme.creator.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{meme.creator.username}</span>
          <span>•</span>
          <span>{new Date(meme.createdAt).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="p-3 pt-1 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center">
            <Heart className="h-3 w-3 mr-1" />
            <span className="text-xs">{meme.voteCount}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span className="text-xs">{meme.commentCount}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrendingMemes;
