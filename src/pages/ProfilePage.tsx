
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

// Mock data for the profile
const MOCK_USER_PROFILE = {
  id: "user1",
  username: "MemeCreator",
  joinDate: "2023-01-15T00:00:00Z",
  bio: "I create memes that make people laugh and think at the same time. Always looking for inspiration in everyday life!",
  avatarUrl: "https://api.dicebear.com/7.x/lorelei/svg?seed=MemeCreator",
  stats: {
    totalMemes: 42,
    totalLikes: 1872,
    totalViews: 25643,
    followers: 124,
    following: 87
  },
  badges: [
    { id: "badge1", name: "Top Creator", color: "purple" },
    { id: "badge2", name: "Weekly Champion", color: "amber" },
  ]
};

// Mock data for user memes
const MOCK_USER_MEMES = [
  {
    id: "meme1",
    title: "When the code finally works",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    createdAt: "2023-05-08T12:00:00Z",
    voteCount: 1562,
    creator: {
      id: "user1",
      username: "MemeCreator",
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
      id: "user1",
      username: "MemeCreator",
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
      id: "user1",
      username: "MemeCreator",
    },
    stats: {
      views: 972,
      comments: 28,
    }
  }
];

const ProfilePage = () => {
  useProtectedRoute();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("memes");
  const [profile, setProfile] = useState(MOCK_USER_PROFILE);
  const [memes, setMemes] = useState(MOCK_USER_MEMES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate API call to fetch profile data
      setTimeout(() => {
        setIsLoaded(true);
      }, 800);
    }
  }, [isAuthenticated]);

  if (isLoading || !isLoaded) return <Layout><div className="container-layout py-8">Loading...</div></Layout>;
  if (!isAuthenticated) return null; // This should be handled by useProtectedRoute

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
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="bg-brand-purple text-white text-xl">
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{profile.username}</CardTitle>
                <CardDescription className="flex items-center justify-center text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Joined {new Date(profile.joinDate).toLocaleDateString()}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {profile.badges.map(badge => (
                    <Badge key={badge.id} variant="outline" className={`bg-${badge.color}-100 text-${badge.color}-700 border-${badge.color}-200 dark:bg-${badge.color}-900/20 dark:text-${badge.color}-400 dark:border-${badge.color}-800`}>
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-6">{profile.bio}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profile.stats.followers}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{profile.stats.following}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <Heart className="h-4 w-4 mx-auto text-red-500 mb-1" />
                    <p className="text-xs font-medium">{profile.stats.totalLikes}</p>
                    <p className="text-xs text-gray-500">Likes</p>
                  </div>
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <MessageSquare className="h-4 w-4 mx-auto text-blue-500 mb-1" />
                    <p className="text-xs font-medium">{profile.stats.totalMemes}</p>
                    <p className="text-xs text-gray-500">Memes</p>
                  </div>
                  <div className="text-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <Eye className="h-4 w-4 mx-auto text-green-500 mb-1" />
                    <p className="text-xs font-medium">{profile.stats.totalViews}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                </div>
                
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
                  {memes.map(meme => (
                    <MemeCard key={meme.id} meme={meme} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="liked">
                <div className="text-center py-12">
                  <p className="text-gray-500">You haven't liked any memes yet.</p>
                  <Button asChild className="mt-4">
                    <Link to="/browse">Browse Memes</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-start space-x-3 pb-4 border-b last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=user${i}`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">User{i}</span> {i % 2 === 0 ? 'liked' : 'commented on'} your meme <Link to={`/meme/meme${i}`} className="text-brand-purple hover:underline">"When the code finally works"</Link>
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(Date.now() - i * 3600000).toLocaleString()}
                            </p>
                            {i % 2 !== 0 && (
                              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm">This is hilarious! I can totally relate 😂</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
