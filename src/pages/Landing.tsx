
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import FeaturedMeme from '@/components/meme/FeaturedMeme';
import TrendingMemes from '@/components/meme/TrendingMemes';
import { useFeaturedMeme } from '@/hooks/useMemes';
import { Skeleton } from '@/components/ui/skeleton';

const Landing = () => {
  const { data: featuredMeme, isLoading: isLoadingFeatured } = useFeaturedMeme();

  return (
    <Layout>
      <section className="container-layout py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-purple-dark mb-4">
            ImageGenHub
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Create, share, and discover AI-generated memes with our community of creators.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/browse">Browse Memes</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/create">Create a Meme</Link>
            </Button>
          </div>
        </div>
        
        {/* Featured Meme */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Meme</h2>
          
          {isLoadingFeatured ? (
            <div className="rounded-xl overflow-hidden">
              <Skeleton className="w-full h-64 md:h-96" />
            </div>
          ) : featuredMeme ? (
            <FeaturedMeme meme={featuredMeme as any} />
          ) : (
            <div className="text-center p-12 border rounded-lg">
              <p className="text-gray-500">No featured memes yet. Be the first to create one!</p>
              <Button className="mt-4" asChild>
                <Link to="/create">Create a Meme</Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Trending Memes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
          <TrendingMemes />
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
