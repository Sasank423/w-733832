
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useProtectedRoute = (redirectPath = '/') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate(redirectPath);
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, toast]);

  return { isAuthenticated, isLoading };
};
