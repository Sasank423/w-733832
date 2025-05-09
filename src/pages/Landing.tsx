
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award, TrendingUp, MessageSquare, Heart } from 'lucide-react';
import TrendingMemes from '@/components/meme/TrendingMemes';

// Mock data for featured meme
const MOCK_MEME_OF_THE_DAY = {
  id: 'meme1',
  title: 'When the code finally works',
  imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  description: 'That feeling when your code compiles without errors on the first try. A miracle indeed!',
  creator: {
    id: 'user1',
    username: 'CodeMaster',
  },
  voteCount: 1562,
  commentCount: 78,
  createdAt: '2023-05-08T12:00:00Z'
};

// Mock data for weekly champion
const MOCK_WEEKLY_CHAMPION = {
  id: 'meme3',
  title: 'Monday mornings be like',
  imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
  description: 'That moment when your alarm goes off and reality hits. Monday mornings are truly something else.',
  creator: {
    id: 'user3',
    username: 'CoffeeAddict',
  },
  voteCount: 987,
  commentCount: 45,
  createdAt: '2023-05-06T09:15:00Z'
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-purple/10 to-indigo-500/10 dark:from-brand-purple/5 dark:to-indigo-900/10">
        <div className="container-layout py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-indigo-500">
            Discover and Create Amazing Memes
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-600 dark:text-gray-300">
            The ultimate platform for meme lovers to create, share, and discover the funniest content on the web.
          </p>
          
          <div className="flex gap-4 flex-wrap justify-center">
            <Button size="lg" asChild>
              <Link to="/create">Create a Meme</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/browse">Browse Memes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="container-layout py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Today's Highlights</h2>

        {/* Daily and Weekly champions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Meme of the Day Section */}
          <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-100 dark:border-purple-900/30">
            <CardHeader className="pb-0">
              <div className="flex items-center mb-2">
                <Award className="h-6 w-6 text-brand-purple mr-2" />
                <CardTitle className="text-2xl text-brand-purple">Meme of the Day</CardTitle>
              </div>
              <CardDescription>The most popular meme in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md">
                <Link to={`/meme/${MOCK_MEME_OF_THE_DAY.id}`}>
                  <div className="relative">
                    <img 
                      src={MOCK_MEME_OF_THE_DAY.imageUrl} 
                      alt={MOCK_MEME_OF_THE_DAY.title} 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-brand-purple">Today's Best</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 hover:text-brand-purple transition-colors">
                      {MOCK_MEME_OF_THE_DAY.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {MOCK_MEME_OF_THE_DAY.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${MOCK_MEME_OF_THE_DAY.creator.username}`} />
                          <AvatarFallback className="bg-brand-purple text-white">
                            {MOCK_MEME_OF_THE_DAY.creator.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/user/${MOCK_MEME_OF_THE_DAY.creator.id}`} className="text-sm font-medium hover:text-brand-purple">
                            {MOCK_MEME_OF_THE_DAY.creator.username}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-brand-purple" />
                          <span>{MOCK_MEME_OF_THE_DAY.voteCount}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{MOCK_MEME_OF_THE_DAY.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/meme/${MOCK_MEME_OF_THE_DAY.id}`}>View Meme</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Weekly Champion Section */}
          <Card className="overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-100 dark:border-amber-900/30">
            <CardHeader className="pb-0">
              <div className="flex items-center mb-2">
                <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                <CardTitle className="text-2xl text-amber-500">Weekly Champion</CardTitle>
              </div>
              <CardDescription>The most popular meme of the week</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md">
                <Link to={`/meme/${MOCK_WEEKLY_CHAMPION.id}`}>
                  <div className="relative">
                    <img 
                      src={MOCK_WEEKLY_CHAMPION.imageUrl} 
                      alt={MOCK_WEEKLY_CHAMPION.title} 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-500">Weekly Champion</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 hover:text-amber-500 transition-colors">
                      {MOCK_WEEKLY_CHAMPION.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {MOCK_WEEKLY_CHAMPION.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${MOCK_WEEKLY_CHAMPION.creator.username}`} />
                          <AvatarFallback className="bg-amber-500 text-white">
                            {MOCK_WEEKLY_CHAMPION.creator.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/user/${MOCK_WEEKLY_CHAMPION.creator.id}`} className="text-sm font-medium hover:text-amber-500">
                            {MOCK_WEEKLY_CHAMPION.creator.username}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-amber-500" />
                          <span>{MOCK_WEEKLY_CHAMPION.voteCount}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{MOCK_WEEKLY_CHAMPION.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/meme/${MOCK_WEEKLY_CHAMPION.id}`}>View Meme</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Trending Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Now</span>
              </h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/browse">View All</Link>
              </Button>
            </div>
            <TrendingMemes limit={3} />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8 bg-gradient-to-br from-brand-purple/10 to-indigo-500/10 dark:from-brand-purple/5 dark:to-indigo-900/10 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Meme?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Join our community and start creating and sharing your own memes today!
          </p>
          <Button size="lg" asChild>
            <Link to="/create">Get Started</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
