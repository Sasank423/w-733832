import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, MessageSquare, Heart, ArrowLeft, Edit, Trash2, Clock } from "lucide-react";
import MemeStats from "@/components/dashboard/MemeStats";
import { supabase } from '@/integrations/supabase/client';
import { useDrafts } from '@/hooks/useDrafts';
import { formatDistanceToNow } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const CreatorDashboard = () => {
  useProtectedRoute();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { drafts, isLoading: isDraftsLoading, deleteDraft } = useDrafts();
  const [memes, setMemes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("my-memes");
  const [statsLoading, setStatsLoading] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

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
  
  const handleEditDraft = (draftId: string) => {
    navigate(`/create/draft/${draftId}`);
  };
  
  const handleDeleteDraftConfirm = async () => {
    if (draftToDelete) {
      const success = await deleteDraft(draftToDelete);
      if (success) {
        toast({
          title: "Draft deleted",
          description: "Your draft has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete draft. Please try again.",
          variant: "destructive",
        });
      }
      setDraftToDelete(null);
    }
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Drafts</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/create">New Meme</Link>
              </Button>
            </div>
            
            {isDraftsLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading drafts...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't saved any drafts yet.</p>
                <Button asChild className="mt-4">
                  <Link to="/create">Create a Meme</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.map(draft => (
                  <Card key={draft.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col h-full">
                        <div className="mb-2">
                          <h3 className="font-medium truncate">{draft.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>Last saved {formatDistanceToNow(draft.lastSaved)} ago</span>
                          </div>
                        </div>
                        
                        {draft.imageUrls && draft.imageUrls.length > 0 && (
                          <div className="relative h-32 bg-muted/30 rounded-md overflow-hidden my-2">
                            <img 
                              src={draft.imageUrls[0]} 
                              alt={draft.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground mb-4">
                          {draft.textCaptions.length} caption{draft.textCaptions.length !== 1 ? 's' : ''} • 
                          {draft.imageUrls?.length || 0} image{(draft.imageUrls?.length || 0) !== 1 ? 's' : ''}
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditDraft(draft.id)}
                          >
                            <Edit className="mr-1 h-4 w-4" /> Edit
                          </Button>
                          
                          <AlertDialog open={draftToDelete === draft.id} onOpenChange={(open) => !open && setDraftToDelete(null)}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={() => setDraftToDelete(draft.id)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this draft. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteDraftConfirm} className="bg-red-500 hover:bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
