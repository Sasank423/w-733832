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
import { supabase } from '@/integrations/supabase/client';

const CreatorDashboard = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [memes, setMemes] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("my-memes");
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setStatsLoading(true);
      // Fetch user's memes
      const fetchMemes = async () => {
        const { data, error } = await supabase
          .from('memes')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });
        if (!error) setMemes(data || []);
        setStatsLoading(false);
      };
      fetchMemes();
    }
  }, [isAuthenticated, user]);

  const handleDeleteMeme = async (memeId: string) => {
    // Delete meme from DB
    const { error } = await supabase.from('memes').delete().eq('id', memeId);
    if (!error) {
      setMemes(memes.filter(meme => meme.id !== memeId));
      toast({
        title: "Meme deleted",
        description: "Your meme has been successfully deleted.",
      });
    }
  };

  const handleEditMeme = (memeId: string) => {
    toast({
      title: "Edit caption",
      description: "Redirecting to edit page...",
    });
  };

  if (isLoading) return <Layout><div className="container-layout py-8">Loading...</div></Layout>;
  if (!isAuthenticated) return null;

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
                    memes.reduce((total, meme) => total + (meme.vote_count || 0), 0).toLocaleString()
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
                    memes.reduce((total, meme) => total + (meme.comment_count || 0), 0).toLocaleString()
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
                    memes.reduce((total, meme) => total + (meme.view_count || 0), 0).toLocaleString()
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
                    meme={{
                      id: meme.id,
                      title: meme.title,
                      imageUrl: meme.image_url,
                      createdAt: meme.created_at,
                      voteCount: meme.vote_count,
                      stats: {
                        views: meme.view_count,
                        comments: meme.comment_count,
                      },
                    }}
                    onDelete={handleDeleteMeme}
                    onEdit={handleEditMeme}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Drafts feature coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreatorDashboard;
