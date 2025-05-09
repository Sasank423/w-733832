import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, MessageSquare, Heart, Eye } from "lucide-react";
import MemeCard from "@/components/meme/MemeCard";
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("memes");
  const [profile, setProfile] = useState<any>(null);
  const [memes, setMemes] = useState<any[]>([]);
  const [likedMemes, setLikedMemes] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch profile from Supabase
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (!error) setProfile(data);
      };
      
      // Fetch user's memes
      const fetchMemes = async () => {
        const { data, error } = await supabase
          .from('memes')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });
        if (!error) setMemes(data || []);
      };
      
      // Fetch user's liked memes
      const fetchLikedMemes = async () => {
        // First get all the meme IDs that the user has upvoted
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('meme_id')
          .eq('user_id', user.id)
          .eq('value', 1); // value = 1 means upvote/like
        
        if (votesError) {
          console.error('Error fetching votes:', votesError);
          return;
        }
        
        if (votesData && votesData.length > 0) {
          // Extract meme IDs from votes
          const memeIds = votesData.map(vote => vote.meme_id);
          
          // Fetch the actual memes using those IDs
          const { data: memesData, error: memesError } = await supabase
            .from('memes')
            .select(`
              *,
              creator:profiles(id, username, avatar)
            `)
            .in('id', memeIds)
            .order('created_at', { ascending: false });
          
          if (!memesError) {
            setLikedMemes(memesData || []);
          } else {
            console.error('Error fetching liked memes:', memesError);
          }
        } else {
          setLikedMemes([]);
        }
      };
      
      Promise.all([fetchProfile(), fetchMemes(), fetchLikedMemes()]).then(() => setIsLoaded(true));
    }
  }, [isAuthenticated, user]);

  if (isLoading || !isLoaded) return <Layout><div className="container-layout py-8">Loading...</div></Layout>;
  if (!isAuthenticated || !profile) return null;

  return (
    <Layout>
      <div className="container-layout py-8">
        <div className="flex items-center mb-6">
          <Button asChild variant="ghost" size="icon" className="mr-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="bg-brand-purple text-white text-xl">
                      {profile.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{profile.username}</CardTitle>
                <CardDescription className="flex items-center justify-center text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
                </CardDescription>
                {/* Badges and stats can be implemented if you have them in your DB */}
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-6">{profile.bio}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/settings" className="flex items-center justify-center">
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="memes">My Memes</TabsTrigger>
                <TabsTrigger value="liked">Liked Memes</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="memes">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memes.length > 0 ? (
                    memes.map(meme => (
                      <MemeCard key={meme.id} meme={{
                        id: meme.id,
                        title: meme.title || 'Untitled Meme',
                        imageUrl: meme.image_url,
                        createdAt: meme.created_at,
                        voteCount: meme.vote_count || 0,
                        creator: {
                          id: meme.creator_id,
                          username: profile.username,
                          avatar: profile.avatar
                        },
                        stats: {
                          views: meme.view_count || 0,
                          comments: meme.comment_count || 0
                        }
                      }} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">You haven't created any memes yet.</p>
                      <Button asChild className="mt-4">
                        <Link to="/create">Create Your First Meme</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="liked">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedMemes.length > 0 ? (
                    likedMemes.map(meme => (
                      <MemeCard key={meme.id} meme={{
                        id: meme.id,
                        title: meme.title || 'Untitled Meme',
                        imageUrl: meme.image_url,
                        createdAt: meme.created_at,
                        voteCount: meme.vote_count || 0,
                        creator: {
                          id: meme.creator.id,
                          username: meme.creator.username,
                          avatar: meme.creator.avatar
                        },
                        stats: {
                          views: meme.view_count || 0,
                          comments: meme.comment_count || 0
                        }
                      }} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-gray-500">You haven't liked any memes yet.</p>
                      <Button asChild className="mt-4">
                        <Link to="/browse">Browse Memes</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="text-center py-12">
                  <p className="text-gray-500">Activity feed coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
