
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import AuthModal from '@/components/auth/AuthModal';

interface UseProtectedRouteOptions {
  redirectPath?: string;
  allowGuest?: boolean;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { redirectPath = '/', allowGuest = false } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !allowGuest) {
      if (redirectPath === '/') {
        // Show auth modal if redirect is to home
        setShowAuthModal(true);
        toast({
          title: "Authentication required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
      } else {
        // Redirect to specified path
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, toast, allowGuest]);

  return { 
    isAuthenticated, 
    isLoading, 
    showAuthModal,
    closeAuthModal: () => setShowAuthModal(false)
  };
};
