
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import { Eye } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-background/90 pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-purple-dark to-brand-purple">
                Create and Share <br />
                <span className="text-foreground">Memes That Matter</span>
              </h1>
              <p className="text-xl mb-8 text-muted-foreground max-w-3xl mx-auto lg:mx-0">
                ImageGenHub is the ultimate platform for creating, sharing, and discovering the internet's most creative visual content. Join our community of meme enthusiasts today!
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                {isAuthenticated ? (
                  <Button size="lg" asChild>
                    <Link to="/create">Create Your First Meme</Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={() => document.getElementById('auth-modal-trigger')?.click()}>
                      Get Started
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/browse">
                        <Eye className="mr-2 h-5 w-5" /> Just Browse
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Image */}
            <div className="flex-1 relative">
              <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-300">
                    <img src="https://images.unsplash.com/photo-1500673922987-e212871fec22" alt="Meme example" className="w-full h-auto" />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl transform -rotate-3 hover:rotate-0 transition-all duration-300">
                    <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" alt="Meme example" className="w-full h-auto" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="rounded-lg overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition-all duration-300">
                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="Meme example" className="w-full h-auto" />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-300">
                    <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b" alt="Meme example" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ImageGenHub?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-brand-purple-light rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Easy Creation</h3>
              <p className="text-muted-foreground text-center">Intuitive tools to create memes in seconds without any design experience required.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-brand-yellow rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Vibrant Community</h3>
              <p className="text-muted-foreground text-center">Connect with creators and enthusiasts who share your sense of humor.</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-brand-green rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Wide Reach</h3>
              <p className="text-muted-foreground text-center">Share your creations across social media platforms with just one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-brand-purple/40 to-brand-purple-dark/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Creating?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-muted-foreground">Join thousands of creators on ImageGenHub and share your creativity with the world.</p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => document.getElementById('auth-modal-trigger')?.click()}>
                Sign Up Now - It's Free!
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/browse">
                  <Eye className="mr-2 h-5 w-5" /> Just Browse
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
