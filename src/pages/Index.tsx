
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import FeedFilters, { FeedType } from '@/components/meme/FeedFilters';
import MemeCard from '@/components/meme/MemeCard';
import FeaturedMeme from '@/components/meme/FeaturedMeme';
import { Button } from '@/components/ui/button';

// Mock data - In a real app, this would come from an API
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

const MOCK_MEMES = [
  {
    id: 'meme2',
    title: 'Debugging at 2am',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    createdAt: '2023-05-07T10:30:00Z',
    voteCount: 453,
    creator: {
      id: 'user2',
      username: 'NightCoder',
    },
  },
  {
    id: 'meme3',
    title: 'Monday mornings be like',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
    createdAt: '2023-05-06T09:15:00Z',
    voteCount: 287,
    creator: {
      id: 'user3',
      username: 'CoffeeAddict',
    },
    isFeatured: true,
  },
  {
    id: 'meme4',
    title: 'When you fix one bug and create ten more',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    createdAt: '2023-05-05T15:45:00Z',
    voteCount: 742,
    creator: {
      id: 'user4',
      username: 'BugHunter',
    },
  },
  {
    id: 'meme5',
    title: 'The perfect code doesn\'t exi...',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    createdAt: '2023-05-04T18:20:00Z',
    voteCount: 521,
    creator: {
      id: 'user5',
      username: 'CleanCoder',
    },
  },
];

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState<FeedType>('new');
  const [memes, setMemes] = useState(MOCK_MEMES);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // This would be an API call in a real app
    setMemes(MOCK_MEMES);
  }, [activeFilter]);

  const handleFilterChange = (filter: FeedType) => {
    setActiveFilter(filter);
    setPage(1);
    // In a real app, you'd fetch new data based on the filter
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading more memes
    setTimeout(() => {
      // In a real app, you'd append new memes from the API
      setMemes([...memes, ...memes.slice(0, 2)]);
      setPage(page + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container-layout py-8">
        {/* Featured meme section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Featured</h2>
          <FeaturedMeme meme={MOCK_MEME_OF_THE_DAY} />
        </section>
        
        {/* Feed section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Meme Feed</h2>
          <FeedFilters onFilterChange={handleFilterChange} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map(meme => (
              <MemeCard key={`${meme.id}-${page}`} meme={meme} />
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              onClick={handleLoadMore} 
              disabled={isLoading}
              variant="outline"
              size="lg"
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
