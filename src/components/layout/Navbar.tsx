
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Bell } from "lucide-react";
import UserMenu from "@/components/user/UserMenu";
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import NotificationCenter from '@/components/user/NotificationCenter';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');

  const openModal = (type: 'login' | 'signup') => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="border-b bg-white dark:bg-gray-900 sticky top-0 z-30">
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
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/create">Create</Link>
                </Button>
                <NotificationCenter />
                <UserMenu user={user} />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => openModal('login')}>
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
            <Link to="/create" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
              Create
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                  Notifications
                </Link>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                  Dashboard
                </Link>
                <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800">
                  Settings
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full mt-2"
                  onClick={() => console.log("Logout")}
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
