
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Link } from "react-router-dom";
import { Plus, Eye, MessageSquare, Heart, ArrowLeft } from "lucide-react";
import MemeStats from "@/components/dashboard/MemeStats";

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

// Mock data for drafts
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

const CreatorDashboard = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [memes, setMemes] = useState(MOCK_USER_MEMES);
  const [drafts, setDrafts] = useState(MOCK_USER_DRAFTS);
  const [activeTab, setActiveTab] = useState("my-memes");
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

  const handleDeleteDraft = (draftId: string) => {
    // In a real app, this would call an API to delete the draft
    setDrafts(drafts.filter(draft => draft.id !== draftId));
    toast({
      title: "Draft deleted",
      description: "Your draft has been successfully deleted.",
    });
  };

  if (isLoading) return <Layout><div className="container-layout py-8">Loading...</div></Layout>;
  if (!isAuthenticated) return null; // This should be handled by useProtectedRoute

  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button asChild variant="ghost" size="icon" className="mr-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          </div>
          <Button asChild>
            <Link to="/create" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Meme</span>
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-memes">My Memes</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreatorDashboard;
