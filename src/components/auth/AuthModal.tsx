import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialView }: AuthModalProps) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const { isAuthenticated, isLoading } = useAuth();
  
  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('AuthModal: Modal opened, resetting view to:', initialView);
      setView(initialView);
    }
  }, [isOpen, initialView]);
  
  // Only close modal when authentication is complete and not loading
  useEffect(() => {
    console.log('AuthModal: Auth state changed:', { isAuthenticated, isLoading });
    if (isAuthenticated && !isLoading) {
      console.log('AuthModal: Authentication complete, closing modal');
      onClose();
    }
  }, [isAuthenticated, isLoading, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('AuthModal: Dialog open state changed:', open);
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {view === 'login' ? 'Welcome back!' : 'Create an account'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {view === 'login' ? (
            <LoginForm onSwitchToSignup={() => {
              console.log('AuthModal: Switching to signup view');
              setView('signup');
            }} />
          ) : (
            <SignupForm onSwitchToLogin={() => {
              console.log('AuthModal: Switching to login view');
              setView('login');
            }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
