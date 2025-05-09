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
import { Meme, MockMemeFormat } from "@/types/database";
import { supabase } from '@/integrations/supabase/client';

const UserDashboard = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState("newest");
  const [memes, setMemes] = useState<any[]>([]);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("highlights");
  const [memeOfTheDay, setMemeOfTheDay] = useState<any | null>(null);
  const [weeklyChampion, setWeeklyChampion] = useState<any | null>(null);

  useEffect(() => {
    if (!user) return;
    // Fetch user's memes
    const fetchMemes = async () => {
      let query = supabase
        .from('memes')
        .select('*')
        .eq('creator_id', user.id);
      if (sortOption === 'popular') {
        query = query.order('vote_count', { ascending: false });
      } else if (sortOption === 'commented') {
        query = query.order('comment_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      const { data, error } = await query;
      if (!error) setMemes(data || []);
    };
    fetchMemes();
  }, [user, sortOption]);

  useEffect(() => {
    // Fetch meme of the day
    const fetchMemeOfTheDay = async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .eq('is_meme_of_day', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (!error) setMemeOfTheDay(data);
    };
    // Fetch weekly champion
    const fetchWeeklyChampion = async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .eq('is_weekly_champion', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (!error) setWeeklyChampion(data);
    };
    fetchMemeOfTheDay();
    fetchWeeklyChampion();
  }, []);

  // Drafts fetching would be implemented here if you have a drafts table

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

  // ... handleDeleteDraft would be similar if drafts are implemented ...

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/creator" className="flex items-center space-x-2">
                <span>Creator Dashboard</span>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/create" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Meme</span>
              </Link>
            </Button>
          </div>
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
                  {memeOfTheDay ? <FeaturedMeme meme={memeOfTheDay} /> : <div>No meme of the day.</div>}
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
                  {weeklyChampion ? (
                    <div className="relative overflow-hidden rounded-xl">
                      <div className="absolute top-4 right-4 z-10">
                        <Badge variant="secondary" className="bg-amber-500 text-white border-none">Weekly Champion</Badge>
                      </div>
                      <div className="flex flex-col md:flex-row rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                        <div className="relative md:w-2/3 w-full">
                          <Link to={`/meme/${weeklyChampion.id}`}>
                            <img 
                              src={weeklyChampion.image_url} 
                              alt={weeklyChampion.title}
                              className="w-full h-64 md:h-full object-cover"
                            />
                          </Link>
                        </div>
                        <div className="p-4 flex flex-col justify-center md:w-1/3">
                          <h3 className="text-lg font-bold mb-2">{weeklyChampion.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{weeklyChampion.description}</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={weeklyChampion.creator?.avatar} />
                              <AvatarFallback>{weeklyChampion.creator?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{weeklyChampion.creator?.username}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : <div>No weekly champion.</div>}
                </CardContent>
              </Card>
            </div>
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
                  <MemeCard key={meme.id} meme={meme} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Drafts</h2>
            </div>
            {/* Drafts logic here if implemented */}
            <div className="text-center py-12">
              <p className="text-gray-500">Drafts feature coming soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Activity feed coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboard;
