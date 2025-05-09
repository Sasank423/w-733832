import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import MemeCard from "@/components/meme/MemeCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Plus, Trophy, TrendingUp } from "lucide-react";
import FeaturedMeme from '@/components/meme/FeaturedMeme';
import TrendingMemes from '@/components/meme/TrendingMemes';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data for user dashboard
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
    },
    isMemeOfTheDay: true,
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
    },
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
    },
    isWeeklyChampion: true,
  },
];

const MOCK_USER_DRAFTS = [
  {
    id: "draft1",
    title: "Work in progress meme",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    lastEdited: "2023-05-10T14:20:00Z",
  },
  {
    id: "draft2",
    title: "Funny idea for later",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    lastEdited: "2023-05-09T08:45:00Z",
  },
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
  createdAt: '2023-05-08T12:00:00Z',
  isMemeOfTheDay: true,
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
  createdAt: '2023-05-06T09:15:00Z',
  isWeeklyChampion: true,
};

const UserDashboard = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState("newest");
  const [memes, setMemes] = useState(MOCK_USER_MEMES);
  const [drafts, setDrafts] = useState(MOCK_USER_DRAFTS);
  const [activeTab, setActiveTab] = useState("highlights");

  useEffect(() => {
    // In a real app, you'd fetch the user's memes based on the sort option
    if (sortOption === "popular") {
      setMemes([...MOCK_USER_MEMES].sort((a, b) => b.voteCount - a.voteCount));
    } else if (sortOption === "commented") {
      setMemes([...MOCK_USER_MEMES].sort((a, b) => (b.stats?.comments || 0) - (a.stats?.comments || 0)));
    } else {
      // default "newest"
      setMemes([...MOCK_USER_MEMES].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [sortOption]);

  const handleDeleteMeme = (memeId: string) => {
    // In a real app, this would call an API to delete the meme
    setMemes(memes.filter(meme => meme.id !== memeId));
    toast({
      title: "Meme deleted",
      description: "Your meme has been successfully deleted.",
    });
  };

  const handleDeleteDraft = (draftId: string) => {
    // In a real app, this would call an API to delete the draft
    setDrafts(drafts.filter(draft => draft.id !== draftId));
    toast({
      title: "Draft deleted",
      description: "Your draft has been successfully deleted.",
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // This should be handled by useProtectedRoute

  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Button asChild>
            <Link to="/create" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Meme</span>
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="my-memes">My Memes</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="highlights" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Meme of the Day section */}
              <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-100 dark:border-purple-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-bold text-brand-purple flex items-center gap-2">
                      <Trophy className="h-5 w-5" /> Meme of the Day
                    </span>
                  </div>
                  <FeaturedMeme meme={MOCK_MEME_OF_THE_DAY} />
                </CardContent>
              </Card>

              {/* Weekly Champion section */}
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
                        <Link to={`/meme/${MOCK_WEEKLY_CHAMPION.id}`}>
                          <img 
                            src={MOCK_WEEKLY_CHAMPION.imageUrl} 
                            alt={MOCK_WEEKLY_CHAMPION.title}
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </Link>
                      </div>
                      
                      <div className="md:w-1/3 w-full p-6 flex flex-col justify-between">
                        <div>
                          <Link to={`/meme/${MOCK_WEEKLY_CHAMPION.id}`}>
                            <h2 className="text-2xl font-bold mb-2 hover:text-amber-500 transition-colors">
                              {MOCK_WEEKLY_CHAMPION.title}
                            </h2>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {MOCK_WEEKLY_CHAMPION.description}
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-4">
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
                              <p className="text-xs text-gray-500">{MOCK_WEEKLY_CHAMPION.voteCount} votes</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <Button asChild variant="outline">
                              <Link to={`/meme/${MOCK_WEEKLY_CHAMPION.id}`}>View Meme</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trending section */}
            <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-100 dark:border-blue-900/30">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-xl font-bold text-blue-500 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Trending Memes
                  </span>
                </div>
                <TrendingMemes />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-memes" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
              <div>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="commented">Most Commented</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {memes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't created any memes yet.</p>
                <Button asChild className="mt-4">
                  <Link to="/create">Create Your First Meme</Link>
                </Button>
              </div>
            ) : (
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                {memes.map(meme => (
                  <div key={meme.id} className={viewMode === 'list' ? "border rounded-lg p-4" : ""}>
                    {viewMode === 'list' ? (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-24 h-24 relative rounded overflow-hidden">
                          <img src={meme.imageUrl} alt={meme.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{meme.title}</h3>
                          <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                            <span>{new Date(meme.createdAt).toLocaleDateString()}</span>
                            <span>{meme.voteCount} votes</span>
                            <span>{meme.stats?.views} views</span>
                            <span>{meme.stats?.comments} comments</span>
                          </div>
                          <div className="mt-2 space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/meme/${meme.id}/edit`}>Edit</Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteMeme(meme.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <MemeCard meme={meme} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            {drafts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any drafts.</p>
                <Button asChild className="mt-4">
                  <Link to="/create">Create a Meme</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drafts.map(draft => (
                  <div key={draft.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={draft.imageUrl} 
                        alt={draft.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                        <p className="text-white p-4 font-medium">{draft.title}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500">Last edited: {new Date(draft.lastEdited).toLocaleDateString()}</p>
                      <div className="mt-2 flex justify-between">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/create?draft=${draft.id}`}>Edit</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDraft(draft.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="border rounded-lg divide-y">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-4 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600">U{i}</span>
                    </div>
                    <div>
                      <p><strong>User{i}</strong> {i % 3 === 0 ? 'commented on' : 'upvoted'} your meme <Link to="/meme/1" className="text-brand-purple hover:underline">"{i % 2 === 0 ? 'Debugging at 2am' : 'When the code finally works'}"</Link></p>
                      <p className="text-sm text-gray-500">
                        {new Date(Date.now() - i * 3600000).toLocaleString()}
                      </p>
                      {i % 3 === 0 && (
                        <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm">This is hilarious! Been there too many times 😂</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboard;
