
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Link } from "react-router-dom";
import { Plus, Eye, MessageSquare, Heart } from "lucide-react";
import TrendingMemes from "@/components/meme/TrendingMemes";
import MemeStats from "@/components/dashboard/MemeStats";
import MemeOfTheDay from "@/components/dashboard/MemeOfTheDay";
import WeeklyChampion from "@/components/dashboard/WeeklyChampion";

// Mock data for user memes and stats
const MOCK_USER_MEMES = [
  {
    id: "meme1",
    title: "When the code finally works",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    createdAt: "2023-05-08T12:00:00Z",
    voteCount: 1562,
    creator: {
      id: "user1",
      username: "CodeMaster",
    },
    stats: {
      views: 4872,
      comments: 124,
    }
  },
  {
    id: "meme2",
    title: "Debugging at 2am",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    createdAt: "2023-05-07T10:30:00Z",
    voteCount: 453,
    creator: {
      id: "user2",
      username: "NightCoder",
    },
    stats: {
      views: 1872,
      comments: 42,
    }
  },
  {
    id: "meme3",
    title: "Monday mornings be like",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    createdAt: "2023-05-06T09:15:00Z",
    voteCount: 287,
    creator: {
      id: "user3",
      username: "CoffeeAddict",
    },
    stats: {
      views: 972,
      comments: 28,
    }
  }
];

// Mock data for meme of the day
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
  createdAt: '2023-05-06T09:15:00Z'
};

const CreatorDashboard = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [memes, setMemes] = useState(MOCK_USER_MEMES);
  const [activeTab, setActiveTab] = useState("overview");
  const [statsLoading, setStatsLoading] = useState(false);

  // In a real app, you'd fetch the user's memes and stats
  useEffect(() => {
    if (isAuthenticated) {
      setStatsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setStatsLoading(false);
      }, 800);
    }
  }, [isAuthenticated]);

  const handleDeleteMeme = (memeId: string) => {
    // In a real app, this would call an API to delete the meme
    setMemes(memes.filter(meme => meme.id !== memeId));
    toast({
      title: "Meme deleted",
      description: "Your meme has been successfully deleted.",
    });
  };

  const handleEditMeme = (memeId: string) => {
    // In a real app, this would navigate to the edit page
    toast({
      title: "Edit caption",
      description: "Redirecting to edit page...",
    });
  };

  if (isLoading) return <Layout><div className="container-layout py-8">Loading...</div></Layout>;
  if (!isAuthenticated) return null; // This should be handled by useProtectedRoute

  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <Button asChild>
            <Link to="/create" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Meme</span>
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-memes">My Memes</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-brand-purple/10 p-4 mb-4">
                      <Heart className="h-8 w-8 text-brand-purple" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        memes.reduce((total, meme) => total + meme.voteCount, 0).toLocaleString()
                      )}
                    </h3>
                    <p className="text-gray-500">Total Votes</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-amber-500/10 p-4 mb-4">
                      <MessageSquare className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        memes.reduce((total, meme) => total + (meme.stats?.comments || 0), 0).toLocaleString()
                      )}
                    </h3>
                    <p className="text-gray-500">Total Comments</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                      <Eye className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        memes.reduce((total, meme) => total + (meme.stats?.views || 0), 0).toLocaleString()
                      )}
                    </h3>
                    <p className="text-gray-500">Total Views</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Memes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MemeOfTheDay meme={MOCK_MEME_OF_THE_DAY} />
              <WeeklyChampion meme={MOCK_WEEKLY_CHAMPION} />
            </div>

            {/* Trending Section */}
            <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-100 dark:border-blue-900/30">
              <CardContent className="p-6">
                <TrendingMemes limit={3} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-memes" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Memes</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/create">New Meme</Link>
              </Button>
            </div>
            
            {memes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't created any memes yet.</p>
                <Button asChild className="mt-4">
                  <Link to="/create">Create Your First Meme</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {memes.map(meme => (
                  <MemeStats 
                    key={meme.id} 
                    meme={meme} 
                    onDelete={handleDeleteMeme}
                    onEdit={handleEditMeme}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <TrendingMemes limit={6} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreatorDashboard;
