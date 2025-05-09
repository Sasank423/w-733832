import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import FeaturedMeme from '@/components/meme/FeaturedMeme';
import TrendingMemes from '@/components/meme/TrendingMemes';
import { useFeaturedMeme, useMemeOfTheDay } from '@/hooks/useMemes';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Landing = () => {
  const { data: weeklyChampion, isLoading: isLoadingWeekly } = useFeaturedMeme();
  const { data: memeOfTheDay, isLoading: isLoadingMemeOfDay } = useMemeOfTheDay();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleCreateMemeClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to create a meme.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <section className="container-layout py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-purple-dark mb-6">
            ImageGenHub
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto mt-4">
            Create, share, and discover AI-generated memes with our community of creators.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/browse">Browse Memes</Link>
            </Button>
            <Button size="lg" variant="outline" asChild title={!isAuthenticated ? 'Log in to create memes' : ''}>
              <Link
                to={isAuthenticated ? "/create" : "#"}
                tabIndex={!isAuthenticated ? -1 : 0}
                aria-disabled={!isAuthenticated}
                onClick={handleCreateMemeClick}
              >
                Create a Meme
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Meme of the Day */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meme of the Day</h2>
          
          {isLoadingMemeOfDay ? (
            <div className="rounded-xl overflow-hidden">
              <Skeleton className="w-full h-[50vh] md:h-[70vh]" style={{ minHeight: '400px' }} />
            </div>
          ) : memeOfTheDay ? (
            <FeaturedMeme meme={{...memeOfTheDay, is_meme_of_day: true}} />
          ) : (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-gray-500 text-sm">No meme of the day yet. Check back at noon for the highest voted meme!</p>
              <Button className="mt-3" size="sm" asChild title={!isAuthenticated ? 'Log in to create memes' : ''}>
                <Link
                  to="/browse"
                >
                  Browse Memes
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Weekly Champion */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Weekly Champion</h2>
          
          {isLoadingWeekly ? (
            <div className="rounded-xl overflow-hidden">
              <Skeleton className="w-full h-[50vh] md:h-[70vh]" style={{ minHeight: '400px' }} />
            </div>
          ) : weeklyChampion ? (
            <FeaturedMeme meme={{...weeklyChampion, is_weekly_champion: true}} />
          ) : (
            <div className="text-center p-6 border rounded-lg">
              <p className="text-gray-500 text-sm">No weekly champion yet. Keep voting for your favorite memes!</p>
              <Button className="mt-3" size="sm" asChild title={!isAuthenticated ? 'Log in to create memes' : ''}>
                <Link
                  to={isAuthenticated ? "/create" : "#"}
                  tabIndex={!isAuthenticated ? -1 : 0}
                  aria-disabled={!isAuthenticated}
                  onClick={handleCreateMemeClick}
                >
                  Create a Meme
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
