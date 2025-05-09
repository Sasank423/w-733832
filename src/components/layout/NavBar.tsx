
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import UserMenu from '@/components/layout/UserMenu';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Close menu when user clicks outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container-layout h-14 max-w-screen-2xl flex items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-brand-purple">ImageGenHub</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          <Link 
            to="/browse" 
            className={`transition-colors hover:text-brand-purple ${location.pathname === '/browse' ? 'text-brand-purple font-medium' : ''}`}
          >
            Browse
          </Link>
          
          <Link 
            to="/create" 
            className={`transition-colors hover:text-brand-purple ${location.pathname === '/create' ? 'text-brand-purple font-medium' : ''}`}
          >
            Create
          </Link>
          
          {isAuthenticated && (
            <Link 
              to="/creator" 
              className={`transition-colors hover:text-brand-purple ${location.pathname === '/creator' ? 'text-brand-purple font-medium' : ''}`}
            >
              My Memes
            </Link>
          )}
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden space-x-2">
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          >
            {isMenuOpen ? <X /> : <Menu />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
        
        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 border-b border-border bg-background md:hidden p-4">
            <nav className="grid gap-2">
              <Link
                to="/"
                className="flex w-full items-center py-2 text-lg hover:text-brand-purple"
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="flex w-full items-center py-2 text-lg hover:text-brand-purple"
              >
                Browse
              </Link>
              <Link
                to="/create"
                className="flex w-full items-center py-2 text-lg hover:text-brand-purple"
              >
                Create
              </Link>
              {isAuthenticated && (
                <Link
                  to="/creator"
                  className="flex w-full items-center py-2 text-lg hover:text-brand-purple"
                >
                  My Memes
                </Link>
              )}
              <div className="py-2">
                <UserMenu />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
