
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface UseProtectedRouteOptions {
  allowGuest?: boolean;
  redirectTo?: string;
}

export const useProtectedRoute = (options: UseProtectedRouteOptions = {}) => {
  const { allowGuest = false, redirectTo = '/auth' } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated && !allowGuest) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, allowGuest, navigate, redirectTo, toast]);

  return { isAuthenticated, isLoading };
};
