
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import FeaturedMeme from '@/components/meme/FeaturedMeme';
import TrendingMemes from '@/components/meme/TrendingMemes';

// Mock featured meme data
const featuredMeme = {
  id: "featured1",
  title: "When the code finally works after 5 hours of debugging",
  imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop",
  description: "That feeling when your code finally runs without errors after hours of debugging.",
  creator: {
    id: "user1",
    username: "codewizard",
  },
  voteCount: 1542,
  isMemeOfTheDay: true
};

const Landing = () => {
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
          <FeaturedMeme meme={featuredMeme} />
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
