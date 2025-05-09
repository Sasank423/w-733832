import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Eye } from "lucide-react";
import UserMenu from "@/components/layout/UserMenu";
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import NotificationCenter from '@/components/user/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Navbar = ({ isCollapsed, toggleCollapse }: NavbarProps) => {
  const { isAuthenticated, profile, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');

  // Close auth modal when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsAuthModalOpen(false);
    }
  }, [isAuthenticated]);

  const openModal = (type: 'login' | 'signup') => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening auth modal
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false); // Close mobile menu after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navbarClasses = isCollapsed
    ? 'w-0 md:w-16 overflow-hidden transition-all duration-300'
    : 'w-full md:w-full transition-all duration-300';

  return (
    <nav className={`border-b bg-background sticky top-0 z-30 ${navbarClasses}`}>
      <div className="container-layout py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-purple-dark">
                ImageGenHub
              </span>
            </Link>
          </div>

          {/* Search - Hide on mobile, show on larger screens */}
          <div className={`hidden md:flex flex-1 mx-6 relative ${isSearchFocused ? 'flex-grow' : ''}`}>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search memes..." 
                className="pl-10 w-full"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <ThemeToggle />
            
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/browse">
                <Eye className="h-4 w-4 mr-1" /> Browse
              </Link>
            </Button>
            
            {isAuthenticated && profile ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/create">Create</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/drafts">My Drafts</Link>
                </Button>
                <NotificationCenter />
                <UserMenu />
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openModal('login')}
                >
                  Log in
                </Button>
                <Button onClick={() => openModal('signup')}>
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search memes..." className="pl-10 w-full" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-2 pb-3 space-y-1 animate-fade-in">
            <ThemeToggle />
            
            <Link to="/browse" className="flex items-center block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
              <Eye className="h-5 w-5 mr-2" /> Browse Memes
            </Link>
            
            {isAuthenticated && profile ? (
              <>
                <Link to="/create" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
                  Create
                </Link>
                <Link to="/drafts" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
                  My Drafts
                </Link>
                <Link to="/notifications" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
                  Notifications
                </Link>
                <Link to="/creator" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
                  Creator Dashboard
                </Link>
                <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">
                  Settings
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full mt-2"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => openModal('login')}
                >
                  Log in
                </Button>
                <Button 
                  className="w-full mt-2" 
                  onClick={() => openModal('signup')}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authModalType}
      />
    </nav>
  );
};

export default Navbar;
